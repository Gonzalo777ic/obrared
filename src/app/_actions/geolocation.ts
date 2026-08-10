"use server";

import {
  deviceCoordinatesSchema,
  resolveDistrictFromCoordinates,
} from "@/lib/ubigeo/resolve-device-district";

export async function resolveDeviceDistrictAction(input: {
  lat: number;
  lng: number;
}) {
  const parsed = deviceCoordinatesSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Coordenadas inválidas." };
  }

  const district = await resolveDistrictFromCoordinates(
    parsed.data.lat,
    parsed.data.lng,
  );

  if (!district) {
    return {
      error:
        "No pudimos identificar tu distrito. Selecciónalo manualmente en el buscador.",
    };
  }

  return { district };
}
