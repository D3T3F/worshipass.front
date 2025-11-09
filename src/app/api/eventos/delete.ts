import { AxiosError } from "axios";
import apiClient from "../axios.client";
import Result from "@/models/result.model";

export default async function deleteEvento(
  eventoId: number
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.delete(`/eventos/${eventoId}`);

    result = {
      success: response.status === 204,
      data: {
        message:
          response.status === 204
            ? "Evento excluido com sucesso!"
            : "Erro ao excluir evento",
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
          "Erro ao excluir evento",
      },
    };

    return result;
  }
}
