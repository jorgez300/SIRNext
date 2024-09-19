"use server";

import { FiltroCliente } from "../DTOs/FiltroClientes";
import { Cliente } from "../Models/Clientes/Cliente";

export const GetClientes = async (filtro: FiltroCliente | undefined) => {
  console.log("GetClientes", filtro);
  const Lista: Cliente[] = [
    {
      Id: "1",
      Identificacion: "Paid",
      Nombre: "INV001",
    },

  ];

  return Lista;
};

export const GetClienteById = async (id: string) => {
  console.log("GetClienteById", id);
  const Item: Cliente =
    {
        Id: "1",
        Identificacion: "Paid",
        Nombre: "INV001",
    };

  return Item;
};

export const GuardaCliente = async (Item:Cliente) => {
  console.log("GuardaCliente", Item);
};

