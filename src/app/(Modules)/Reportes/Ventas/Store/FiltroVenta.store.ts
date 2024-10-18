

import { FiltroVenta } from "@/domain/DTOs/Ventas/FiltroVenta";
import { create } from "zustand";

interface FiltroVentaStore {
  Filtros?: FiltroVenta;
  RegistraFiltros: (filtros?: FiltroVenta) => Promise<void>;
  ResetFiltros: () => Promise<void>;
}

export const useFiltroVentaStore = create<FiltroVentaStore>(
  (set) => ({
    Filtros: undefined,
    RegistraFiltros: async (filtros?: FiltroVenta) => {
      set({
        Filtros: filtros,
      });
    },
    ResetFiltros: async () => {
      set({
        Filtros: undefined,
      });
    },
  })
);