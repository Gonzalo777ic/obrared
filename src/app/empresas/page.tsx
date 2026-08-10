import { AppShell } from "@/app/_components/app-shell";
import { getAuthUser, getCurrentUserProfile } from "@/lib/auth/session";
import { getCompaniesDirectoryData } from "@/lib/queries/workers";

import { CompaniesDirectory } from "./_components/companies-directory";

export default async function EmpresasPage() {
  const [{ workers, catalog }, user] = await Promise.all([
    getCompaniesDirectoryData(),
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
      <CompaniesDirectory
        workers={workers}
        catalog={catalog}
        isAuthenticated={Boolean(user)}
        senderName={senderName}
      />
    </AppShell>
  );
}
