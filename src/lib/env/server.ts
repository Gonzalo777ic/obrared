import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  WORKER_FEATURED_SUBSCRIPTION_PRICE: z.string().default("7.50"),
  COMPANY_FEATURED_AD_PRICE: z.string().default("20.00"),
  CURRENCY: z.string().default("PEN"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
});

export const serverEnv = serverEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  WORKER_FEATURED_SUBSCRIPTION_PRICE:
    process.env.WORKER_FEATURED_SUBSCRIPTION_PRICE,
  COMPANY_FEATURED_AD_PRICE: process.env.COMPANY_FEATURED_AD_PRICE,
  CURRENCY: process.env.CURRENCY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});
