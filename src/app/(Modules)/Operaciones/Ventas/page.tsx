"use client";
import { Button } from "@/components/ui/button";
import { ItemVenta } from "@/domain/Models/Ventas/ItemVenta";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import { PlusIcon, Trash2Icon } from "lucide-react";
import React from "react";
import { TablaItemsVenta } from "./Components/Tabla";
import {CeldaNumerica, CeldaDecimal} from "@/app/global/Components/Tabla.CeldaEditable";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData?: (
      rowIndex: number,
      columnId: string,
      value: string,
      x?: TData
    ) => void;
  }
}

export default function OperacionVentaPage() {
  const [data, setData] = React.useState<ItemVenta[]>([]);

  const columns: ColumnDef<ItemVenta>[] = [
    {
      accessorKey: "Posicion",
      header: "Posicion",
    },
    {
      accessorKey: "InventarioId",
      header: "InventarioId",
    },
    {
      accessorKey: "Cantidad",
      cell: ({ row, column, getValue, table }) => {
        return (
          <CeldaNumerica
            row={row}
            columnId={column.id}
            value={getValue<string>()}
            updateData={table.options.meta!.updateData}
          />
        );
      },
    },
    {
      accessorKey: "Precio",
      cell: ({ row, column, getValue, table }) => {
        return (
          <CeldaDecimal
            row={row}
            columnId={column.id}
            value={getValue<string>()}
            updateData={table.options.meta!.updateData}
          />
        );
      },
    },
    {
      accessorKey: "Total",
      cell: ({ row, column, getValue, table }) => {
        return (
          <CeldaDecimal
            row={row}
            columnId={column.id}
            value={getValue<string>()}
            updateData={table.options.meta!.updateData}
          />
        );
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const itemVenta = row.original;
        return (
          <div className="grid grid-cols-2 gap-3 w-52">
            <Trash2Icon
              className="text-teal-600"
              onClick={() => {
                EliminarItemVenta(itemVenta.Posicion);
              }}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });

  const OrdenaPosicion = (lista: ItemVenta[]) => {
    const nuevaLista = lista.map((item, i) => ({
      ...item, // Copiar las propiedades existentes
      Posicion: i, // Actualizar la propiedad 'nombre'
    }));
    setData(nuevaLista);
    console.log(data);
  };

  const AgregarItemVenta = () => {
    const lista = data;

    lista.push({
      VentaId: "1",
      InventarioId: "Producto_1",
      Cantidad: 1,
      Precio: 10.5,
      Posicion: 0,
    });

    OrdenaPosicion(lista);
  };

  const EliminarItemVenta = (posicion: number) => {
    const lista = data;
    const nlista: ItemVenta[] = lista.filter(
      (item) => item.Posicion !== posicion
    );

    OrdenaPosicion(nlista);
  };

  return (
    <main className="grid grid-cols-1 gap-3 p-4">
      <div className="flex flex-row justify-end">
        <Button
          className="bg-teal-600 ml-2"
          onClick={() => {
            AgregarItemVenta();
          }}
        >
          <PlusIcon className="mr-2" />
          Agregar
        </Button>
        <Button
          className="bg-teal-600 ml-2"
          onClick={() => {
            console.log(data);
          }}
        >
          <PlusIcon className="mr-2" />
          Guardar
        </Button>
      </div>
      <div className="w-full">
        <TablaItemsVenta columns={columns} table={table} />
      </div>
    </main>
  );
}
