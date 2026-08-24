import "server-only";

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "test123";
  return password === expected;
}
