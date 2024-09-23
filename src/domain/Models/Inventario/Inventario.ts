export type Inventario = {
  Id?: string;
  Codigo: string;
  Descripcion: string;
  Existencia: number;
  Costo: number;
  Precio: number;
  Minimo?: number;
  Maximo?: number;
};
