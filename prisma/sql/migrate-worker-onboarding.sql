-- Migración manual para onboarding de trabajadores.
-- Ejecutar en Supabase SQL Editor si `pnpm db:push --accept-data-loss` no es viable.

-- 1) Nuevas columnas en worker_profiles
ALTER TABLE worker_profiles
  ADD COLUMN IF NOT EXISTS whatsapp TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS document_type TEXT NOT NULL DEFAULT 'dni',
  ADD COLUMN IF NOT EXISTS document_number TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS presentation TEXT,
  ADD COLUMN IF NOT EXISTS years_of_experience INTEGER NOT NULL DEFAULT 0;

-- 2) Tablas puente (si db push no las creó aún)
CREATE TABLE IF NOT EXISTS worker_profile_specialties (
  worker_profile_id UUID NOT NULL REFERENCES worker_profiles(id),
  specialty_id UUID NOT NULL REFERENCES specialties(id),
  PRIMARY KEY (worker_profile_id, specialty_id)
);

CREATE TABLE IF NOT EXISTS worker_profile_machinery (
  worker_profile_id UUID NOT NULL REFERENCES worker_profiles(id),
  machinery_id UUID NOT NULL REFERENCES machinery_types(id),
  PRIMARY KEY (worker_profile_id, machinery_id)
);

CREATE TABLE IF NOT EXISTS worker_coverage_districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_profile_id UUID NOT NULL REFERENCES worker_profiles(id),
  department_code TEXT NOT NULL,
  department_name TEXT NOT NULL,
  city_code TEXT NOT NULL,
  city_name TEXT NOT NULL,
  district_code TEXT NOT NULL,
  district_name TEXT NOT NULL,
  UNIQUE (worker_profile_id, district_code)
);

-- 3) Migrar FKs antiguas a tablas puente (si aún existen columnas legacy)
INSERT INTO worker_profile_specialties (worker_profile_id, specialty_id)
SELECT id, specialty_id
FROM worker_profiles
WHERE specialty_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO worker_profile_machinery (worker_profile_id, machinery_id)
SELECT id, machinery_id
FROM worker_profiles
WHERE machinery_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO worker_coverage_districts (
  worker_profile_id,
  department_code,
  department_name,
  city_code,
  city_name,
  district_code,
  district_name
)
SELECT
  id,
  department_code,
  department_name,
  city_code,
  city_name,
  district_code,
  district_name
FROM worker_profiles
ON CONFLICT DO NOTHING;

-- 4) Eliminar columnas legacy (solo cuando confirmes backup)
-- ALTER TABLE worker_profiles DROP COLUMN IF EXISTS specialty_id;
-- ALTER TABLE worker_profiles DROP COLUMN IF EXISTS machinery_id;
