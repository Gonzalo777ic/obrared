"use server";

import { revalidatePath } from "next/cache";

import { ROLE_SLUGS } from "@/constants/roles";
import {
  getAuthUser,
  syncProfileFromAuthUser,
} from "@/lib/auth/session";
import { getRoleBySlug } from "@/lib/queries/roles";
import { activeOnly, prisma } from "@/lib/prisma";

type ActionResult = {
  error?: string;
};

export async function syncUserProfileAction(
  fullName?: string,
): Promise<ActionResult> {
  if (!process.env.DATABASE_URL) {
    return {
      error:
        "Falta DATABASE_URL en .env. Configura PostgreSQL (Supabase) para sincronizar tu perfil.",
    };
  }

  try {
    const user = await getAuthUser();
    if (!user?.email) {
      return { error: "No hay sesión activa." };
    }

    await syncProfileFromAuthUser(fullName);

    revalidatePath("/", "layout");
    return {};
  } catch {
    return {
      error:
        "No se pudo guardar tu perfil. Verifica la conexión a la base de datos.",
    };
  }
}

export async function signOutAction(): Promise<void> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

export async function promoteToAdvertiserAction(): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user) return { error: "Debes iniciar sesión." };

  const profile = await prisma.userProfile.findFirst({
    where: { supabaseId: user.id, ...activeOnly },
    include: { role: true },
  });

  if (!profile) return { error: "Perfil no encontrado." };
  if (profile.role.slug === ROLE_SLUGS.ADMIN) return {};

  const advertiserRole = await getRoleBySlug(ROLE_SLUGS.ANUNCIANTE);
  if (!advertiserRole) {
    return { error: "Rol anunciante no configurado en la base de datos." };
  }

  await prisma.userProfile.update({
    where: { id: profile.id },
    data: { roleId: advertiserRole.id },
  });

  revalidatePath("/", "layout");
  return {};
}
