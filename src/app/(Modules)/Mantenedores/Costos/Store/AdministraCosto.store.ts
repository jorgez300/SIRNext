import { Costo } from "@/domain/Models/Costos/Costo";
import { create } from "zustand";

interface AdministraCostoStore {
  Costo?: Costo;
  RegistraCosto: (costo?: Costo) => Promise<void>;
  ResetCosto: () => Promise<void>;
}

export const useAdministraCostoStore = create<AdministraCostoStore>(
  (set) => ({
    Costo: undefined,
    RegistraCosto: async (costo?: Costo) => {
      set({
        Costo: costo,
      });
    },
    ResetCosto: async () => {
      set({
        Costo: undefined,
      });
    },
  })
);
