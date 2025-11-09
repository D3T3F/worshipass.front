import { ResgateLanche } from "./resgate-lanche.model";

export interface Lanche {
	id: number;
	nome: string;
	descricao: string;
	quantidadeDisponivel: number;
	resgates?: ResgateLanche[];
}