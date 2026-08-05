import { WorkerCard } from "@/components/workers/worker-card";
import type { WorkerProfile } from "@/types/worker";

type FeaturedWorkersProps = {
  workers: WorkerProfile[];
};

export function FeaturedWorkers({ workers }: FeaturedWorkersProps) {
  if (workers.length === 0) return null;

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Destacados
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Perfiles verificados y destacados
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Mayor visibilidad para suscripciones y anuncios premium.
            </p>
          </div>
        </div>

        <div className="-mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {workers.map((worker) => (
            <div key={worker.id} className="snap-start sm:min-w-0">
              <WorkerCard worker={worker} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
