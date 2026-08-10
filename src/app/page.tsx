import { AppShell } from "./_components/app-shell";
import { GuestHome } from "./_components/guest-home";
import { getAuthUser, getCurrentUserProfile } from "@/lib/auth/session";
import { getGuestHomeData } from "@/lib/queries/workers";

export default async function HomePage() {
  const [{ workers, catalog }, user] = await Promise.all([
    getGuestHomeData(),
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
      <GuestHome
        workers={workers}
        catalog={catalog}
        isAuthenticated={Boolean(user)}
        senderName={senderName}
      />
    </AppShell>
  );
}
