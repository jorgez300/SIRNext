"use server";

import { ExecQuery, GetCursor } from "../Clients/DatabaseClient";
import { FiltroProveedor } from "../DTOs/Proveedores/FiltroProveedores";
import { Proveedor } from "../Models/Proveedores/Proveedor";

export const GetProveedores = async (
  filtro?: FiltroProveedor
): Promise<Proveedor[]> => {
  let query = ``;

  if (filtro) {
    query = `SELECT id, identificacion, nombre
              FROM public.proveedores
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
              FROM public.proveedores
              LIMIT 100`;
  }

  const lista: Proveedor[] = [];
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

export const GetProveedoresOperacion = async (
  filtro: FiltroProveedor
): Promise<Proveedor[]> => {
  let query = ``;

  query = `SELECT id, identificacion, nombre
              FROM public.proveedores
              WHERE 
              (UPPER(identificacion) LIKE '%${
                filtro.Identificacion ? filtro.Identificacion.toUpperCase() : ""
              }%' OR '' = '${filtro.Identificacion ?? ""}') OR
              (UPPER(nombre) LIKE '%${
                filtro.Nombre ? filtro.Nombre.toUpperCase() : ""
              }%' OR '' = '${filtro.Nombre ?? ""}')
              LIMIT 20`;

  const lista: Proveedor[] = [];
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

export const GetProveedorById = async (
  id: string
): Promise<Proveedor | undefined> => {
  const query = `SELECT id, identificacion, nombre
                  FROM public.proveedores
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

export const GetProveedorByIdentificacion = async (
  id: string
): Promise<Proveedor | undefined> => {
  const query = `SELECT id, identificacion, nombre
                  FROM public.proveedores
                  WHERE 
                  identificacion =  upper('${id}')
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

export const ActualizaProveedor = async (item: Proveedor) => {
  const query = `UPDATE public.proveedores SET 
                  identificacion='${item.Identificacion}', 
                  nombre='${item.Nombre}'
                WHERE id=${item.Id}`;

  await ExecQuery(query);
};

export const InsertaProveedor = async (item: Proveedor) => {
  const query = `INSERT INTO public.proveedores(identificacion, nombre) VALUES 
                ('${item.Identificacion}', '${item.Nombre}')`;

  await ExecQuery(query);
};
