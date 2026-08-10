"use client";

import type { CatalogOption } from "@/types/catalog";

type MultiSelectPillsProps = {
  options: readonly CatalogOption[] | CatalogOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  emptyHint?: string;
};

export function MultiSelectPills({
  options,
  value,
  onChange,
  label,
  emptyHint,
}: MultiSelectPillsProps) {
  const toggle = (slug: string) => {
    if (value.includes(slug)) {
      onChange(value.filter((item) => item !== slug));
      return;
    }

    onChange([...value, slug]);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      {emptyHint ? (
        <p className="mt-1 text-xs text-slate-500">{emptyHint}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "border-amber-600 bg-amber-500 text-slate-900"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
              aria-pressed={active}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
