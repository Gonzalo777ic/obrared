import Link from "next/link";

import { AppShell } from "@/app/_components/app-shell";
import { getAuthUser, getCurrentUserProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function ConfiguracionPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect(`/auth?next=${encodeURIComponent("/configuracion")}`);
  }

  const profile = await getCurrentUserProfile();

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          Cuenta
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
          Configuración
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Datos básicos de tu sesión. Pronto podrás editar preferencias y
          notificaciones desde aquí.
        </p>

        <div className="mt-6 space-y-3 border border-slate-200 bg-white p-5 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-900">Nombre: </span>
            {profile?.fullName?.trim() || "Sin nombre"}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Correo: </span>
            {user.email}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Rol: </span>
            {profile?.role.name ?? "Pendiente"}
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
        >
          Volver al inicio
        </Link>
      </section>
    </AppShell>
  );
}
