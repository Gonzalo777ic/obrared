import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/app/_components/app-shell";
import { WorkerProfileView } from "@/components/workers/worker-profile-view";
import { PUBLISHER_TYPES } from "@/constants/publisher-type";
import { getAuthUser, getCurrentUserProfile } from "@/lib/auth/session";
import { getPublicWorkerById } from "@/lib/queries/worker-detail";
import { activeOnly, prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TrabajadorProfilePage({ params }: PageProps) {
  const { id } = await params;
  const worker = await getPublicWorkerById(id);

  if (!worker) notFound();

  if (worker.publisherType === PUBLISHER_TYPES.company.value) {
    redirect(`/empresas/${worker.id}`);
  }

  const [user, profile] = await Promise.all([
    getAuthUser(),
    getCurrentUserProfile(),
  ]);

  const isOwner = Boolean(
    profile?.workerProfile && profile.workerProfile.id === worker.id,
  );

  let canReview = false;
  if (user && profile && !isOwner) {
    const existing = await prisma.workerReview.findFirst({
      where: {
        workerProfileId: worker.id,
        authorUserProfileId: profile.id,
        ...activeOnly,
      },
      select: { id: true },
    });
    canReview = !existing;
  }

  const senderName =
    profile?.fullName?.trim() ||
    (typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null);

  return (
    <AppShell>
      <WorkerProfileView
        worker={worker}
        isAuthenticated={Boolean(user)}
        isOwner={isOwner}
        canReview={canReview}
        senderName={senderName}
        backHref="/trabajadores"
        backLabel="Volver a trabajadores"
      />
    </AppShell>
  );
}
