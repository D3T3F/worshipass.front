import { Ticket } from "./ticket.model";

export interface Participante {
	id: number;
	nomeCompleto: string;
	email: string;
	telefone: string;
	tickets?: Ticket[];
}