import { AppShell } from "./_components/app-shell";
import { GuestHome } from "./_components/guest-home";
import { getGuestHomeData } from "@/lib/queries/workers";

export default async function HomePage() {
  const { workers, catalog } = await getGuestHomeData();

  return (
    <AppShell>
      <GuestHome workers={workers} catalog={catalog} />
    </AppShell>
  );
}
