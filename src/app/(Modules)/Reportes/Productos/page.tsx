"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Producto } from "@/domain/Models/Productos/Producto";
import { GetReporteProductos } from "@/domain/Services/ProductoService";

import { useCodPantallaStore } from "@/app/global/Store/CodPantalla.store";
import { TablaReporteProducto } from "./Components/Tabla";
import FiltroReporteProductos from "./Components/Filtros";
import { FiltroReporteProducto } from "@/domain/DTOs/Productos/FiltroReporteProducto";

export default function ReporteProductoProductoPage() {
  const [listaProducto, setListaProducto] = useState<Producto[]>([]);

  const { RegistraCodPantalla } = useCodPantallaStore();

  useEffect(() => {
    RegistraCodPantalla({
      Codigo: "",
      Version: "V 0.1",
      Titulo: "Reporte de productos",
    });
  }, []);

  const Buscar = async (filtro?: FiltroReporteProducto) => {
    setListaProducto(await GetReporteProductos(filtro));
  };

  const columns: ColumnDef<Producto>[] = [
    {
      accessorKey: "Codigo",
      size: 200,
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
      size: 100,
      header: "Existencia",
    },
    {
      accessorKey: "Minimo",
      size: 100,
      header: "Minimo",
    },
    {
      accessorKey: "Maximo",
      size: 100,
      header: "Maximo",
    },
    {
      accessorKey: "MarcaProd",
      size: 300,
      header: "Marca producto",
    },
    {
      accessorKey: "Costo",
      size: 100,
      header: "Costo",
    },
    {
      accessorKey: "Precio",
      size: 100,
      header: "Precio",
    },
  ];

  return (
    <Suspense>
      <main className="grid grid-cols-1 gap-3 p-4">
        <div>
          <FiltroReporteProductos Buscar={Buscar} />
        </div>
        <div className="w-full">
          <TablaReporteProducto columns={columns} data={listaProducto} />
        </div>
      </main>
    </Suspense>
  );
}
