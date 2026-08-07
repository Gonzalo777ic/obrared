import { NextResponse } from "next/server";

import { syncUserProfileAction } from "@/app/_actions/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      await syncUserProfileAction();
      const redirectUrl = new URL(next, origin);
      redirectUrl.searchParams.set("verified", "1");
      return NextResponse.redirect(redirectUrl.toString());
    }
  }

  const errorUrl = new URL("/auth", origin);
  errorUrl.searchParams.set("error", "verification_failed");
  return NextResponse.redirect(errorUrl.toString());
}
