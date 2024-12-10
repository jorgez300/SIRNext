"use client";
import { Button } from "@/components/ui/button";

import { ArrowUpDown, PlusIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EliminaCosto, GetCostoById, GetCostos } from "@/domain/Services/CostoService";
import { FiltroCosto } from "@/domain/DTOs/Costos/FiltroCosto";
import { Costo } from "@/domain/Models/Costos/Costo";
import FiltrosCosto from "./Components/Filtros";
import MantenedorCosto from "./Components/Mantenedor";
import { TablaCosto } from "./Components/Tabla";
import { useCodPantallaStore } from "@/app/global/Store/CodPantalla.store";
import { useAdministraCostoStore } from "./Store/AdministraCosto.store";
import { AlertaAceptarCancelar } from "@/app/global/Components/Alertas.Confirmacion";

export default function CostoPage() {
  const [open, setOpen] = useState(false);
  const [listaCosto, setListaCosto] = useState<Costo[]>([]);
  const [costo, setCosto] = useState<Costo>();
  const { RegistraCosto, ResetCosto } = useAdministraCostoStore();
  const { RegistraCodPantalla } = useCodPantallaStore();
  const [confirmacion, setConfirmacion] = useState(false);

  useEffect(() => {
    RegistraCodPantalla({
      Codigo: "",
      Version: "V 1.0",
      Titulo: "Administrar Costos",
    });
    Buscar();
    ResetCosto();
  }, []);

  const Buscar = async (filtro?: FiltroCosto) => {
    setListaCosto(await GetCostos(filtro));
  };

  const ModalVisible = async (flag: boolean, id?: string | undefined) => {

    if (!flag) {
      await RegistraCosto(undefined);
      await Buscar();
      setOpen(flag);
    } else if (!id) {
      await RegistraCosto(undefined);
      setOpen(flag);
    } else {
      await RegistraCosto(await GetCostoById(id));
      setOpen(flag);
    }
  };

  const ConfirmacionVisible = (flag: boolean) => {
    setConfirmacion(flag);
  };

  const ConfirmacionAceptar = () => {
    EliminaCosto(costo!.Id!);
    setConfirmacion(false);
    setCosto(undefined);
    Buscar();
  };

  const ConfirmacionCancelar = () => {
    setConfirmacion(false);
    setCosto(undefined);
  };

  const columns: ColumnDef<Costo>[] = [
    {
      accessorKey: "Codigo",
      id: "Codigo",
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
      size: 900,
      id: "Descripcion",
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
      accessorKey: "Tipo",
      id: "Tipo",
      header: "Tipo",
    },
    {
      accessorKey: "Costo",
      id: "Costo",
      header: "Costo",
    },
    {
      accessorKey: "Fecha",
      id: "Fecha",
      header: "Fecha Registrado",
    },
    {
      header: "Acciones",
      size: 100,
      id: "Acciones",
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
                setCosto(costo);
                ConfirmacionVisible(true);
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
      {open ? <MantenedorCosto setOpen={ModalVisible} /> : <></>}
      <AlertaAceptarCancelar
        Titulo="Confirmacion"
        Mensaje={`Confirme que desea eliminar el costo: ${costo?.Codigo}`}
        Tipo="Confirmacion"
        AccionAceptar={ConfirmacionAceptar}
        AccionCancelar={ConfirmacionCancelar}
        open={confirmacion}
        setOpen={ConfirmacionVisible}
      />
    </main>
  );
}
