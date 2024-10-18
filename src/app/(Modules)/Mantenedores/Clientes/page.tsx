"use client";
import { Button } from "@/components/ui/button";

import { ArrowUpDown, PlusIcon, Edit2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { TablaClientes } from "./Components/Tabla";

import { ColumnDef } from "@tanstack/react-table";

import MantenedorCliente from "./Components/Mantenedor";
import { Cliente } from "@/domain/Models/Clientes/Cliente";
import { GetClienteById, GetClientes } from "@/domain/Services/ClienteService";
import FiltrosCliente from "./Components/Filtros";
import { FiltroCliente } from "@/domain/DTOs/Clientes/FiltroClientes";
import { useAdministraClienteStore } from "./Store/AdmistraCliente.store";
import { useCodPantallaStore } from "@/app/global/Store/CodPantalla.store";

export default function ClientesPage() {
  const [open, setOpen] = useState(false);
  const [listaClientes, setListaClientes] = useState<Cliente[]>([]);

  const { RegistraCliente } = useAdministraClienteStore();

  const { RegistraCodPantalla } = useCodPantallaStore();

  useEffect(() => {
    RegistraCodPantalla({
      Codigo: "",
      Version: "V 0.1",
      Titulo: "Administrar Clientes",
    });
    Buscar();
  }, []);

  const Buscar = async (filtro?: FiltroCliente) => {
    setListaClientes(await GetClientes(filtro));
  };

  const ModalVisible = async (flag: boolean, id?: string | undefined) => {
    if (!flag) {
      await RegistraCliente(undefined);
      await Buscar();
      setOpen(flag);
    } else if (!id) {
      await RegistraCliente(undefined);
      setOpen(flag);
    } else {
      await RegistraCliente(await GetClienteById(id));
      setOpen(flag);
    }
  };

  const columns: ColumnDef<Cliente>[] = [
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
        const cliente = row.original;
        return (
          <div className="grid grid-cols-2 gap-3 w-52">
            <Edit2Icon
              className="text-teal-600"
              onClick={async () => {
                await ModalVisible(true, cliente.Id);
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
        <FiltrosCliente Buscar={Buscar} />
      </div>
      <div className="w-full">
        <TablaClientes columns={columns} data={listaClientes} />
      </div>
      {open ? <MantenedorCliente setOpen={ModalVisible} /> : <></>}
    </main>
  );
}
