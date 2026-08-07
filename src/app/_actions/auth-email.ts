"use server";

import { getAuthCallbackUrl } from "@/lib/env/client";
import { sendVerificationEmail } from "@/lib/email/send-verification-email";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  registerSchema,
  type RegisterInput,
} from "@/schemas/auth.schema";

type AuthEmailResult = {
  error?: string;
  needsVerification?: boolean;
  email?: string;
};

function mapAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("already been registered") ||
    normalized.includes("already registered") ||
    normalized.includes("user already registered")
  ) {
    return "Este correo ya está registrado. Inicia sesión o reenvía la verificación.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Debes verificar tu correo antes de iniciar sesión.";
  }

  return message;
}

async function createSignupVerificationLink(
  email: string,
  password: string,
  fullName: string,
) {
  const admin = createAdminClient();

  return admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { full_name: fullName },
      redirectTo: getAuthCallbackUrl("/"),
    },
  });
}

async function createResendVerificationLink(email: string) {
  const admin = createAdminClient();

  return admin.auth.admin.generateLink({
    type: "signup",
    email,
    options: {
      redirectTo: getAuthCallbackUrl("/"),
    },
  });
}

export async function registerWithEmailVerificationAction(
  values: RegisterInput,
): Promise<AuthEmailResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Revisa los datos del formulario." };
  }

  try {
    const { data, error } = await createSignupVerificationLink(
      parsed.data.email,
      parsed.data.password,
      parsed.data.fullName,
    );

    if (error) {
      return { error: mapAuthError(error.message) };
    }

    const verificationUrl = data.properties.action_link;
    if (!verificationUrl) {
      return { error: "No se pudo generar el enlace de verificación." };
    }

    await sendVerificationEmail({
      to: parsed.data.email,
      fullName: parsed.data.fullName,
      verificationUrl,
    });

    return {
      needsVerification: true,
      email: parsed.data.email,
    };
  } catch (caught) {
    const message =
      caught instanceof Error ? caught.message : "No se pudo completar el registro.";

    return { error: mapAuthError(message) };
  }
}

export async function resendVerificationEmailAction(
  email: string,
): Promise<AuthEmailResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return { error: "Ingresa un correo válido." };
  }

  try {
    const admin = createAdminClient();
    const { data: usersData, error: usersError } =
      await admin.auth.admin.listUsers();

    if (usersError) {
      return { error: usersError.message };
    }

    const authUser = usersData.users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail,
    );

    if (!authUser) {
      return { error: "No encontramos una cuenta con ese correo." };
    }

    if (authUser.email_confirmed_at) {
      return { error: "Este correo ya está verificado. Puedes iniciar sesión." };
    }

    const fullName =
      typeof authUser.user_metadata?.full_name === "string"
        ? authUser.user_metadata.full_name
        : "Usuario";

    const { data, error } = await createResendVerificationLink(normalizedEmail);

    if (error) {
      return { error: mapAuthError(error.message) };
    }

    const verificationUrl = data.properties.action_link;
    if (!verificationUrl) {
      return { error: "No se pudo generar el enlace de verificación." };
    }

    await sendVerificationEmail({
      to: normalizedEmail,
      fullName,
      verificationUrl,
    });

    return {
      needsVerification: true,
      email: normalizedEmail,
    };
  } catch (caught) {
    const message =
      caught instanceof Error
        ? caught.message
        : "No se pudo reenviar el correo de verificación.";

    return { error: mapAuthError(message) };
  }
}
