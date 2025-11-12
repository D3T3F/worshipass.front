import { AxiosError } from "axios";
import apiClient from "./axios.client";
import Result from "@/models/result.model";
import { capitalizeFirstLetter } from "@/utils/string";

type Models = "participante" | "evento" | "ticket" | "lanche";

export async function createOne<T>(
  data: T,
  type: Models
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.post(`/${type}s`, data);

    result = {
      success: response.status === 201,
      data: {
        message:
          response.status === 201
            ? `${capitalizeFirstLetter(type)} criado com sucesso!`
            : `Erro ao criar ${type}`,
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
          `Erro ao criar ${type}`,
      },
    };

    return result;
  }
}

export async function deleteById(
  id: number,
  type: Models
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.delete(`/${type}s/${id}`);

    result = {
      success: response.status === 204,
      data: {
        message:
          response.status === 204
            ? `${capitalizeFirstLetter(type)} excluido com sucesso!`
            : `Erro ao excluir ${type}`,
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
          `Erro ao excluir ${type}`,
      },
    };

    return result;
  }
}

export async function findAll<T>(type: Models): Promise<Result<T[]>> {
  let result: Result<T[]> = {
    success: false,
    data: [],
  };

  try {
    const response = await apiClient.get(`/${type}s`);

    result = {
      success: true,
      data: response.data,
    };

    return result;
  } catch (e: AxiosError | any) {
    return result;
  }
}

export async function update<T>(
  data: T,
  type: Models
): Promise<Result<{ message: string }>> {
  let result: Result<{ message: string }> = {
    success: false,
    data: { message: "" },
  };

  try {
    const response = await apiClient.put(`/${type}s/${(data as any).id}`, data);

    result = {
      success: response.status === 200,
      data: {
        message:
          response.status === 200
            ? `${capitalizeFirstLetter(type)} editato com sucesso!`
            : `Erro ao editar ${type}`,
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
          `Erro ao editar ${type}`,
      },
    };

    return result;
  }
}
