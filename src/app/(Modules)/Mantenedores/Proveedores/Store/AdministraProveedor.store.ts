import { Proveedor } from "@/domain/Models/Proveedores/Proveedor";
import { create } from "zustand";

interface AdministraProveedorStore {
  Proveedor?: Proveedor;
  RegistraProveedor: (proveedor?: Proveedor) => Promise<void>;
  ResetProveedor: () => Promise<void>;
}

export const useAdministraProveedorStore = create<AdministraProveedorStore>(
  (set) => ({
    Proveedor: undefined,
    RegistraProveedor: async (proveedor?: Proveedor) => {
      set({
        Proveedor: proveedor,
      });
    },
    ResetProveedor: async () => {
      set({
        Proveedor: undefined,
      });
    },
  })
);
