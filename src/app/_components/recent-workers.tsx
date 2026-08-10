import { WorkerCard } from "@/components/workers/worker-card";
import type { WorkerProfile } from "@/types/worker";

type RecentWorkersProps = {
  workers: WorkerProfile[];
  locationActive: boolean;
  isAuthenticated: boolean;
  senderName?: string | null;
};

export function RecentWorkers({
  workers,
  locationActive,
  isAuthenticated,
  senderName = null,
}: RecentWorkersProps) {
  if (workers.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Más resultados
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {locationActive ? "Otros profesionales cercanos" : "Más profesionales"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {locationActive
              ? "Continúa explorando perfiles disponibles en tu zona."
              : "Explora más perfiles según tus filtros."}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {workers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              layout="horizontal"
              isAuthenticated={isAuthenticated}
              senderName={senderName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
