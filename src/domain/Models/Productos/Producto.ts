export type Producto = {
    Codigo: string;
    Descripcion: string;
    MarcaProd?: string;
    Vigente?: boolean;
    Existencia: number;
    Costo: number;
    Precio: number;
    Minimo?: number;
    Maximo?: number;
  };
  