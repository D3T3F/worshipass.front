"use client";

import type React from "react";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeMode } from "./ThemeProvider";

interface ThemeToggleProps {
  tooltip?: boolean;
}

// Theme toggle button component
const ThemeToggle: React.FC<ThemeToggleProps> = ({ tooltip = true }) => {
  const { mode, toggleColorMode } = useThemeMode();

  const button = (
    <IconButton
      onClick={toggleColorMode}
      color="inherit"
      aria-label={
        mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      sx={{
        ml: 1,
        // Orange glow effect on hover (now primary color)
        "&:hover": {
          backgroundColor: "rgba(255, 152, 0, 0.1)",
        },
      }}
    >
      {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );

  if (tooltip) {
    return (
      <Tooltip
        title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default ThemeToggle;
