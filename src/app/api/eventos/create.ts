import { AxiosError } from "axios";
import apiClient from "../axios.client";
import Result from "@/models/result.model";
import { Evento } from "@/models/evento.model";

export default async function createEvento(
  data: Evento
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.post("/eventos", data);

    result = {
      success: response.status === 201,
      data: {
        message:
          response.status === 201
            ? "Evento criado com sucesso!"
            : "Erro ao criar evento",
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
          "Erro ao criar evento",
      },
    };

    return result;
  }
}
