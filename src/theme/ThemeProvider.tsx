"use client";

import type React from "react";
import {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  type PaletteMode,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/theme/theme";

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleColorMode: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: PaletteMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>("dark");

  useEffect(() => {
    const theme = localStorage.getItem("theme") as PaletteMode;
    
    if (theme) setMode(theme);
  }, []);

  const toggleColorMode = () => {
    localStorage.setItem("theme", mode === "light" ? "dark" : "light");

    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
