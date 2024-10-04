"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, PlusIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { FiltroProducto } from "@/domain/DTOs/Productos/FiltroProducto";
import { ProductoCompleto } from "@/domain/DTOs/Productos/ProductoCompleto";
import { Producto } from "@/domain/Models/Productos/Producto";
import {
  GetProductoCompletoById,
  GetProductos,
} from "@/domain/Services/ProductoService";
import FiltrosProducto from "./Components/Filtros";
import MantenedorProducto from "./Components/Mantenedor";
import { TablaProducto } from "./Components/Tabla";
import { ModelosPorMarca } from "@/domain/DTOs/Vehiculos/ModelosPorMarca.Dto";
import { GetModelosPorMarca } from "@/domain/Services/VehiculoService";

export default function ProductoPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [listaModelosPorMarca, setListaModelosPorMarca] = useState<
    ModelosPorMarca[]
  >([]);
  const [listaProducto, setListaProducto] = useState<Producto[]>([]);
  const [producto, setProducto] = useState<ProductoCompleto | undefined>();

  useEffect(() => {
    Buscar();
    Listas();
  }, []);

  const Buscar = (filtro?: FiltroProducto) => {
    //setListaProducto(await GetProductos(filtro))
    GetProductos(filtro).then((result) => {
      setListaProducto(result);
    });
  };

  const Listas = async () => {
    setListaModelosPorMarca(await GetModelosPorMarca());
  };
  const ModalVisible = (flag: boolean, id?: string | undefined) => {
    if (!flag) {
      setProducto(undefined);
      setOpen(flag);
    }
    if (id == undefined) {
      setProducto(undefined);
      setOpen(flag);
    } else {
      GetProductoCompletoById(id).then((result) => {
        setProducto(result);
        setOpen(flag);
      });
    }
  };

  const SaveDate = (fecha: Date | undefined) => {
    setDate(fecha);
  };

  const columns: ColumnDef<Producto>[] = [
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
        const item = row.original;
        return (
          <div className="grid grid-cols-2 gap-3 w-52">
            <Edit2Icon
              className="text-teal-600"
              onClick={() => {
                ModalVisible(true, item.Id);
              }}
            />
            <Trash2Icon
              className="text-teal-600"
              onClick={() => {
                alert(item.Id);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Suspense>
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
          <FiltrosProducto Buscar={Buscar} />
        </div>
        <div className="w-full">
          <TablaProducto columns={columns} data={listaProducto} />
        </div>
        <MantenedorProducto
          open={open}
          setOpen={ModalVisible}
          setDate={SaveDate}
          date={date}
          producto={producto}
          listaModelosPorMarca={listaModelosPorMarca}
        />
      </main>
    </Suspense>
  );
}
