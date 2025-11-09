import { Evento } from "./evento.model";
import { Participante } from "./participante.model";
import { ResgateLanche } from "./resgate-lanche.model";

export interface Ticket {
	id: number;
	status: string;
	dataEmissao: Date;
	dataUso: Date;
	participante?: Participante;
	evento?: Evento;
	resgateLanche?: ResgateLanche;
}