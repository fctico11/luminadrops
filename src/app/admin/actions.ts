"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { verifyAdminPassword } from "@/lib/auth";
import { createSession, clearSession } from "@/lib/session";

const loginSchema = z.object({
  password: z.string().min(1),
});

export type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter the admin password." };
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    return { error: "Incorrect password." };
  }

  await createSession({ admin: true });
  redirect("/admin");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}
