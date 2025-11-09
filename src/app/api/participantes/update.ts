import { AxiosError } from "axios";
import apiClient from "../axios.client";
import Result from "@/models/result.model";
import { Participante } from "@/models/participante.model";

export default async function updateParticipante(
  data: Participante
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.put(`/participantes/${data.id}`, data);

    result = {
      success: response.status === 200,
      data: {
        message:
          response.status === 200
            ? "Participante editato com sucesso!"
            : "Erro ao editar participante",
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
          "Erro ao editar participante",
      },
    };

    return result;
  }
}
