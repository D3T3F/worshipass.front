import {
  Box,
  Typography,
  Select,
  MenuItem,
  OutlinedInput,
  SelectProps,
  useTheme,
} from "@mui/material";
import { forwardRef } from "react";

export type InputSelectProps = SelectProps & {
  title?: string;
  variant?: "primary" | "secondary";
  width?: string | number;
  height?: string | number;
  errorMessage?: string;
  options: { label: string; value: any }[];
};

export const SelectDefault = forwardRef<HTMLInputElement, InputSelectProps>(
  (
    { title, width, height, errorMessage, sx, variant, options, ...rest },
    ref
  ) => {
    const theme = useTheme();

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Typography
          variant="body1"
          color={errorMessage ? "error.main" : "text.secondary"}
        >
          {title}
        </Typography>

        <Select
          {...rest}
          input={
            <OutlinedInput
              inputRef={ref}
              color={variant === "secondary" ? "secondary" : "primary"}
              sx={{
                width,
                height,
                borderRadius: "12px",
                ...(sx || {}),
              }}
            />
          }
          MenuProps={{
            PaperProps: {
              sx: { borderRadius: "12px" },
            },
          }}
        >
          {options.map((opt, idx) => (
            <MenuItem key={idx} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        {errorMessage && (
          <Typography
            variant="caption"
            color={theme.palette.error.main}
            sx={{ position: "absolute", bottom: -24, left: 4 }}
          >
            {errorMessage}
          </Typography>
        )}
      </Box>
    );
  }
);
