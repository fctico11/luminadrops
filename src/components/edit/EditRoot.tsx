import type { ReactNode } from "react";
import { isAdminSession } from "@/lib/session";
import { EditModeProvider } from "./EditModeContext";
import SaveBar from "./SaveBar";

/** Mount on every route except /admin itself. Reads the admin session server-side
 * so signed-out visitors get zero editing markup or client-side admin state. */
export default async function EditRoot({ children }: { children: ReactNode }) {
  const isAdmin = await isAdminSession();

  return (
    <EditModeProvider isAdmin={isAdmin}>
      {children}
      <SaveBar />
    </EditModeProvider>
  );
}
