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
        "Optra",
        "Rey Camion 6.0",
        "Silverado 5.3",
      ],
    },
    {
      Marca: "Ford",
      Modelos: [
        "Ecosport 2.0",
        "Ecosport Titanium",
        "Explorer Eddi Bauer 4.6 3v",
        "Explorer Limited 3.5",
        "Escape 3.0",
        "Fiesta 1.6",
        "Fiesta Titanium",
        "Focus 2.0",
        "Fortaleza 5.4 2v",
        "Fortaleza 4.6 2v",
        "Fusion 3.0",
        "FX4 5.4 3v",
        "Super Duty F350 6.2",
        "Super Duty F250 6.2",
        "Triton F350 5.4 2v",
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
