import { FiltroCompra } from "@/domain/DTOs/Compras/FiltroCompra";
import { create } from "zustand";

interface FiltroCompraStore {
  Filtros?: FiltroCompra;
  RegistraFiltros: (filtros?: FiltroCompra) => Promise<void>;
  ResetFiltros: () => Promise<void>;
}

export const useFiltroCompraStore = create<FiltroCompraStore>(
  (set) => ({
    Filtros: undefined,
    RegistraFiltros: async (filtros?: FiltroCompra) => {
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