"use client";
import { Button } from "@/components/ui/button";

import { ArrowUpDown, PlusIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { TablaInventario } from "./Components/Tabla";

import { ColumnDef } from "@tanstack/react-table";

import { Inventario } from "@/domain/Models/Inventario/Inventario";
import { FiltroInventario } from "@/domain/DTOs/FiltroInventario";
import FiltrosInventario from "./Components/Filtros";
import MantenedorInventario from "./Components/Mantenedor";
import {
  GetInventario,
  GetInventarioById,
} from "@/domain/Services/InventarioService";

export default function InventarioPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [listaInventario, setListaInventario] = useState<Inventario[]>([]);
  const [inventario, setInventario] = useState<Inventario | undefined>();

  useEffect(() => {
    Buscar();
  }, []);

  const Buscar = (filtro?: FiltroInventario) => {
    GetInventario(filtro).then((result) => {
      setListaInventario(result);
    });
  };

  const ModalVisible = (flag: boolean, id?: string | undefined) => {
    if (!flag) {
      setInventario(undefined);
      setOpen(flag);
    }
    if (id == undefined) {
      setInventario(undefined);
      setOpen(flag);
    } else {
      GetInventarioById(id).then((result) => {
        setInventario(result);
        setOpen(flag);
      });
    }
  };

  const SaveDate = (fecha: Date | undefined) => {
    setDate(fecha);
  };

  const columns: ColumnDef<Inventario>[] = [
    {
      accessorKey: "Codigo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Codigo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Descripcion",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Descripcion
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Existencia",
      header: "Existencia",
    },
    {
      accessorKey: "Costo",
      header: "Costo",
    },
    {
      accessorKey: "Precio",
      header: "Precio",
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const inventario = row.original;
        return (
          <div className="grid grid-cols-2 gap-3 w-52">
            <Edit2Icon
              className="text-teal-600"
              onClick={() => {
                ModalVisible(true, inventario.Id);
              }}
            />
            <Trash2Icon
              className="text-teal-600"
              onClick={() => {
                alert(inventario.Id);
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
        <FiltrosInventario Buscar={Buscar} />
      </div>
      <div className="w-full">
        <TablaInventario columns={columns} data={listaInventario} />
      </div>
      <MantenedorInventario
        open={open}
        setOpen={ModalVisible}
        setDate={SaveDate}
        date={date}
        inventario={inventario}
      />
    </main>
  );
}
