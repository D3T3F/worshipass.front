"use client";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useState } from "react";
import * as zod from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { InputDefault } from "@/components/inputs/InputDefault";
import createUser, { User } from "@/app/api/usuario/create";
import { useSnackbar } from "@/contexts/SnackbarContext";

interface UserData {
  name: string;
  user: string;
  password: string;
  repeatPassword: string;
}

export const schema = zod
  .object({
    name: zod
      .string()
      .min(1, "Nome obrigatório!")
      .regex(
        /^[A-ZÀ-Ÿ][a-zà-ÿ]+(\s[A-ZÀ-Ÿ][a-zà-ÿ]+)+$/,
        "Informe o nome completo com iniciais maiúsculas (ex: João Silva)"
      ),
    user: zod.string().min(5, "Usuário deve ter ao menos 5 letras!"),
    password: zod
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres!")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula!")
      .regex(/\d/, "A senha deve conter pelo menos um número!"),
    repeatPassword: zod.string().min(1, "Repita a senha corretamente!"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "As senhas não coincidem!",
  });

export default function SignupPage() {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] =
    useState<boolean>(false);

  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const { control, handleSubmit, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", user: "", password: "", repeatPassword: "" },
  });

  function visibilityChange() {
    setPasswordVisible(!passwordVisible);
  }

  function repeatVisibilityChange() {
    setRepeatPasswordVisible(!repeatPasswordVisible);
  }

  async function onSubmit(data: UserData) {
    const payload: User = {
      nome: data.name,
      usuario: data.user,
      senha: data.password,
    };

    const result = await createUser(payload);

    showSnackbar(result.data.message, result.success ? "success" : "error");

    if (result.success) {
      router.push("/login");

      return;
    }

    if (result.data.message == "Usuario ja existente")
      setError("user", { message: result.data.message });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "52px",
        marginTop: "5%",
        marginBottom: "20px",
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
          Criar conta
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
            name="name"
            render={({ field: { onChange, value, ref }, fieldState }) => (
              <>
                <InputDefault
                  title="Nome completo"
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
          <Controller
            control={control}
            name="repeatPassword"
            render={({ field: { onChange, value, ref }, fieldState }) => (
              <>
                <InputDefault
                  type={repeatPasswordVisible ? "text" : "password"}
                  placeholder="****"
                  title="Repita a Senha"
                  value={value}
                  onChange={onChange}
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  ref={ref}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={repeatVisibilityChange}>
                        {repeatPasswordVisible ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
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
            gap: "20px",
          }}
        >
          <Button type="submit" variant="contained" sx={{ height: "42px" }}>
            <Typography variant="h6">Criar</Typography>
          </Button>
          <Button
            variant="outlined"
            sx={{ height: "42px" }}
            onClick={() => router.push("/login")}
          >
            <Typography variant="h6">Voltar</Typography>
          </Button>
        </Box>
      </form>
    </Box>
  );
}
