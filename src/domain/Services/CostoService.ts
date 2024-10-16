"use server";

import { FiltroCosto } from "../DTOs/Costos/FiltroCosto";
import { Costo } from "../Models/Costos/Costo";



export const GetCostos = async (filtro?: FiltroCosto) => {
  const Lista: Costo[] = [
    {
      Id: "1",
      Codigo: "Costo_1",
      Descripcion: "Costo 1",
      Costo: 10.5,
    },

  ];

  return Lista;
};

export const GetCostoById = async (id: string) => {
  const Item: Costo =
    {
        Id: "1",
        Codigo: "Costo_1",
        Descripcion: "Costo 1",
        Costo: 10.5,
    };

  return Item;
};

export const GuardaCosto = async (Item:Costo) => {
  console.log("GuardaCosto", Item);
};