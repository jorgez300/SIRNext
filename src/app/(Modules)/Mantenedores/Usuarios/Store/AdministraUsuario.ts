import { Usuario } from "@/domain/Models/Usuarios/Usuario";
import { create } from "zustand";

interface AdministraUsuarioStore {
  Usuario?: Usuario;
  RegistraUsuario: (Usuario?: Usuario) => Promise<void>;
  ResetUsuario: () => Promise<void>;
}

export const useAdministraUsuarioStore = create<AdministraUsuarioStore>(
  (set) => ({
    Usuario: undefined,
    RegistraUsuario: async (Usuario?: Usuario) => {
      set({
        Usuario: Usuario,
      });
    },
    ResetUsuario: async () => {
      set({
        Usuario: undefined,
      });
    },
  })
);
