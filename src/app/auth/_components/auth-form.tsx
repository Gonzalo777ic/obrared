"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { syncUserProfileAction } from "@/app/_actions/auth";
import { createClient } from "@/lib/supabase/client";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/schemas/auth.schema";

type AuthMode = "login" | "register";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleLogin(values: LoginInput) {
    setIsSubmitting(true);
    setFormError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setFormError(error.message);
      setIsSubmitting(false);
      return;
    }

    const syncResult = await syncUserProfileAction();
    if (syncResult.error) {
      setFormError(syncResult.error);
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleRegister(values: RegisterInput) {
    setIsSubmitting(true);
    setFormError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName },
      },
    });

    if (error) {
      setFormError(error.message);
      setIsSubmitting(false);
      return;
    }

    const syncResult = await syncUserProfileAction(values.fullName);
    if (syncResult.error) {
      setFormError(syncResult.error);
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex justify-center">
        <Image
          src="/webp/logo-horizontal.webp"
          alt="ObraRed"
          width={180}
          height={56}
          className="h-10 w-auto"
          priority
        />
      </div>

      <div className="mt-6 flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setFormError(null);
          }}
          className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
            mode === "login"
              ? "border-b-2 border-amber-500 text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setFormError(null);
          }}
          className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
            mode === "register"
              ? "border-b-2 border-amber-500 text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      {formError ? (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      {mode === "login" ? (
        <form
          onSubmit={loginForm.handleSubmit(handleLogin)}
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Correo electrónico
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className="w-full border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              {...loginForm.register("email")}
            />
            {loginForm.formState.errors.email ? (
              <p className="mt-1 text-xs text-red-600">
                {loginForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className="w-full border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              {...loginForm.register("password")}
            />
            {loginForm.formState.errors.password ? (
              <p className="mt-1 text-xs text-red-600">
                {loginForm.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={registerForm.handleSubmit(handleRegister)}
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="register-name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Nombre completo
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              className="w-full border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              {...registerForm.register("fullName")}
            />
            {registerForm.formState.errors.fullName ? (
              <p className="mt-1 text-xs text-red-600">
                {registerForm.formState.errors.fullName.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Correo electrónico
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              className="w-full border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              {...registerForm.register("email")}
            />
            {registerForm.formState.errors.email ? (
              <p className="mt-1 text-xs text-red-600">
                {registerForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              className="w-full border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              {...registerForm.register("password")}
            />
            {registerForm.formState.errors.password ? (
              <p className="mt-1 text-xs text-red-600">
                {registerForm.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="register-confirm"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Confirmar contraseña
            </label>
            <input
              id="register-confirm"
              type="password"
              autoComplete="new-password"
              className="w-full border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              {...registerForm.register("confirmPassword")}
            />
            {registerForm.formState.errors.confirmPassword ? (
              <p className="mt-1 text-xs text-red-600">
                {registerForm.formState.errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            Al registrarte creas una cuenta con rol{" "}
            <span className="font-medium text-slate-700">Cliente</span>. Podrás
            convertirte en anunciante cuando publiques en la plataforma.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="font-medium text-slate-700 hover:text-slate-900">
          Volver al inicio
        </Link>
      </p>
    </div>
  );
}
