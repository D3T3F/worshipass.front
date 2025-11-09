import { AxiosError } from "axios";
import apiClient from "../axios.client";
import Result from "@/models/result.model";
import { Participante } from "@/models/participante.model";

export default async function createParticipante(
  data: Participante
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.put("/participantes", data);

    result = {
      success: response.status === 201,
      data: {
        message:
          response.status === 201
            ? "Participante criado com sucesso!"
            : "Erro ao criar participante",
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
          "Erro ao criar participante",
      },
    };

    return result;
  }
}
