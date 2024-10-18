import { Vehiculo } from "@/domain/Models/Vehiculos/Vehiculo";

export type FiltroProducto = {
  Codigo?: string;
  Descripcion?: string;
  Vehiculo?: Vehiculo
  MarcaProd?: string;
  ConExistencia?: boolean;
};
