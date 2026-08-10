import { serverEnv } from "@/lib/env/server";

export function assertCloudinaryEnv() {
  if (
    !serverEnv.CLOUDINARY_CLOUD_NAME ||
    !serverEnv.CLOUDINARY_API_KEY ||
    !serverEnv.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Cloudinary no configurado. Agrega CLOUDINARY_* en tu archivo .env.",
    );
  }

  return {
    cloudName: serverEnv.CLOUDINARY_CLOUD_NAME,
    apiKey: serverEnv.CLOUDINARY_API_KEY,
    apiSecret: serverEnv.CLOUDINARY_API_SECRET,
  };
}
