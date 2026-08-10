import { AppShell } from "@/app/_components/app-shell";
import { getAuthUser, getCurrentUserProfile } from "@/lib/auth/session";
import { getWorkersDirectoryData } from "@/lib/queries/workers";

import { WorkersDirectory } from "./_components/workers-directory";

export default async function TrabajadoresPage() {
  const [{ workers, catalog }, user] = await Promise.all([
    getWorkersDirectoryData(),
    getAuthUser(),
  ]);

  const profile = user ? await getCurrentUserProfile() : null;
  const senderName =
    profile?.fullName?.trim() ||
    (typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null);

  return (
    <AppShell>
      <WorkersDirectory
        workers={workers}
        catalog={catalog}
        isAuthenticated={Boolean(user)}
        senderName={senderName}
      />
    </AppShell>
  );
}
