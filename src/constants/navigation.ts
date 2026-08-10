import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ClipboardList,
  HardHat,
  LayoutDashboard,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** Navegación pública principal (sin cuenta / sin menú de perfil). */
export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/", icon: LayoutDashboard },
  { label: "Trabajadores", href: "/trabajadores", icon: HardHat },
  { label: "Empresas", href: "/empresas", icon: Building2 },
  {
    label: "Solicitudes",
    href: "/solicitudes",
    icon: ClipboardList,
  },
];

/**
 * Solicitudes = requerimientos de clientes (tablero de obras).
 * Públicos y anónimos: especialidad, distrito, metraje y fecha.
 * Aún no implementado como página; el ítem reserva la ruta.
 */
export const CLIENT_REQUESTS_NAV = {
  label: "Solicitudes",
  href: "/solicitudes",
  description:
    "Tablero de requerimientos de clientes que buscan mano de obra o empresas.",
} as const;
