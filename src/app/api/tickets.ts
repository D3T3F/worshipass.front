import Result from "@/models/result.model";
import apiClient from "./axios.client";
import { AxiosError } from "axios";

export async function reedemLanche(
  ticketId: number,
  lancheId: number
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
	success: false,
	data: { message: "" },
  };

  try {
	const response = await apiClient.get(
	  `/tickets/reedemLanche?ticket=${ticketId}&lanche=${lancheId}`
	);

	result = {
	  success: response.status === 204,
	  data: {
		message:
		  response.status === 204
			? "Lanche resgatado com sucesso!"
			: "Erro ao resgatar lanche",
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
		  "Erro ao resgatar lanche",
	  },
	};

	return result;
  }
}