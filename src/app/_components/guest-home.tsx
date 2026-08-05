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
  filterWorkers,
  getFeaturedWorkers,
  sortByUpdatedDesc,
  type WorkerSearchFilters,
} from "./worker-filters";

type GuestHomeProps = {
  workers: WorkerProfile[];
  catalog: HomeCatalog;
};

export function GuestHome({ workers, catalog }: GuestHomeProps) {
  const [filters, setFilters] =
    useState<WorkerSearchFilters>(EMPTY_SEARCH_FILTERS);

  const featuredWorkers = useMemo(
    () => getFeaturedWorkers(workers).slice(0, 8),
    [workers],
  );

  const recentWorkers = useMemo(
    () =>
      sortByUpdatedDesc(filterWorkers(workers, filters, catalog.categories)),
    [catalog.categories, filters, workers],
  );

  return (
    <>
      <HeroSearch
        catalog={catalog}
        initialFilters={filters}
        onSearch={(nextFilters) =>
          setFilters((prev) => ({ ...prev, ...nextFilters }))
        }
      />

      <FeaturedWorkers workers={featuredWorkers} />

      <CategoryPills
        categories={catalog.categories}
        activeCategory={filters.category}
        onSelect={(category) =>
          setFilters((prev) => ({ ...prev, category }))
        }
      />

      <RecentWorkers workers={recentWorkers} />
    </>
  );
}
