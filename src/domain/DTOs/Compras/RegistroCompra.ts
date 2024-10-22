export type RegistroCompra = {
    Posicion: number;
    ProductoId: string;
    ProductoDsc: string;
    Cantidad: number;
    Existencia?: number;
    Costo: number | string;
    Precio: number | string;
    Total: number;
  };