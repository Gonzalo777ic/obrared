import { z } from "zod";

import {
  WORKER_PORTFOLIO_LIMITS,
  WORKER_REVIEW_LIMITS,
} from "@/constants/worker-reviews";

export const workerReviewSchema = z.object({
  workerProfileId: z.string().uuid("Perfil inválido."),
  body: z
    .string()
    .trim()
    .min(
      WORKER_REVIEW_LIMITS.minBodyLength,
      `Escribe al menos ${WORKER_REVIEW_LIMITS.minBodyLength} caracteres.`,
    )
    .max(
      WORKER_REVIEW_LIMITS.maxBodyLength,
      `Máximo ${WORKER_REVIEW_LIMITS.maxBodyLength} caracteres.`,
    ),
  rating: z.coerce
    .number()
    .int()
    .min(WORKER_REVIEW_LIMITS.minRating)
    .max(WORKER_REVIEW_LIMITS.maxRating),
  photoUrls: z
    .array(z.string().url())
    .max(
      WORKER_REVIEW_LIMITS.maxPhotos,
      `Máximo ${WORKER_REVIEW_LIMITS.maxPhotos} fotos.`,
    )
    .default([]),
});

export type WorkerReviewInput = z.infer<typeof workerReviewSchema>;

export const portfolioItemSchema = z.object({
  url: z.string().url("Sube una imagen válida."),
  description: z
    .string()
    .trim()
    .max(
      WORKER_PORTFOLIO_LIMITS.maxDescriptionLength,
      `Máximo ${WORKER_PORTFOLIO_LIMITS.maxDescriptionLength} caracteres.`,
    )
    .optional()
    .or(z.literal("")),
});

export const addPortfolioItemsSchema = z.object({
  workerProfileId: z.string().uuid("Perfil inválido."),
  items: z
    .array(portfolioItemSchema)
    .min(1, "Agrega al menos una foto.")
    .max(WORKER_PORTFOLIO_LIMITS.maxPhotos),
});

export type AddPortfolioItemsInput = z.infer<typeof addPortfolioItemsSchema>;
