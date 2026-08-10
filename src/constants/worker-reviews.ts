export const WORKER_REVIEW_LIMITS = {
  minBodyLength: 10,
  maxBodyLength: 400,
  minRating: 1,
  maxRating: 5,
  maxPhotos: 3,
} as const;

export const WORKER_PORTFOLIO_LIMITS = {
  maxPhotos: 12,
  maxDescriptionLength: 160,
} as const;

export const WORKER_PROFILE_COPY = {
  reviewsTitle: "Opiniones de clientes",
  reviewsEmpty: "Aún no hay reseñas. Sé el primero en comentar.",
  portfolioTitle: "Trabajos realizados",
  portfolioEmpty: "Este perfil aún no tiene fotos de trabajos.",
  reviewLoginRequired: "Inicia sesión para dejar una opinión.",
  reviewOwnProfileBlocked: "No puedes reseñar tu propio perfil.",
  reviewAlreadyExists: "Ya dejaste una opinión en este perfil.",
} as const;
