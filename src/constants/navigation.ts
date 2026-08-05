import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ClipboardList,
  HardHat,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/", icon: LayoutDashboard },
  { label: "Trabajadores", href: "/trabajadores", icon: HardHat },
  { label: "Empresas", href: "/empresas", icon: Building2 },
  { label: "Solicitudes", href: "/solicitudes", icon: ClipboardList },
  { label: "Configuración", href: "/configuracion", icon: Settings },
];
