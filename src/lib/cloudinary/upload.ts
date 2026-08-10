import { v2 as cloudinary } from "cloudinary";

import { assertCloudinaryEnv } from "@/lib/cloudinary/config";

function getCloudinaryClient() {
  const env = assertCloudinaryEnv();
  cloudinary.config({
    cloud_name: env.cloudName,
    api_key: env.apiKey,
    api_secret: env.apiSecret,
    secure: true,
  });

  return cloudinary;
}

export { getCloudinaryClient as cloudinary };

export const CLOUDINARY_IMAGE_TRANSFORMS = {
  profile: [
    { width: 800, height: 800, crop: "fill", gravity: "auto" },
    { fetch_format: "auto", quality: "auto:good" },
  ],
  gallery: [
    { width: 1600, height: 1200, crop: "limit" },
    { fetch_format: "auto", quality: "auto:good" },
  ],
  review: [
    { width: 1200, height: 1200, crop: "limit" },
    { fetch_format: "auto", quality: "auto:good" },
  ],
} as const;

export const CLOUDINARY_FOLDER_PATHS = {
  profile: "obrared/workers/profile",
  gallery: "obrared/workers/gallery",
  review: "obrared/reviews",
} as const;

export type CloudinaryUploadFolder = keyof typeof CLOUDINARY_FOLDER_PATHS;

export async function uploadOptimizedImage(
  fileBuffer: Buffer,
  mimeType: string,
  folder: CloudinaryUploadFolder,
) {
  const client = getCloudinaryClient();
  const transformation = CLOUDINARY_IMAGE_TRANSFORMS[folder];

  const result = await client.uploader.upload(
    `data:${mimeType};base64,${fileBuffer.toString("base64")}`,
    {
      folder: CLOUDINARY_FOLDER_PATHS[folder],
      resource_type: "image",
      transformation,
    },
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function uploadRemoteImage(
  remoteUrl: string,
  folder: CloudinaryUploadFolder,
) {
  const client = getCloudinaryClient();
  const transformation = CLOUDINARY_IMAGE_TRANSFORMS[folder];

  const result = await client.uploader.upload(remoteUrl, {
    folder: CLOUDINARY_FOLDER_PATHS[folder],
    resource_type: "image",
    transformation,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}
