"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createResponsesBunniSessionToken,
  getResponsesBunniPassword,
  isMatchingResponsesBunniPassword,
  RESPONSES_BUNNI_COOKIE_NAME,
  RESPONSES_BUNNI_COOKIE_PATH,
} from "@/lib/reponsesbunni-auth";

export async function loginToResponsesBunni(formData: FormData) {
  const password = getResponsesBunniPassword();
  const submittedPassword = String(formData.get("password") ?? "");

  if (!isMatchingResponsesBunniPassword(submittedPassword, password)) {
    redirect("/reponsesbunni?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(RESPONSES_BUNNI_COOKIE_NAME, createResponsesBunniSessionToken(password), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: RESPONSES_BUNNI_COOKIE_PATH,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/reponsesbunni");
}

export async function logoutFromResponsesBunni() {
  const cookieStore = await cookies();
  cookieStore.set(RESPONSES_BUNNI_COOKIE_NAME, "", {
    expires: new Date(0),
    httpOnly: true,
    path: RESPONSES_BUNNI_COOKIE_PATH,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/reponsesbunni");
}
