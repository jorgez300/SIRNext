"use server";

import { randomUUID } from "crypto";
import { ExecQuery, GetCursor } from "../Clients/DatabaseClient";
import { FiltroCosto } from "../DTOs/Costos/FiltroCosto";
import { Costo } from "../Models/Costos/Costo";

export const GetCostos = async (filtro?: FiltroCosto): Promise<Costo[]> => {
  let query = ``;

  if (filtro) {
    filtro.Codigo = filtro.Codigo ? filtro.Codigo.toUpperCase() : "";
    filtro.Descripcion = filtro.Descripcion
      ? filtro.Descripcion.toUpperCase()
      : "";
  }

  if (filtro) {
    query = `SELECT id, codigo, descripcion, costo, tipo, TO_CHAR(fecha, 'YYYY-MM-DD')
                from 
                (
                  SELECT id, codigo, descripcion, costo, tipo, fecha
                  FROM public.costo
                  WHERE 
                  tipo = 'R'
                  UNION ALL
                  SELECT id, codigo, descripcion, costo, tipo, fecha
                  FROM public.costo
                  where
                  tipo <> 'R' and
                  EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
                  AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
                )
              where
              (upper(codigo) like '%${filtro.Codigo!.toUpperCase()}%' or '' = '${
      filtro.Codigo
    }') and
              (upper(descripcion) like '%${filtro.Descripcion!.toUpperCase()}%' or '' = '${
      filtro.Descripcion
    }') 
              order by descripcion
              limit 100`;
  } else {
    query = `SELECT id, codigo, descripcion, costo, tipo, TO_CHAR(fecha, 'YYYY-MM-DD') fecha
                from 
                (
                  SELECT id, codigo, descripcion, costo, tipo, fecha
                  FROM public.costo
                  WHERE 
                  tipo = 'R'
                  UNION ALL
                  SELECT id, codigo, descripcion, costo, tipo, fecha
                  FROM public.costo
                  where
                  tipo <> 'R' and
                  EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
                  AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
                )
              order by tipo, descripcion
              limit 100`;
  }

  const lista: Costo[] = [];
  const data = await GetCursor(query);
  data.forEach((item) => {
    lista.push({
      Id: item.id,
      Codigo: item.codigo,
      Descripcion: item.descripcion,
      Costo: item.costo,
      Tipo: (item.tipo == 'R') ? 'Recurrente' : 'Unico',
      Fecha: item.fecha,
    });
  });

  return lista;
};

export const GetCostoById = async (id: string): Promise<Costo | undefined> => {
  const query = `SELECT
                    id, 
                    codigo, 
                    descripcion, 
                    costo, 
                    tipo, 
                    TO_CHAR(fecha, 'YYYY-MM-DD') fecha
                  FROM public.costo
                  where 
                  upper(id) = upper('${id}')
                  limit 1`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return undefined;
  }

  return {
    Id: data[0].id,
    Codigo: data[0].codigo,
    Descripcion: data[0].descripcion,
    Costo: data[0].costo,
    Tipo: data[0].tipo,
    Fecha: data[0].fecha,
  };
};

export const ActualizaCosto = async (Costo: Costo) => {
  const query = `UPDATE public.costo SET 
                  codigo='${Costo.Codigo}', 
                  descripcion='${Costo.Descripcion}', 
                  costo=${Costo.Costo}, 
                  tipo='${Costo.Tipo}'
                WHERE id='${Costo.Id}'`;

  await ExecQuery(query);
};

export const InsertaCosto = async (Costo: Costo) => {
  const Uid: string = randomUUID().toString();

  Costo.Id = Uid;

  const query = `INSERT INTO Costo (Id, Codigo, Descripcion, Costo, Tipo, Fecha) VALUES
('${Costo.Id}', '${Costo.Codigo}', '${Costo.Descripcion}', ${Costo.Costo}, '${Costo.Tipo}', CURRENT_TIMESTAMP)`;

  await ExecQuery(query);
};

export const EliminaCosto = async (id: string) => {
  const query = `DELETE FROM public.costo WHERE id='${id}'`;

  await ExecQuery(query);
};

export const GetTotalCostos = async (periodo: string) => {
  const query = `select sum(costo) total
                  from public.costo
                  where 
                  (EXTRACT(MONTH FROM fecha) = ${periodo.split("-")[1]}  and EXTRACT(YEAR FROM fecha) = ${periodo.split("-")[0]}) OR tipo = 'R'`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return 0;
  }
  return (data[0].total) ? data[0].total : 0;
};