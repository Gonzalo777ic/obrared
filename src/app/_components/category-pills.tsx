"use client";

import type { WorkCategoryOption } from "@/types/catalog";

type CategoryPillsProps = {
  categories: WorkCategoryOption[];
  activeCategory: string;
  onSelect: (category: string) => void;
};

export function CategoryPills({
  categories,
  activeCategory,
  onSelect,
}: CategoryPillsProps) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Accesos rápidos por categoría
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelect("")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeCategory === ""
                ? "bg-amber-500 text-slate-900"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Todas
          </button>
          {categories.map((category) => {
            const isActive = activeCategory === category.value;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => onSelect(isActive ? "" : category.value)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-500 text-slate-900"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
