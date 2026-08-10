export const WHATSAPP_CONTACT = {
  brandName: "ObraRed",
  timeZone: "America/Lima",
} as const;

export function getPeruDayGreeting(date = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("es-PE", {
      hour: "numeric",
      hour12: false,
      timeZone: WHATSAPP_CONTACT.timeZone,
    }).format(date),
  );

  if (hour >= 5 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function normalizeWhatsappDigits(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.startsWith("51") && digits.length >= 11) return digits;
  if (digits.length === 9) return `51${digits}`;
  return digits;
}

export function buildWorkerContactMessage(senderName: string | null | undefined) {
  const greeting = getPeruDayGreeting();
  const name = senderName?.trim() || "un cliente";

  return `${greeting}, le escribe ${name} para consultar sus servicios en base a la publicidad de la web ${WHATSAPP_CONTACT.brandName}.`;
}

export function buildWhatsappContactUrl(
  whatsapp: string,
  senderName: string | null | undefined,
): string | null {
  const digits = normalizeWhatsappDigits(whatsapp);
  if (digits.length < 11) return null;

  const text = buildWorkerContactMessage(senderName);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
