export function isEmailNotConfirmedMessage(message: string): boolean {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("email not confirmed") ||
    normalized.includes("correo no confirmado") ||
    normalized.includes("email not verified")
  );
}
