import { serverEnv } from "@/lib/env/server";

export function getPricingConfig() {
  return {
    workerFeaturedSubscriptionPrice: Number(
      serverEnv.WORKER_FEATURED_SUBSCRIPTION_PRICE,
    ),
    companyFeaturedAdPrice: Number(serverEnv.COMPANY_FEATURED_AD_PRICE),
    currency: serverEnv.CURRENCY,
  };
}
