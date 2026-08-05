"use server";

import { revalidatePath } from "next/cache";

import { DEFAULT_USER_ROLE } from "@/constants/roles";
import { getAuthUser } from "@/lib/auth/session";
import { activeOnly, prisma } from "@/lib/prisma";

type ActionResult = {
  error?: string;
};

export async function syncUserProfileAction(
  fullName?: string,
): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user?.email) {
    return { error: "No hay sesión activa." };
  }

  await prisma.userProfile.upsert({
    where: { supabaseId: user.id },
    update: {
      email: user.email,
      ...(fullName ? { fullName } : {}),
      isDeleted: false,
      deletedAt: null,
    },
    create: {
      supabaseId: user.id,
      email: user.email,
      fullName: fullName ?? null,
      role: DEFAULT_USER_ROLE,
    },
  });

  revalidatePath("/", "layout");
  return {};
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
  });

  if (!profile) return { error: "Perfil no encontrado." };
  if (profile.role === "ADMIN") return {};

  await prisma.userProfile.update({
    where: { id: profile.id },
    data: { role: "ANUNCIANTE" },
  });

  revalidatePath("/", "layout");
  return {};
}
