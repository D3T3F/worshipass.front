import { AxiosError } from "axios";
import apiClient from "../axios.client";
import Result from "@/models/result.model";
import { Evento } from "@/models/evento.model";

export async function updateEvento(
  data: Evento
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.put(`/eventos/${data.id}`, data);

    result = {
      success: response.status === 200,
      data: {
        message:
          response.status === 200
            ? "Evento editato com sucesso!"
            : "Erro ao editar evento",
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
          "Erro ao editar evento",
      },
    };

    return result;
  }
}

export async function generateTickets(eventoId: number) {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.get(`/eventos/generateTickets/${eventoId}`);

    result = {
      success: response.status === 204,
      data: {
        message:
          response.status === 204
            ? "Evento editato com sucesso!"
            : "Erro ao editar evento",
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
          "Erro ao editar evento",
      },
    };

    return result;
  }
}
