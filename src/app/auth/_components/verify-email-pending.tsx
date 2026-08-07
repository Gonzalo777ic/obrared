"use client";

type VerifyEmailPendingProps = {
  email: string;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
  onResend: () => void;
  onBackToLogin: () => void;
};

export function VerifyEmailPending({
  email,
  isSubmitting,
  error,
  successMessage,
  onResend,
  onBackToLogin,
}: VerifyEmailPendingProps) {
  return (
    <div className="mt-6 space-y-4">
      <div className="border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">
          Verifica tu correo para continuar
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Enviamos un enlace de confirmación a{" "}
          <span className="font-medium text-slate-900">{email}</span>. Revisa tu
          bandeja de entrada y spam antes de iniciar sesión.
        </p>
      </div>

      {error ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {successMessage ? (
        <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onResend}
        disabled={isSubmitting}
        className="w-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Reenviando..." : "Reenviar correo de verificación"}
      </button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        Volver a iniciar sesión
      </button>
    </div>
  );
}
