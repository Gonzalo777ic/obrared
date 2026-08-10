"use client";

import { useMemo, useState } from "react";

import type { HomeCatalog } from "@/types/catalog";
import type { WorkerProfile } from "@/types/worker";

import { CategoryPills } from "./category-pills";
import { FeaturedWorkers } from "./featured-workers";
import { HeroSearch } from "./hero-search";
import { RecentWorkers } from "./recent-workers";
import {
  EMPTY_SEARCH_FILTERS,
  getRankedWorkers,
  getTopRankedWorkers,
  hasActiveLocationFilter,
  type WorkerSearchFilters,
} from "./worker-filters";

type GuestHomeProps = {
  workers: WorkerProfile[];
  catalog: HomeCatalog;
  isAuthenticated: boolean;
  senderName?: string | null;
};

export function GuestHome({
  workers,
  catalog,
  isAuthenticated,
  senderName = null,
}: GuestHomeProps) {
  const [filters, setFilters] =
    useState<WorkerSearchFilters>(EMPTY_SEARCH_FILTERS);

  const topWorkers = useMemo(
    () => getTopRankedWorkers(workers, filters, catalog.categories, 8),
    [catalog.categories, filters, workers],
  );

  const rankedWorkers = useMemo(
    () => getRankedWorkers(workers, filters, catalog.categories),
    [catalog.categories, filters, workers],
  );

  const moreWorkers = useMemo(
    () => rankedWorkers.slice(topWorkers.length),
    [rankedWorkers, topWorkers.length],
  );

  const locationActive = hasActiveLocationFilter(filters);

  return (
    <>
      <HeroSearch
        catalog={catalog}
        initialFilters={filters}
        onSearch={(nextFilters) =>
          setFilters((prev) => ({ ...prev, ...nextFilters }))
        }
      />

      <FeaturedWorkers
        workers={topWorkers}
        locationActive={locationActive}
        isAuthenticated={isAuthenticated}
        senderName={senderName}
      />

      <CategoryPills
        categories={catalog.categories}
        activeCategory={filters.category}
        onSelect={(category) =>
          setFilters((prev) => ({ ...prev, category }))
        }
      />

      <RecentWorkers
        workers={moreWorkers}
        locationActive={locationActive}
        isAuthenticated={isAuthenticated}
        senderName={senderName}
      />
    </>
  );
}
