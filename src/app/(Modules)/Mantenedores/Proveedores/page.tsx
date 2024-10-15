"use client";
import { Button } from "@/components/ui/button";

import { ArrowUpDown, PlusIcon, Edit2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Proveedor } from "@/domain/Models/Proveedores/Proveedor";
import { useAdministraProveedorStore } from "./Store/AdministraProveedor.store";
import { GetProveedorById, GetProveedores } from "@/domain/Services/ProveedorService";
import { FiltroProveedor } from "@/domain/DTOs/Proveedores/FiltroProveedores";
import FiltrosProveedor from "./Components/Filtros";
import { TablaProveedor } from "./Components/Tabla";
import MantenedorProveedor from "./Components/Mantenedor";




export default function ProveedoresPage() {
  const [open, setOpen] = useState(false);
  const [listaProveedores, setListaProveedores] = useState<Proveedor[]>([]);

  const { RegistraProveedor } = useAdministraProveedorStore();
  useEffect(() => {
    Buscar();
  }, []);

  const Buscar = async (filtro?: FiltroProveedor) => {
    setListaProveedores(await GetProveedores(filtro));
  };

  const ModalVisible = async (flag: boolean, id?: string | undefined) => {
    if (!flag) {
      await RegistraProveedor(undefined);
      setOpen(flag);
    } else if (!id) {
      await RegistraProveedor(undefined);
      setOpen(flag);
    } else {
      await RegistraProveedor(await GetProveedorById(id));
      setOpen(flag);
    }
  };

  const columns: ColumnDef<Proveedor>[] = [
    {
      accessorKey: "Identificacion",
      size: 300,
      header: "Identificacion",
    },
    {
      accessorKey: "Nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      header: "Acciones",
      size: 300,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="grid grid-cols-2 gap-3 w-52">
            <Edit2Icon
              className="text-teal-600"
              onClick={async () => {
                await ModalVisible(true, item.Id);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <main className="grid grid-cols-1 gap-3 p-4">
      <div className="flex justify-end">
        <Button
          className="bg-teal-600"
          onClick={() => {
            setOpen(true);
          }}
        >
          <PlusIcon className="mr-2" />
          Agregar
        </Button>
      </div>

      <div>
        <FiltrosProveedor Buscar={Buscar} />
      </div>
      <div className="w-full">
        <TablaProveedor columns={columns} data={listaProveedores} />
      </div>
      {open ? <MantenedorProveedor setOpen={ModalVisible} /> : <></>}
    </main>
  );
}


