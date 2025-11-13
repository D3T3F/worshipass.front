import { AxiosError } from "axios";
import apiClient from "./axios.client";
import Result from "@/models/result.model";
import { Evento } from "@/models/evento.model";

export async function generateTickets(
  eventoId: number
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.get(
      `/eventos/generateTickets/${eventoId}`
    );

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

export async function findTodayEvents(): Promise<Result<Evento[]>> {
  let result: Result<Evento[]> = {
    success: false,
    data: [],
  };

  try {
    const response = await apiClient.get(`/eventos/hoje`);

    result = {
      success: true,
      data: response.data,
    };

    return result;
  } catch (e: AxiosError | any) {
    return result;
  }
}
