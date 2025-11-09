"use server";

import { AxiosError } from "axios";
import apiServer from "../axios.server";
import Result from "@/models/result.model";

export interface User {
  nome: string;
  usuario: string;
  senha: string;
}

export default async function createUser(
  data: User
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiServer.post("/usuarios/create", data);

    result = {
      success: true,
      data: {
        message: response.data,
      },
    };

    return result;
  } catch (e: AxiosError | any) {
    result = {
      success: false,
      data: {
        message:
          e?.response?.data?.message ??
          e?.response?.data ??
          e?.message ??
          "Erro ao criar usuario",
      },
    };

    return result;
  }
}
