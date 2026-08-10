import { ROLE_SLUGS, type RoleSlug } from "@/constants/roles";
import { WORKER_PROFILE_RULES } from "@/constants/worker-profile";

export const WORKER_NAV_CTA = {
  offerServices: {
    label: "Ofrecer mis servicios",
    shortLabel: "Anunciarme",
    href: "/trabajador/onboarding",
  },
  adsPanel: {
    label: "Mi panel de anuncios",
    shortLabel: "Mi panel",
    href: "/panel/anuncios",
  },
} as const;

export const USER_MENU_ITEMS = {
  settings: {
    label: "Configuración",
    href: "/configuracion",
  },
  signOut: {
    label: "Cerrar sesión",
  },
} as const;

export const CONTACT_GATE_COPY = {
  title: "Inicia sesión para contactar",
  description:
    "Puedes ver perfiles y anuncios sin cuenta. Para contactar a un profesional y ver sus datos de contacto, regístrate o inicia sesión en ObraRed.",
  loginLabel: "Iniciar sesión",
  registerLabel: "Crear cuenta",
} as const;

const PUBLISHER_ROLE_SLUGS: RoleSlug[] = [
  ROLE_SLUGS.ANUNCIANTE,
  ROLE_SLUGS.TRABAJADOR,
  ROLE_SLUGS.EMPRESA,
  ROLE_SLUGS.ADMIN,
];

export function isPublisherRole(roleSlug: string | null | undefined) {
  if (!roleSlug) return false;
  return PUBLISHER_ROLE_SLUGS.includes(roleSlug as RoleSlug);
}

export function shouldShowOfferServicesCta(
  roleSlug: string | null | undefined,
  hasPublicWorkerProfile = false,
) {
  return (
    roleSlug === ROLE_SLUGS.CLIENTE &&
    !hasPublicWorkerProfile &&
    WORKER_PROFILE_RULES.maxPublicProfilesPerUser > 0
  );
}

export function shouldShowAdsPanelCta(
  roleSlug: string | null | undefined,
  hasPublicWorkerProfile = false,
) {
  if (roleSlug === ROLE_SLUGS.ADMIN) return false;
  return hasPublicWorkerProfile || isPublisherRole(roleSlug);
}

export function canAccessAdsPanel(
  roleSlug: string | null | undefined,
  hasPublicWorkerProfile: boolean,
) {
  return shouldShowAdsPanelCta(roleSlug, hasPublicWorkerProfile);
}
