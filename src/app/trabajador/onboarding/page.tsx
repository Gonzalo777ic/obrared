import { WORKER_NAV_CTA } from "@/constants/user-nav";
import { getAuthUser, getCurrentUserProfile } from "@/lib/auth/session";
import { getHomeCatalog } from "@/lib/queries/catalog";
import { redirect } from "next/navigation";

import { AppShell } from "@/app/_components/app-shell";

import { WorkerOnboardingForm } from "./_components/worker-onboarding-form";

export default async function WorkerOnboardingPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect(`/auth?next=${encodeURIComponent(WORKER_NAV_CTA.offerServices.href)}`);
  }

  const [profile, catalog] = await Promise.all([
    getCurrentUserProfile(),
    getHomeCatalog(),
  ]);

  if (profile?.workerProfile) {
    redirect(WORKER_NAV_CTA.adsPanel.href);
  }

  const defaultProfilePhotoUrl =
    typeof user.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : typeof user.user_metadata?.picture === "string"
        ? user.user_metadata.picture
        : null;

  return (
    <AppShell>
      <WorkerOnboardingForm
        catalog={catalog}
        fullName={profile?.fullName ?? null}
        defaultProfilePhotoUrl={defaultProfilePhotoUrl}
      />
    </AppShell>
  );
}
