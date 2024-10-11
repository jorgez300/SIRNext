"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, PlusIcon, Edit2Icon, Camera } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { FiltroProducto } from "@/domain/DTOs/Productos/FiltroProducto";
import { Producto } from "@/domain/Models/Productos/Producto";
import { GetProductos } from "@/domain/Services/ProductoService";

import { ModelosPorMarca } from "@/domain/DTOs/Vehiculos/ModelosPorMarca.Dto";
import { GetModelosPorMarca } from "@/domain/Services/VehiculoService";
import FiltrosProducto from "./Components/Filtros";
import { TablaProducto } from "./Components/Tabla";
import { useRouter } from "next/navigation";
import { EscanerProducto } from "@/app/global/Components/Camara";
import { useAdministraProductoStore } from "../Store/AdmistraProducto.store";

export default function ProductoPage() {
  const [listaModelosPorMarca, setListaModelosPorMarca] = useState<
    ModelosPorMarca[]
  >([]);
  const [listaProducto, setListaProducto] = useState<Producto[]>([]);

  const [camaraActiva, setCamaraActiva] = useState<boolean>(false);
  const [decodedText, setDecodedText] = useState<string>();

  const { RegistraCodigo, ResetCodigo } = useAdministraProductoStore();

  const router = useRouter();

  useEffect(() => {
    ResetCodigo();
    Buscar();
    Listas();
  }, []);

  const Buscar = async (filtro?: FiltroProducto) => {
    setListaProducto(await GetProductos(filtro))
  };

  const Listas = async () => {
    setListaModelosPorMarca(await GetModelosPorMarca());
  };

  const Administrar = (id?: string) => {
    RegistraCodigo(id);
    router.push(`/Mantenedores/Productos/Administrar`);
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
      accessorKey: "MarcaProd",
      header: "Marca producto",
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
                Administrar(item.Codigo);
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
            className="bg-teal-600 ml-2"
            onClick={() => {
              Administrar();
            }}
          >
            <PlusIcon className="mr-2" />
            Agregar
          </Button>
          <Button
            className="bg-teal-600 ml-2"
            onClick={() => {
              setCamaraActiva(true);
              setDecodedText("");
            }}
          >
            <Camera className="mr-2" />
            Camara
          </Button>
        </div>

        <div>
          <FiltrosProducto
            decodedText={decodedText}
            Buscar={Buscar}
            listaModelosPorMarca={listaModelosPorMarca}
          />
        </div>
        <div className="w-full">
          <TablaProducto columns={columns} data={listaProducto} />
        </div>
        <EscanerProducto
          camaraActiva={camaraActiva}
          setCamaraActiva={setCamaraActiva}
          decodedText={decodedText}
          setDecodedText={setDecodedText}
        />
      </main>
    </Suspense>
  );
}
