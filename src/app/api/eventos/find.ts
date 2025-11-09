import { AxiosError } from "axios";
import apiClient from "../axios.client";
import Result from "@/models/result.model";
import { Evento } from "@/models/evento.model";

export default async function findEventos(): Promise<Result<Evento[]>> {
  let result: Result<Evento[]> = {
    success: false,
    data: [],
  };

  try {
    const response = await apiClient.get("/eventos");

    result = {
      success: true,
      data: response.data,
    };

    return result;
  } catch (e: AxiosError | any) {
    return result;
  }
}
