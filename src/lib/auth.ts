import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function verifyCredentials(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!admin) return null;

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;

  return { id: admin.id, email: admin.email };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
