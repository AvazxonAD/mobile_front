"use client";

import { useAuthRefresh } from "../../hooks/use-auth";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // Handle client-side auth refresh
  useAuthRefresh();

  return <>{children}</>;
}
