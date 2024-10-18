import { create } from "zustand";

interface AdministraProductoStore {
  Codigo?: string;
  RegistraCodigo: (Codigo?: string) => Promise<void>;
  ResetCodigo: () => Promise<void>;
}

export const useAdministraProductoStore = create<AdministraProductoStore>(
  (set) => ({
    Codigo: undefined,
    RegistraCodigo: async (Codigo?: string) => {
      set({
        Codigo: Codigo,
      });
    },
    ResetCodigo: async () => {
      set({
        Codigo: undefined,
      });
    },
  })
);
