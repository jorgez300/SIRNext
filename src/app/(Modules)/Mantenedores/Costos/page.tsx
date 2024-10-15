"use client";
import { Button } from "@/components/ui/button";

import { ArrowUpDown, PlusIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { GetCostoById, GetCostos } from "@/domain/Services/CostoService";
import { FiltroCosto } from "@/domain/DTOs/Costos/FiltroCosto";
import { Costo } from "@/domain/Models/Costos/Costo";
import FiltrosCosto from "./Components/Filtros";
import MantenedorCosto from "./Components/Mantenedor";
import { TablaCosto } from "./Components/Tabla";
import { useCodPantallaStore } from "@/app/global/Store/CodPantalla.store";


export default function CostoPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [listaCosto, setListaCosto] = useState<Costo[]>([]);
  const [costo, setCosto] = useState<Costo | undefined>();
  const { RegistraCodPantalla } = useCodPantallaStore();

  useEffect(() => {
    RegistraCodPantalla({
      Codigo: "",
      Version: "V 0.1",
      Titulo: "Administrar Costos",
    });
    Buscar();
  }, []);

  const Buscar = (filtro?: FiltroCosto) => {
    GetCostos(filtro).then((result) => {
      setListaCosto(result);
    });
  };

  const ModalVisible = (flag: boolean, id?: string | undefined) => {
    if (!flag) {
      setCosto(undefined);
      setOpen(flag);
    }
    if (id == undefined) {
      setCosto(undefined);
      setOpen(flag);
    } else {
      GetCostoById(id).then((result) => {
        setCosto(result);
        setOpen(flag);
      });
    }
  };

  const SaveDate = (fecha: Date | undefined) => {
    setDate(fecha);
  };

  const columns: ColumnDef<Costo>[] = [
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
      accessorKey: "Costo",
      header: "Costo",
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const costo = row.original;
        return (
          <div className="grid grid-cols-2 gap-3 w-52">
            <Edit2Icon
              className="text-teal-600"
              onClick={() => {
                ModalVisible(true, costo.Id);
              }}
            />
            <Trash2Icon
              className="text-teal-600"
              onClick={() => {
                alert(costo.Id);
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
        <FiltrosCosto Buscar={Buscar} />
      </div>
      <div className="w-full">
        <TablaCosto columns={columns} data={listaCosto} />
      </div>
      <MantenedorCosto
        open={open}
        setOpen={ModalVisible}
        setDate={SaveDate}
        date={date}
        costo={costo}
      />
    </main>
  );
}
