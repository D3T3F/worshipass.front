"use client";

import { ThemeProvider } from "@/theme/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { SnackbarProvider } from "@/contexts/SnackbarContext";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <SessionProvider>
        <ThemeProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </ThemeProvider>
      </SessionProvider>
    </AppRouterCacheProvider>
  );
}
