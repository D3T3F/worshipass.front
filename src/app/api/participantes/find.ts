import { AxiosError } from "axios";
import apiClient from "../axios.client";
import Result from "@/models/result.model";
import { Participante } from "@/models/participante.model";

export default async function findParticipantes(): Promise<
  Result<Participante[]>
> {
  let result: Result<Participante[]> = {
    success: false,
    data: [],
  };

  try {
    const response = await apiClient.get("/participantes");

    result = {
      success: true,
      data: response.data,
    };

    return result;
  } catch (e: AxiosError | any) {
    return result;
  }
}
