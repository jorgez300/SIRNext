"use server";

import { ExecQuery, GetCursor } from "../Clients/DatabaseClient";
import { ModelosPorMarca } from "../DTOs/Vehiculos/ModelosPorMarca.Dto";
import { Vehiculo } from "../Models/Vehiculos/Vehiculo";

export const GetModelosPorMarca = async () => {
  const Lista: ModelosPorMarca[] = [
    {
      Marca: "Chevrolet",
      Modelos: [
        "Aveo 1.6",
        "Luv Dmax 3.5",
        "Silverado 5.3",
        "Rey Camion 6.0",
        "Optra"
      ],
    },
  ];
  return Lista;
};

export const GetVehiculosPorProducto = async (Codigo?: string) => {
  const lista: Vehiculo[] = [];

  if (!Codigo) {
    return lista;
  }

  let query = ``;

  query = `SELECT pv.marca, pv.modelo, pv.desde, pv.hasta
            FROM public.productos p left join public.productosvehiculos pv on p.codigo = pv.codigo
            WHERE p.codigo = UPPER('${Codigo}')`;

  const data = await GetCursor(query);
  data.forEach((item) => {
    if (item.modelo) {
      lista.push({
        Modelo: item.modelo,
        Marca: item.marca,
        Desde: item.desde,
        Hasta: item.hasta,
      });
    }
  });
  return lista;
};

export const EliminaVehiculosPorProducto = async (Codigo?: string) => {
  const query = `DELETE FROM Public.ProductosVehiculos 
                    WHERE Codigo = UPPER('${Codigo}')`;

  await ExecQuery(query);
};

export const InsertaVehiculosPorProducto = async (
  Codigo: string,
  vehiculos: Vehiculo[]
) => {
  if (vehiculos.length <= 0) {
    return;
  }

  let query = `INSERT INTO ProductosVehiculos (Codigo, Marca, Modelo, Desde, Hasta) VALUES`;
  const reg: string[] = [];
  vehiculos.forEach((item) => {
    reg.push(
      ` (UPPER('${Codigo}'), '${item.Marca}', '${item.Modelo}', ${
        item.Desde ?? "NULL"
      }, ${item.Desde ?? "NULL"}) `
    );
  });

  query += reg.join(",");

  await ExecQuery(query);
};
