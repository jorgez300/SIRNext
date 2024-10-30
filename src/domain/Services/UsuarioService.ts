"use server";

import { cookies } from "next/headers";
import { ExecQuery, GetCursor } from "../Clients/DatabaseClient";
import { createSession, decrypt } from "../Helpers/SessionHelper";
import { Usuario } from "../Models/Usuarios/Usuario";

export const GetUsuarios = async (): Promise<Usuario[]> => {
  let query = ``;

  query = `SELECT id, nombre, rol
              FROM public.usuario
              LIMIT 100`;

  const lista: Usuario[] = [];
  const data = await GetCursor(query);
  data.forEach((item) => {
    lista.push({
      Id: item.id,
      Nombre: item.nombre,
      Rol: item.rol,
    });
  });

  return lista;
};

export const GetUsuarioById = async (
  id: string
): Promise<Usuario | undefined> => {
  const query = `SELECT id, nombre, rol
                  FROM public.usuario
                  WHERE 
                  id = '${id}'
                  LIMIT 1`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return undefined;
  }

  return {
    Id: data[0].id,
    Nombre: data[0].nombre,
    Rol: data[0].rol,
  };
};

export const ActualizaUsuario = async (Usuario: Usuario) => {
  const query = `UPDATE public.usuario SET 
                  nombre='${Usuario.Nombre!.toUpperCase()}', 
                  rol='${Usuario.Rol}',
                  pass='${Usuario.Pass!.toUpperCase()}'
                WHERE id='${Usuario.Id}'`;

  await ExecQuery(query);
};

export const InsertaUsuario = async (Usuario: Usuario) => {
  const query = `INSERT INTO public.usuario (id, nombre, rol, pass) VALUES 
                ('${Usuario.Id!.toUpperCase()}', '${Usuario.Nombre!.toUpperCase()}', '${Usuario.Rol}', '${Usuario.Pass!.toUpperCase()}')`;

  await ExecQuery(query);
};

export const ValidaUsuario = async (
  id: string,
  pass: string
): Promise<boolean | undefined> => {
  const query = `SELECT upper(id) id, nombre, upper(rol) rol
                  FROM public.usuario
                  WHERE 
                  upper(id) = '${id.toUpperCase()}' and
                  upper(pass) = '${pass.toUpperCase()}'
                  LIMIT 1`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return false;
  }

  await createSession(data[0].id, data[0].rol);

  return true;
};

export const ObtieneRolUsuario = async () => {
  const cookie = cookies().get("session")?.value;

  if (!cookie) {
    return "";
  }
  const session = await decrypt(cookie);

  return session!.userRol;
};

export const ObtieneIdUsuario = async () => {
  const cookie = cookies().get("session")?.value;

  if (!cookie) {
    return "";
  }
  const session = await decrypt(cookie);

  return session!.userId!.toString();
};
