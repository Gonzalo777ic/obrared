import { type ReactNode } from "react";

import { getAuthUser, getOrCreateUserProfile } from "@/lib/auth/session";

import { AppShellClient } from "./app-shell-client";
import { UserAuthArea } from "./user-auth-area";

type AppShellProps = {
  children: ReactNode;
};

export async function AppShell({ children }: AppShellProps) {
  const user = await getAuthUser();
  const profile = user ? await getOrCreateUserProfile() : null;

  const authArea = (
    <UserAuthArea
      email={user?.email}
      fullName={profile?.fullName}
      roleName={profile?.role.name}
    />
  );

  return <AppShellClient authArea={authArea}>{children}</AppShellClient>;
}
