import { AxiosError } from "axios";
import apiClient from "../axios.client";
import Result from "@/models/result.model";
import { Ticket } from "@/models/ticket.model";

export default async function updateTicket(
  data: Ticket
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.put(`/tickets/${data.id}`, data);

    result = {
      success: response.status === 200,
      data: {
        message:
          response.status === 200
            ? "Ticket editato com sucesso!"
            : "Erro ao editar ticket",
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
          "Erro ao editar ticket",
      },
    };

    return result;
  }
}
