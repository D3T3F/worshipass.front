import {
  createTheme,
  responsiveFontSizes,
  type Theme,
  type ThemeOptions,
} from "@mui/material/styles";
import type { PaletteMode, TypographyVariantsOptions } from "@mui/material";

const COLORS = {
  PRIMARY: {
    MAIN: "#00897B",
    LIGHT: "#4EB6A8",
    DARK: "#006055",
    CONTRAST_TEXT: "#ffffff",
  },
  SECONDARY: {
    MAIN: "#7E3FF2",
    LIGHT: "#A47BFF",
    DARK: "#5326A8",
    CONTRAST_TEXT: "#ffffff",
  },
  SUCCESS: {
    MAIN: "#2E7D32",
    LIGHT: "#60AD5E",
    DARK: "#005005",
  },
  ERROR: {
    MAIN: "#f44336",
    LIGHT: "#e57373",
    DARK: "#d32f2f",
  },
  WARNING: {
    MAIN: "#F9A825",
    LIGHT: "#FFD95A",
    DARK: "#C17900",
  },
  INFO: {
    MAIN: "#1E88E5",
    LIGHT: "#6AB7FF",
    DARK: "#005CB2",
  },
  GREY: {
    50: "#FAFAFC",
    100: "#F1F2F6",
    200: "#E2E4EC",
    300: "#CDD0DB",
    400: "#A7ADBD",
    500: "#828A9C",
    600: "#646B7A",
    700: "#4C515D",
    800: "#343840",
    900: "#1E2024",
  },
};

const typography: TypographyVariantsOptions = {
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  h1: {
    fontWeight: 700,
    fontSize: "3rem",
    lineHeight: 1.2,
  },
  h2: {
    fontWeight: 600,
    fontSize: "2rem",
    lineHeight: 1.3,
  },
  h3: {
    fontWeight: 600,
    fontSize: "1.75rem",
    lineHeight: 1.4,
  },
  h4: {
    fontWeight: 600,
    fontSize: "1.5rem",
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 500,
    fontSize: "1.25rem",
    lineHeight: 1.4,
  },
  h6: {
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontWeight: 400,
  },
  subtitle2: {
    fontSize: "0.875rem",
    lineHeight: 1.57,
    fontWeight: 500,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontWeight: 400,
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.57,
    fontWeight: 400,
  },
  button: {
    fontSize: "0.875rem",
    textTransform: "none",
    fontWeight: 500,
  },
  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.66,
    fontWeight: 400,
  },
  overline: {
    fontSize: "0.75rem",
    lineHeight: 2.66,
    fontWeight: 600,
    textTransform: "uppercase",
  },
};

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: "none",
        fontWeight: 500,
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        },
      },
      containedPrimary: {
        color: "#000",
        "&:hover": {
          backgroundColor: COLORS.PRIMARY.LIGHT,
        },
      },
      containedSecondary: {
        "&:hover": {
          backgroundColor: COLORS.SECONDARY.LIGHT,
        },
      },
      outlinedSecondary: {
        borderColor: COLORS.SECONDARY.MAIN,
        "&:hover": {
          borderColor: COLORS.SECONDARY.DARK,
          backgroundColor: "rgba(2, 136, 209, 0.04)",
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
      colorPrimary: {
        backgroundColor: "rgba(255, 152, 0, 0.1)",
        color: COLORS.PRIMARY.DARK,
        "&:hover": {
          backgroundColor: "rgba(255, 152, 0, 0.2)",
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: COLORS.PRIMARY.MAIN,
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
          "&.Mui-focused fieldset": {
            borderWidth: 2,
          },
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 4,
        fontSize: "0.75rem",
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      switchBase: {
        "&.Mui-checked": {
          "& + .MuiSwitch-track": {
            backgroundColor: COLORS.PRIMARY.MAIN,
            opacity: 0.5,
          },
          "&.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.3,
          },
        },
      },
      thumb: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
      },
      elevation2: {
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
      },
    },
  },
};

const getLightTheme = (): ThemeOptions => ({
  palette: {
    mode: "light",
    primary: {
      main: COLORS.PRIMARY.MAIN,
      light: COLORS.PRIMARY.LIGHT,
      dark: COLORS.PRIMARY.DARK,
      contrastText: COLORS.PRIMARY.CONTRAST_TEXT,
    },
    secondary: {
      main: COLORS.SECONDARY.MAIN,
      light: COLORS.SECONDARY.LIGHT,
      dark: COLORS.SECONDARY.DARK,
      contrastText: COLORS.SECONDARY.CONTRAST_TEXT,
    },
    success: {
      main: COLORS.SUCCESS.MAIN,
      light: COLORS.SUCCESS.LIGHT,
      dark: COLORS.SUCCESS.DARK,
    },
    error: {
      main: COLORS.ERROR.MAIN,
      light: COLORS.ERROR.LIGHT,
      dark: COLORS.ERROR.DARK,
    },
    warning: {
      main: COLORS.WARNING.MAIN,
      light: COLORS.WARNING.LIGHT,
      dark: COLORS.WARNING.DARK,
    },
    info: {
      main: COLORS.INFO.MAIN,
      light: COLORS.INFO.LIGHT,
      dark: COLORS.INFO.DARK,
    },
    grey: COLORS.GREY,
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    divider: "rgba(0, 0, 0, 0.12)",
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(0, 0, 0, 0.04)",
      selected: "rgba(0, 0, 0, 0.08)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      focus: "rgba(0, 0, 0, 0.12)",
    },
  },
  typography,
  components: {
    ...components,
    MuiCard: {
      styleOverrides: {
        root: {
          ...components.MuiCard.styleOverrides.root,
          "&:hover": {
            ...components.MuiCard.styleOverrides.root["&:hover"],
            borderLeft: `4px solid ${COLORS.PRIMARY.MAIN}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#e1e1e1",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          backgroundColor: "#000",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: "#fff",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 4px 8px rgba(0, 0, 0, 0.05)",
    "0px 6px 12px rgba(0, 0, 0, 0.05)",
    "0px 8px 16px rgba(0, 0, 0, 0.05)",
    "0px 10px 20px rgba(0, 0, 0, 0.05)",
    "0px 12px 24px rgba(0, 0, 0, 0.05)",
    "0px 14px 28px rgba(0, 0, 0, 0.05)",
    "0px 16px 32px rgba(0, 0, 0, 0.05)",
    "0px 18px 36px rgba(0, 0, 0, 0.05)",
    "0px 20px 40px rgba(0, 0, 0, 0.05)",
    "0px 22px 44px rgba(0, 0, 0, 0.05)",
    "0px 24px 48px rgba(0, 0, 0, 0.05)",
    "0px 26px 52px rgba(0, 0, 0, 0.05)",
    "0px 28px 56px rgba(0, 0, 0, 0.05)",
    "0px 30px 60px rgba(0, 0, 0, 0.05)",
    "0px 32px 64px rgba(0, 0, 0, 0.05)",
    "0px 34px 68px rgba(0, 0, 0, 0.05)",
    "0px 36px 72px rgba(0, 0, 0, 0.05)",
    "0px 38px 76px rgba(0, 0, 0, 0.05)",
    "0px 40px 80px rgba(0, 0, 0, 0.05)",
    "0px 42px 84px rgba(0, 0, 0, 0.05)",
    "0px 44px 88px rgba(0, 0, 0, 0.05)",
    "0px 46px 92px rgba(0, 0, 0, 0.05)",
    "0px 48px 96px rgba(0, 0, 0, 0.05)",
  ],
});

const getDarkTheme = (): ThemeOptions => ({
  palette: {
    mode: "dark",
    primary: {
      main: COLORS.PRIMARY.MAIN,
      light: COLORS.PRIMARY.LIGHT,
      dark: COLORS.PRIMARY.DARK,
      contrastText: COLORS.PRIMARY.CONTRAST_TEXT,
    },
    secondary: {
      main: COLORS.SECONDARY.MAIN,
      light: COLORS.SECONDARY.LIGHT,
      dark: COLORS.SECONDARY.DARK,
      contrastText: COLORS.SECONDARY.CONTRAST_TEXT,
    },
    success: {
      main: COLORS.SUCCESS.MAIN,
      light: COLORS.SUCCESS.LIGHT,
      dark: COLORS.SUCCESS.DARK,
    },
    error: {
      main: COLORS.ERROR.MAIN,
      light: COLORS.ERROR.LIGHT,
      dark: COLORS.ERROR.DARK,
    },
    warning: {
      main: COLORS.WARNING.MAIN,
      light: COLORS.WARNING.LIGHT,
      dark: COLORS.WARNING.DARK,
    },
    info: {
      main: COLORS.INFO.MAIN,
      light: COLORS.INFO.LIGHT,
      dark: COLORS.INFO.DARK,
    },
    grey: COLORS.GREY,
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "#ffffff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      focus: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography,
  components: {
    ...components,
    MuiCard: {
      styleOverrides: {
        root: {
          ...components.MuiCard.styleOverrides.root,
          backgroundColor: "#1e1e1e",
          "&:hover": {
            ...components.MuiCard.styleOverrides.root["&:hover"],
            boxShadow: `0px 8px 24px rgba(255, 152, 0, 0.2)`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1a1a",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          backgroundColor: "#fff",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: "#000",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 0, 0, 0.2)",
    "0px 4px 8px rgba(0, 0, 0, 0.2)",
    "0px 6px 12px rgba(0, 0, 0, 0.2)",
    "0px 8px 16px rgba(0, 0, 0, 0.2)",
    "0px 10px 20px rgba(0, 0, 0, 0.2)",
    "0px 12px 24px rgba(0, 0, 0, 0.2)",
    "0px 14px 28px rgba(0, 0, 0, 0.2)",
    "0px 16px 32px rgba(0, 0, 0, 0.2)",
    "0px 18px 36px rgba(0, 0, 0, 0.2)",
    "0px 20px 40px rgba(0, 0, 0, 0.2)",
    "0px 22px 44px rgba(0, 0, 0, 0.2)",
    "0px 24px 48px rgba(0, 0, 0, 0.2)",
    "0px 26px 52px rgba(0, 0, 0, 0.2)",
    "0px 28px 56px rgba(0, 0, 0, 0.2)",
    "0px 30px 60px rgba(0, 0, 0, 0.2)",
    "0px 32px 64px rgba(0, 0, 0, 0.2)",
    "0px 34px 68px rgba(0, 0, 0, 0.2)",
    "0px 36px 72px rgba(0, 0, 0, 0.2)",
    "0px 38px 76px rgba(0, 0, 0, 0.2)",
    "0px 40px 80px rgba(0, 0, 0, 0.2)",
    "0px 42px 84px rgba(0, 0, 0, 0.2)",
    "0px 44px 88px rgba(0, 0, 0, 0.2)",
    "0px 46px 92px rgba(0, 0, 0, 0.2)",
    "0px 48px 96px rgba(0, 0, 0, 0.2)",
  ],
});

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

export const lightTheme: Theme = responsiveFontSizes(
  createTheme({
    ...getLightTheme(),
    breakpoints,
  })
);

export const darkTheme: Theme = responsiveFontSizes(
  createTheme({
    ...getDarkTheme(),
    breakpoints,
  })
);

export const getTheme = (mode: PaletteMode): Theme => {
  return mode === "dark" ? darkTheme : lightTheme;
};
