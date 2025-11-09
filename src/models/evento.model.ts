import { Ticket } from "./ticket.model";

export interface Evento {
	id: number;
	nome: string;
	dataEvento: Date;
	capacidadeTotal: number;
	local: string;
	tickets?: Ticket[];
}