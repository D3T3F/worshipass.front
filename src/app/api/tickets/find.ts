import { AxiosError } from "axios";
import apiClient from "../axios.client";
import Result from "@/models/result.model";
import { Ticket } from "@/models/ticket.model";

export default async function findTickets(): Promise<
  Result<Ticket[]>
> {
  let result: Result<Ticket[]> = {
    success: false,
    data: [],
  };

  try {
    const response = await apiClient.get("/tickets");

    result = {
      success: true,
      data: response.data,
    };

    return result;
  } catch (e: AxiosError | any) {
    return result;
  }
}
