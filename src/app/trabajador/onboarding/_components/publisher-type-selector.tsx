"use client";

import { Building2, HardHat } from "lucide-react";

import {
  PUBLISHER_TYPES,
  type PublisherType,
} from "@/constants/publisher-type";

type PublisherTypeSelectorProps = {
  onSelect: (type: PublisherType) => void;
};

export function PublisherTypeSelector({ onSelect }: PublisherTypeSelectorProps) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onSelect(PUBLISHER_TYPES.individual.value)}
        className="border border-slate-200 bg-white p-6 text-left transition-colors hover:border-amber-500 hover:bg-amber-50"
      >
        <HardHat className="h-8 w-8 text-amber-600" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          {PUBLISHER_TYPES.individual.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {PUBLISHER_TYPES.individual.description}
        </p>
      </button>

      <button
        type="button"
        onClick={() => onSelect(PUBLISHER_TYPES.company.value)}
        className="border border-slate-200 bg-white p-6 text-left transition-colors hover:border-amber-500 hover:bg-amber-50"
      >
        <Building2 className="h-8 w-8 text-amber-600" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          {PUBLISHER_TYPES.company.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {PUBLISHER_TYPES.company.description}
        </p>
      </button>
    </div>
  );
}
