
import { Cliente } from "@/domain/Models/Clientes/Cliente";
import { create } from "zustand";

interface AdministraClienteStore {
  Cliente?: Cliente;
  RegistraCliente: (cliente?: Cliente) => Promise<void>;
  ResetCliente: () => Promise<void>;
}

export const useAdministraClienteStore = create<AdministraClienteStore>(
  (set) => ({
    Cliente: undefined,
    RegistraCliente: async (cliente?: Cliente) => {
      set({
        Cliente: cliente,
      });
    },
    ResetCliente: async () => {
      set({
        Cliente: undefined,
      });
    },
  })
);
