"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  loginSchema,
  registerSchema,
  type LoginValues,
  type RegisterValues,
} from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function loginAction(values: LoginValues): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است.",
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true, message: "با موفقیت وارد شدید." };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, message: "ایمیل یا رمز عبور اشتباه است." };
    }
    console.error("loginAction error:", error);
    return { success: false, message: "خطایی رخ داد. لطفاً دوباره تلاش کنید." };
  }
}

export async function registerAction(
  values: RegisterValues,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است.",
    };
  }

  const { name, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, message: "این ایمیل قبلاً ثبت‌نام کرده است." };
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, password: hashed, role: "USER" },
    });

    await signIn("credentials", { email, password, redirect: false });
    return { success: true, message: "ثبت‌نام با موفقیت انجام شد." };
  } catch (error) {
    console.error("registerAction error:", error);
    return { success: false, message: "خطایی رخ داد. لطفاً دوباره تلاش کنید." };
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
