import { Historico } from "../Comun/Historico";

export type Cliente = {
  Id?: string;
  Identificacion: string;
  Nombre: string;
  Historial?: Historico;
};
