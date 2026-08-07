import { Resend } from "resend";

import { serverEnv } from "@/lib/env/server";

let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient) {
    resendClient = new Resend(serverEnv.RESEND_API_KEY);
  }

  return resendClient;
}

type SendVerificationEmailInput = {
  to: string;
  fullName: string;
  verificationUrl: string;
};

export async function sendVerificationEmail({
  to,
  fullName,
  verificationUrl,
}: SendVerificationEmailInput) {
  const resend = getResendClient();
  const greeting = fullName.trim() || "Usuario";

  const { error } = await resend.emails.send({
    from: serverEnv.RESEND_FROM_EMAIL,
    to,
    subject: "Verifica tu cuenta en ObraRed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
        <p style="font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #d97706;">
          ObraRed
        </p>
        <h1 style="font-size: 22px; margin: 12px 0 8px;">Confirma tu correo</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Hola ${greeting}, gracias por registrarte. Para activar tu cuenta y acceder a ObraRed,
          confirma tu correo electrónico con el botón siguiente.
        </p>
        <p style="margin: 24px 0;">
          <a href="${verificationUrl}"
             style="display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 20px; font-size: 14px; font-weight: 600;">
            Verificar correo
          </a>
        </p>
        <p style="font-size: 12px; line-height: 1.6; color: #64748b;">
          Si no creaste esta cuenta, ignora este mensaje. El enlace expira por seguridad.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
