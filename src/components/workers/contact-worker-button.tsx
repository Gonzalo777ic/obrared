"use client";

import { Phone } from "lucide-react";
import { useState } from "react";

import { ContactAuthModal } from "@/components/workers/contact-auth-modal";
import { buildWhatsappContactUrl } from "@/constants/whatsapp-contact";

type ContactWorkerButtonProps = {
  workerName: string;
  whatsapp: string;
  isAuthenticated: boolean;
  senderName?: string | null;
};

export function ContactWorkerButton({
  workerName,
  whatsapp,
  isAuthenticated,
  senderName = null,
}: ContactWorkerButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const whatsappUrl = buildWhatsappContactUrl(whatsapp, senderName);

  if (isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => {
          if (!whatsappUrl) return;
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        }}
        disabled={!whatsappUrl}
        className="inline-flex items-center gap-1.5 bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:border disabled:border-slate-300 disabled:bg-white disabled:text-slate-500"
        title={whatsappUrl ? "Abrir WhatsApp" : "WhatsApp no disponible"}
      >
        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
        Contactar
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-1.5 bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
      >
        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
        Contactar
      </button>

      <ContactAuthModal
        open={modalOpen}
        workerName={workerName}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
