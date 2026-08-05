import { WorkerCard } from "@/components/workers/worker-card";
import type { WorkerProfile } from "@/types/worker";

type RecentWorkersProps = {
  workers: WorkerProfile[];
};

export function RecentWorkers({ workers }: RecentWorkersProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Actividad reciente
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Los más recientes
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ordenados por última actualización. Ideal para encontrar personal
            libre ahora.
          </p>
        </div>

        {workers.length === 0 ? (
          <p className="mt-6 border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
            No hay trabajadores que coincidan con tu búsqueda.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
