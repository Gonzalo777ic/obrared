import { redirect } from "next/navigation";

import { WORKER_NAV_CTA, canAccessAdsPanel } from "@/constants/user-nav";
import { getAuthUser, getCurrentUserProfile } from "@/lib/auth/session";
import { getMyPublicWorkerProfile } from "@/lib/queries/my-worker-profile";

import { AppShell } from "@/app/_components/app-shell";
import { AdsPanelHome } from "./_components/ads-panel-home";

export default async function AdsPanelPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect(`/auth?next=${encodeURIComponent(WORKER_NAV_CTA.adsPanel.href)}`);
  }

  const profile = await getCurrentUserProfile();

  if (
    !profile ||
    !canAccessAdsPanel(profile.role.slug, Boolean(profile.workerProfile))
  ) {
    redirect(WORKER_NAV_CTA.offerServices.href);
  }

  const myAd = await getMyPublicWorkerProfile(profile.id);

  return (
    <AppShell>
      <AdsPanelHome
        fullName={profile.fullName}
        roleName={profile.role.name}
        myAd={myAd}
      />
    </AppShell>
  );
}
