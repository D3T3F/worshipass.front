import { Box, OutlinedInput, Typography, useTheme } from "@mui/material";
import { InputBaseProps } from "@mui/material/InputBase";
import { forwardRef } from "react";

export type Props = InputBaseProps & {
  title?: string;
  variant?: "primary" | "secondary";
  width?: string | number;
  height?: string | number;
  errorMessage?: string;
};

export const InputDefault = forwardRef<HTMLInputElement, Props>(
  ({ title, width, height, errorMessage, sx, variant, ...rest }, ref) => {
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
        <OutlinedInput
          {...rest}
          color={variant === "secondary" ? "secondary" : "primary"}
          inputRef={ref}
          sx={{ width: width, height: height, borderRadius: "12px" }}
        />
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
