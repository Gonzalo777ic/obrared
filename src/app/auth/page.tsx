import { Suspense } from "react";

import { AuthForm } from "./_components/auth-form";

export default function AuthPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10">
      <Suspense fallback={<div className="text-sm text-slate-500">Cargando...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
