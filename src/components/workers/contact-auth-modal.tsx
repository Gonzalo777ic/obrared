"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";

import { CONTACT_GATE_COPY } from "@/constants/user-nav";

type ContactAuthModalProps = {
  open: boolean;
  workerName: string;
  onClose: () => void;
};

export function ContactAuthModal({
  open,
  workerName,
  onClose,
}: ContactAuthModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      return;
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="w-[min(100%,28rem)] border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/50"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 id={titleId} className="text-lg font-semibold text-slate-900">
          {CONTACT_GATE_COPY.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {CONTACT_GATE_COPY.description}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-900">
          Profesional: {workerName}
        </p>
      </div>

      <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row">
        <Link
          href="/auth"
          onClick={onClose}
          className="inline-flex flex-1 items-center justify-center bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          {CONTACT_GATE_COPY.loginLabel}
        </Link>
        <Link
          href="/auth"
          onClick={onClose}
          className="inline-flex flex-1 items-center justify-center border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
        >
          {CONTACT_GATE_COPY.registerLabel}
        </Link>
      </div>

      <div className="border-t border-slate-200 px-5 py-3">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          Seguir explorando
        </button>
      </div>
    </dialog>
  );
}
