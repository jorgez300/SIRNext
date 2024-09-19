"use client";
import { Button } from "@/components/ui/button";

import { ArrowUpDown, PlusIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { TablaLinks } from "./Components/Tabla";

import { ColumnDef } from "@tanstack/react-table";

import MantenedorLink from "./Components/Mantenedor";
import { Cliente } from "@/domain/Models/Clientes/Cliente";
import { GetClienteById, GetClientes } from "@/domain/Services/ClienteService";
import FiltrosCliente from "./Components/Filtros";
import { FiltroCliente } from "@/domain/DTOs/FiltroClientes";

export default function ClientesPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
  const [cliente, setCliente] = useState<Cliente | undefined>();

  useEffect(() => {
    Buscar();
  }, []);

  const Buscar = (filtro?: FiltroCliente) => {
    GetClientes(filtro).then((result) => {
      setListaClientes(result);
    });
  };

  const ModalVisible = (flag: boolean, id?: string | undefined) => {
    if (!flag) {
      setCliente(undefined);
      setOpen(flag);
    }
    if (id == undefined) {
      setCliente(undefined);
      setOpen(flag);
    } else {
      GetClienteById(id).then((result) => {
        setCliente(result);
        setOpen(flag);
      });
    }
  };

  const SaveDate = (fecha: Date | undefined) => {
    setDate(fecha);
  };

  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: "Identificacion",
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
      cell: ({ row }) => {
        const cliente = row.original;
        return (
          <div className="grid grid-cols-2 gap-3 w-52">
            <Edit2Icon
              className="text-teal-600"
              onClick={() => {
                ModalVisible(true, cliente.Id);
              }}
            />
            <Trash2Icon
              className="text-teal-600"
              onClick={() => {
                alert(cliente.Id);
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
        <TablaLinks columns={columns} data={listaClientes} />
      </div>
      <MantenedorLink
        open={open}
        setOpen={ModalVisible}
        setDate={SaveDate}
        date={date}
        cliente={cliente}
      />
    </main>
  );
}
