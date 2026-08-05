import type { UserRole } from "@/generated/prisma/client";

import { DEFAULT_USER_ROLE } from "@/constants/roles";
import { createClient } from "@/lib/supabase/server";
import { activeOnly, prisma } from "@/lib/prisma";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentUserProfile() {
  const user = await getAuthUser();
  if (!user) return null;

  return prisma.userProfile.findFirst({
    where: {
      supabaseId: user.id,
      ...activeOnly,
    },
  });
}

export async function getOrCreateUserProfile() {
  const user = await getAuthUser();
  if (!user?.email) return null;

  const existing = await getCurrentUserProfile();
  if (existing) return existing;

  return prisma.userProfile.create({
    data: {
      supabaseId: user.id,
      email: user.email,
      fullName:
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : null,
      role: DEFAULT_USER_ROLE,
    },
  });
}

export async function requireRole(allowedRoles: UserRole[]) {
  const profile = await getCurrentUserProfile();
  if (!profile || !allowedRoles.includes(profile.role)) {
    return null;
  }

  return profile;
}
