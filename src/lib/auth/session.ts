import { DEFAULT_ROLE_SLUG, type RoleSlug } from "@/constants/roles";
import { getDefaultRole } from "@/lib/queries/roles";
import { createClient } from "@/lib/supabase/server";
import { activeOnly, prisma } from "@/lib/prisma";

const profileInclude = {
  role: true,
} as const;

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
    include: profileInclude,
  });
}

export async function getOrCreateUserProfile() {
  const user = await getAuthUser();
  if (!user?.email) return null;

  const existing = await getCurrentUserProfile();
  if (existing) return existing;

  const defaultRole = await getDefaultRole();

  return prisma.userProfile.create({
    data: {
      supabaseId: user.id,
      email: user.email,
      roleId: defaultRole.id,
      fullName:
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : null,
    },
    include: profileInclude,
  });
}

export async function requireRole(allowedSlugs: RoleSlug[]) {
  const profile = await getCurrentUserProfile();
  if (!profile || !allowedSlugs.includes(profile.role.slug as RoleSlug)) {
    return null;
  }

  return profile;
}

export async function syncProfileFromAuthUser(fullName?: string) {
  const user = await getAuthUser();
  if (!user?.email) return null;

  const defaultRole = await getDefaultRole();

  return prisma.userProfile.upsert({
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
      roleId: defaultRole.id,
    },
    include: profileInclude,
  });
}
