import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  WORKER_FEATURED_SUBSCRIPTION_PRICE: z.string().default("7.50"),
  COMPANY_FEATURED_AD_PRICE: z.string().default("20.00"),
  CURRENCY: z.string().default("PEN"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export const serverEnv = serverEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  WORKER_FEATURED_SUBSCRIPTION_PRICE:
    process.env.WORKER_FEATURED_SUBSCRIPTION_PRICE,
  COMPANY_FEATURED_AD_PRICE: process.env.COMPANY_FEATURED_AD_PRICE,
  CURRENCY: process.env.CURRENCY,
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
