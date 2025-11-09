import { Lanche } from "./lanche.model";

export interface ResgateLanche {
	id: number;
	dataResgate: Date;
	lanche?: Lanche;
}