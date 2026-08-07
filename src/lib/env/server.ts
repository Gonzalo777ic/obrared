import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
  WORKER_FEATURED_SUBSCRIPTION_PRICE: z.string().default("7.50"),
  COMPANY_FEATURED_AD_PRICE: z.string().default("20.00"),
  CURRENCY: z.string().default("PEN"),
});

export const serverEnv = serverEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  WORKER_FEATURED_SUBSCRIPTION_PRICE:
    process.env.WORKER_FEATURED_SUBSCRIPTION_PRICE,
  COMPANY_FEATURED_AD_PRICE: process.env.COMPANY_FEATURED_AD_PRICE,
  CURRENCY: process.env.CURRENCY,
});
