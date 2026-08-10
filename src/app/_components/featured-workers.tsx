import { WorkerCard } from "@/components/workers/worker-card";
import type { WorkerProfile } from "@/types/worker";

type FeaturedWorkersProps = {
  workers: WorkerProfile[];
  locationActive: boolean;
  isAuthenticated: boolean;
  senderName?: string | null;
};

export function FeaturedWorkers({
  workers,
  locationActive,
  isAuthenticated,
  senderName = null,
}: FeaturedWorkersProps) {
  if (workers.length === 0) return null;

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Resultados
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {locationActive ? "Profesionales en tu zona" : "Profesionales disponibles"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {locationActive
                ? "Ordenados por cercanía y relevancia en tu distrito."
                : "Usa tu ubicación para ver profesionales cerca de tu obra."}
            </p>
          </div>
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
