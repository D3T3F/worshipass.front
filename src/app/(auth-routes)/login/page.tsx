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
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { InputDefault } from "@/components/inputs/InputDefault";
import { useSnackbar } from "@/contexts/SnackbarContext";

const schema = zod.object({
  user: zod.string().min(1, "Usuario obrigatório!"),
  password: zod.string().min(1, "Senha obrigatória!"),
});

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { showSnackbar } = useSnackbar();
  const router = useRouter();

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
    signIn("credentials", { ...data });
  }

  useEffect(() => {
    if (loginError === "CredentialsSignin") {
      const credentialsError = "Usuario ou senha inválidos.";

      showSnackbar(credentialsError, "error")

      setError("user", { message: credentialsError }, { shouldFocus: true });

      setError("password", { message: credentialsError });
    }
  }, [loginError]);

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
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Typography variant="h1" color="primary" sx={{ userSelect: "none" }}>
          WorshiPass
        </Typography>
        <Typography variant="h2" sx={{ userSelect: "none" }}>
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
                  onChange={(e) => onChange(e.target.value.toLowerCase())}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: "42px",
            gap: "20px"
          }}
        >
          <Button type="submit" variant="contained" sx={{ height: "42px" }}>
            <Typography variant="h6">Entrar</Typography>
          </Button>
          <Button variant="outlined" sx={{ height: "42px" }} onClick={() => router.push("/signup")}>
            <Typography variant="h6">Criar conta</Typography>
          </Button>
        </Box>
      </form>
    </Box>
  );
}
