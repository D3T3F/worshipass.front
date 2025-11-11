"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSnackbar } from "@/contexts/SnackbarContext";

export default function TokenGuard({ error }: { error: string | null | {} }) {
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (!error) return;
    
    showSnackbar("Sessão expirada.", "error");

    signOut({ callbackUrl: "/login" });
  }, [error]);

  return null;
}
