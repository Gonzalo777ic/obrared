import { getDepartments, parseUbigeo, searchByName } from "ubigeo-fns";
import { z } from "zod";

export const deviceCoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type ResolvedDeviceDistrict = {
  departmentCode: string;
  departmentName: string;
  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
};

type NominatimAddress = {
  suburb?: string;
  city_district?: string;
  district?: string;
  neighbourhood?: string;
  quarter?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state_district?: string;
  state?: string;
  region?: string;
};

type NominatimResponse = {
  address?: NominatimAddress;
  display_name?: string;
};

type UbigeoSearchHit = {
  ubigeo: string;
  district: string;
  province: string;
  department: string;
};

function normalizeLocationName(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/^(distrito|provincia|departamento)\s+(de\s+)?/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function extractDistrictCandidates(address: NominatimAddress) {
  const raw = [
    address.suburb,
    address.city_district,
    address.district,
    address.neighbourhood,
    address.quarter,
    address.city,
    address.town,
    address.village,
    address.municipality,
    address.county,
  ];

  const unique: string[] = [];
  for (const value of raw) {
    const trimmed = value?.trim();
    if (!trimmed) continue;
    const normalized = normalizeLocationName(trimmed);
    if (!normalized) continue;
    if (unique.some((item) => normalizeLocationName(item) === normalized)) {
      continue;
    }
    unique.push(trimmed);
  }

  return unique;
}

function scoreDistrictMatch(
  hit: UbigeoSearchHit,
  query: string,
  preferredDepartment?: string | null,
) {
  const normalizedQuery = normalizeLocationName(query);
  const district = normalizeLocationName(hit.district);
  const department = normalizeLocationName(hit.department);
  const preferred = preferredDepartment
    ? normalizeLocationName(preferredDepartment)
    : null;

  let score = 0;

  if (district === normalizedQuery) score += 100;
  else if (district.startsWith(normalizedQuery) || normalizedQuery.startsWith(district)) {
    score += 60;
  } else if (district.includes(normalizedQuery) || normalizedQuery.includes(district)) {
    score += 30;
  } else {
    return -1;
  }

  if (preferred) {
    if (department === preferred) score += 50;
    else if (department.includes(preferred) || preferred.includes(department)) {
      score += 20;
    } else {
      score -= 40;
    }
  }

  return score;
}

function resolveDepartmentHint(
  address: NominatimAddress,
): string | null {
  const hints = [address.state, address.region, address.state_district];
  const departments = getDepartments();

  for (const hint of hints) {
    if (!hint?.trim()) continue;
    const normalizedHint = normalizeLocationName(hint);
    const match = departments.find((item) => {
      const name = normalizeLocationName(item.name);
      return (
        name === normalizedHint ||
        name.includes(normalizedHint) ||
        normalizedHint.includes(name)
      );
    });
    if (match) return match.name;
  }

  return null;
}

function resolveDistrictByName(
  name: string,
  preferredDepartment?: string | null,
): ResolvedDeviceDistrict | null {
  const results = searchByName(name, { limit: 12 }) as UbigeoSearchHit[];
  if (results.length === 0) return null;

  const ranked = results
    .map((hit) => ({
      hit,
      score: scoreDistrictMatch(hit, name, preferredDepartment),
    }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score);

  const best = ranked[0]?.hit;
  if (!best) return null;

  const parsed = parseUbigeo(best.ubigeo);
  if (!parsed) return null;

  // parseUbigeo ya devuelve provinceCode de 4 dígitos (ej. "1501").
  return {
    departmentCode: parsed.departmentCode,
    departmentName: best.department,
    cityCode: parsed.provinceCode,
    cityName: best.province,
    districtCode: parsed.districtCode,
    districtName: best.district,
  };
}

export async function resolveDistrictFromCoordinates(
  lat: number,
  lng: number,
): Promise<ResolvedDeviceDistrict | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "es");
  url.searchParams.set("countrycodes", "pe");
  url.searchParams.set("zoom", "18");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "ObraRed/1.0 (https://obrared.pe)",
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as NominatimResponse;
  const address = data.address ?? {};
  const preferredDepartment = resolveDepartmentHint(address);
  const candidates = extractDistrictCandidates(address);

  for (const candidate of candidates) {
    const resolved = resolveDistrictByName(candidate, preferredDepartment);
    if (resolved) return resolved;
  }

  if (data.display_name) {
    const firstPart = data.display_name.split(",")[0]?.trim();
    if (firstPart) {
      const resolved = resolveDistrictByName(firstPart, preferredDepartment);
      if (resolved) return resolved;
    }
  }

  return null;
}
