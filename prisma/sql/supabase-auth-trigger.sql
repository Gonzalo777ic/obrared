-- =============================================================================
-- PASO 1: Ejecutar ESTE archivo completo en Supabase → SQL Editor
-- Requisitos previos: pnpm db:push && pnpm db:seed
-- =============================================================================

-- 1) Función + trigger (usuarios NUEVOS en Authentication)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_role_id uuid;
  user_full_name text;
BEGIN
  SELECT id
  INTO default_role_id
  FROM public.roles
  WHERE slug = 'cliente'
    AND is_deleted = false
    AND is_active = true
  LIMIT 1;

  IF default_role_id IS NULL THEN
    RAISE EXCEPTION 'Rol cliente no encontrado. Ejecuta pnpm db:seed primero.';
  END IF;

  user_full_name := NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), '');

  INSERT INTO public.user_profiles (
    id,
    supabase_id,
    email,
    role_id,
    full_name,
    is_deleted,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    NEW.id,
    COALESCE(NEW.email, ''),
    default_role_id,
    user_full_name,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (supabase_id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- 2) Backfill: usuarios que ya existían en auth.users ANTES del trigger
INSERT INTO public.user_profiles (
  id,
  supabase_id,
  email,
  role_id,
  full_name,
  is_deleted,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  COALESCE(u.email, ''),
  r.id,
  NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
  false,
  NOW(),
  NOW()
FROM auth.users u
CROSS JOIN public.roles r
WHERE r.slug = 'cliente'
  AND r.is_deleted = false
  AND r.is_active = true
  AND NOT EXISTS (
    SELECT 1
    FROM public.user_profiles p
    WHERE p.supabase_id = u.id
  );

-- 3) Verificación
SELECT
  u.id AS auth_user_id,
  u.email AS auth_email,
  p.id AS profile_id,
  p.email AS profile_email,
  r.slug AS role_slug,
  r.name AS role_name
FROM auth.users u
LEFT JOIN public.user_profiles p ON p.supabase_id = u.id
LEFT JOIN public.roles r ON r.id = p.role_id
ORDER BY u.created_at DESC;
