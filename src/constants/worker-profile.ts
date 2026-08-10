export const WORKER_PROFILE_RULES = {
  maxPublicProfilesPerUser: 1,
  duplicateProfileMessage:
    "Cada trabajador solo puede tener un perfil público. Edítalo desde tu panel de anuncios.",
} as const;

export function canCreatePublicWorkerProfile(hasExistingProfile: boolean) {
  return !hasExistingProfile;
}
