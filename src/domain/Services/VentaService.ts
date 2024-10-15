"use server";

import { randomUUID } from "crypto";
import { ExecQuery } from "../Clients/DatabaseClient";
import { ItemVenta } from "../Models/Ventas/ItemVenta";
import { Venta } from "../Models/Ventas/Venta";
import { Cliente } from "../Models/Clientes/Cliente";
import { RegistroVenta } from "../DTOs/Ventas/RegistroVenta";
import { ActualizaExistenciaProducto } from "./ProductoService";

export const InsertaOperacionVenta = async (
  ItemVenta: RegistroVenta[],
  cliente: Cliente
) => {
  const Uid: string = randomUUID().toString();

  const venta: Venta = {
    Uid: Uid,
    ClienteId: cliente.Id,
    UsuarioId: "Admin",
    TotalArticulos: ItemVenta.reduce((accumulator, item) => {
      return accumulator + Number(item.Cantidad);
    }, 0),
    TotalVenta: ItemVenta.reduce((accumulator, item) => {
      return accumulator + Number(item.Total);
    }, 0),
  };

  await InsertaVenta(venta);
  ItemVenta.forEach(async (item) => {
    await InsertaItemVenta({
      VentaId: Uid,
      Posicion: item.Posicion,
      ProductoId: item.ProductoId,
      Cantidad: item.Cantidad,
      Costo: item.Costo,
      Precio: item.Precio,
      Total: item.Total,
    });

    await ActualizaExistenciaProducto(item.ProductoId, item.Cantidad, '-')
  });
};

const InsertaVenta = async (venta: Venta) => {
  const query = `INSERT INTO public.Ventas (Fecha, Uid, ClienteId, UsuarioId, TotalArticulos, TotalVenta)VALUES 
                (CURRENT_TIMESTAMP, '${venta.Uid}', '${venta.ClienteId}', '${venta.UsuarioId}', ${venta.TotalArticulos}, ${venta.TotalVenta})`;

  await ExecQuery(query);
};

const InsertaItemVenta = async (item: ItemVenta) => {
  const query = `INSERT INTO ItemVentas (VentaUid, Posicion, ProductoId, Cantidad, Costo, Precio, Total)
                VALUES ('${item.VentaId}', ${item.Posicion}, '${item.ProductoId}', ${item.Cantidad}, ${item.Costo}, ${item.Precio}, ${item.Total})`;

  await ExecQuery(query);
};
