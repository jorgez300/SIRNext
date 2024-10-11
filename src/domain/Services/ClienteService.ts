"use server";

import { ExecQuery, GetCursor } from "../Clients/DatabaseClient";
import { FiltroCliente } from "../DTOs/Clientes/FiltroClientes";
import { Cliente } from "../Models/Clientes/Cliente";

export const GetClientes = async (
  filtro?: FiltroCliente
): Promise<Cliente[]> => {
  let query = ``;

  if (filtro) {
    query = `SELECT id, identificacion, nombre
              FROM public.clientes
              WHERE 
              (UPPER(identificacion) LIKE '%${
                filtro.Identificacion ? filtro.Identificacion.toUpperCase() : ""
              }%' OR '' = '${filtro.Identificacion ?? ""}') AND
              (UPPER(nombre) LIKE '%${
                filtro.Nombre ? filtro.Nombre.toUpperCase() : ""
              }%' OR '' = '${filtro.Nombre ?? ""}')
              LIMIT 100`;
  } else {
    query = `SELECT id, identificacion, nombre
              FROM public.clientes
              LIMIT 100`;
  }

  const lista: Cliente[] = [];
  const data = await GetCursor(query);
  data.forEach((item) => {
    lista.push({
      Id: item.id,
      Identificacion: item.identificacion,
      Nombre: item.nombre,
    });
  });

  return lista;
};

export const GetClienteById = async (
  id: string
): Promise<Cliente | undefined> => {
  const query = `SELECT id, identificacion, nombre
                  FROM public.clientes
                  WHERE 
                  id = ${id}
                  LIMIT 1`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return undefined;
  }

  return {
    Id: data[0].id,
    Identificacion: data[0].identificacion,
    Nombre: data[0].nombre,
  };
};

export const ActualizaCliente = async (Cliente: Cliente) => {
  const query = `UPDATE public.clientes SET 
                  identificacion='${Cliente.Identificacion}', 
                  nombre='${Cliente.Nombre}'
                WHERE id=${Cliente.Id}`;

  await ExecQuery(query);
};

export const InsertaCliente = async (Cliente: Cliente) => {
  const query = `INSERT INTO public.clientes(identificacion, nombre) VALUES 
                ('${Cliente.Identificacion}', '${Cliente.Nombre}')`;

  await ExecQuery(query);
};
