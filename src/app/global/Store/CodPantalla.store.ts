import { CodPantalla, CodPantallaStore } from "@/domain/DTOs/CodPantalla.dto";
import { create } from "zustand";

export const useCodPantallaStore = create<CodPantallaStore>((set) => ({
  Pantalla: undefined,
  RegistraCodPantalla: async (pantalla: CodPantalla) => {
    set({
        Pantalla: pantalla,
    });
  },
}));
