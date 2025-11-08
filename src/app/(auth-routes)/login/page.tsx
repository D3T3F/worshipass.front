"use client";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as zod from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useThemeMode } from "@/theme/ThemeProvider";
import { InputDefault } from "@/components/inputs/InputDefault";

const schema = zod.object({
  user: zod.string().min(1, "Usuario obrigatório!"),
  password: zod.string().min(1, "Senha obrigatória!"),
});

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { control, handleSubmit, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { user: "", password: "" },
  });

  const searchParams = useSearchParams();

  const loginError = searchParams.get("error");

  function visibilityChange() {
    setPasswordVisible(!passwordVisible);
  }

  async function onSubmit(data: any) {
    signIn("credentials", { ...data, });
  }

  useEffect(() => {
    if (loginError === "CredentialsSignin") {
      setError("user", { message: "" }, { shouldFocus: true });

      setError("password", { message: "" });
    }
  }, [loginError]);

  const theme = useThemeMode();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "52px",
        marginTop: "8%",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{width: 300, height: 70, position: "relative", userSelect: "none"}}>
          <Image
            src={`/images/inv-manager-${theme.mode}.svg`}
            fill
            alt="logo"
            className="object-cover"
          />
        </Box>
        <Typography variant="h1" sx={{ userSelect: "none" }}>
          Login
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-96">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "32px",
          }}
        >
          <Controller
            control={control}
            name="user"
            render={({ field: { onChange, value, ref }, fieldState }) => (
              <>
                <InputDefault
                  title="Usuario"
                  value={value}
                  onChange={onChange}
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  ref={ref}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, ref }, fieldState }) => (
              <>
                <InputDefault
                  type={passwordVisible ? "text" : "password"}
                  placeholder="****"
                  title="Senha"
                  value={value}
                  onChange={onChange}
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  ref={ref}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={visibilityChange}>
                        {passwordVisible ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </>
            )}
          />
        </Box>
        <Typography
          color="primary"
          sx={{
            userSelect: "none",
            cursor: "pointer",
            marginTop: "24px",
            ":hover": {
              textDecoration: "underline",
            },
          }}
        >
          Esqueceu a senha?
        </Typography>
        <Button
          type="submit"
          variant="contained"
          sx={{ marginTop: "42px", height: "42px" }}
        >
          <Typography variant="h6">Entrar</Typography>
        </Button>
      </form>
    </Box>
  );
}
