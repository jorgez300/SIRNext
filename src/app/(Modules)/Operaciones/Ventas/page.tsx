"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, Trash2Icon } from "lucide-react";

import React from "react";
import { RegistroVenta } from "@/domain/DTOs/Ventas/RegistroVenta";
import { Input } from "@/components/ui/input";

export default function OperacionVentaPage() {
  const [data, setData] = React.useState<RegistroVenta[]>([]);

  const OrdenaPosicion = (lista: RegistroVenta[]) => {
    const nuevaLista = lista.map((item, i) => ({
      ...item,
      Posicion: i,
    }));
    setData(nuevaLista);
    console.log(data);
  };

  const AgregarItemVenta = () => {
    const lista = data;

    lista.push({
      Posicion: 0,
      ProductoId: "Producto_1",
      ProductoDsc: "Producto_1",
      Cantidad: 1,
      Costo: 10.5,
      Precio: 12,
      Total: 12,
    });

    OrdenaPosicion(lista);
  };

  const EliminarItemVenta = (posicion: number) => {
    const lista = data;
    const nlista: RegistroVenta[] = lista.filter(
      (item) => item.Posicion !== posicion
    );

    OrdenaPosicion(nlista);
  };

  const ActualizaItemVenta = (posicion: number, cantidad: number) => {
    const lista = data;
    const nlista: RegistroVenta[] = lista.filter((item) => item.Posicion >= 0);
    console.log(nlista);
    nlista[posicion].Cantidad = cantidad;
    nlista[posicion].Total =
      nlista[posicion].Precio * nlista[posicion].Cantidad;

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Acciones</TableHead>
              <TableHead className="w-[300px]">ProductoId</TableHead>
              <TableHead>ProductoDsc</TableHead>
              <TableHead className="w-[100px] text-center">Cantidad</TableHead>
              <TableHead className="w-[100px] text-center">Precio</TableHead>
              <TableHead className="w-[100px] text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((itemVenta) => (
              <TableRow key={itemVenta.Posicion}>
                <TableCell>
                  <Trash2Icon
                    className="text-teal-600"
                    onClick={() => {
                      EliminarItemVenta(itemVenta.Posicion);
                    }}
                  />
                </TableCell>
                <TableCell>{itemVenta.ProductoId}</TableCell>
                <TableCell>{itemVenta.ProductoDsc}</TableCell>
                <TableCell>
                  <Input
                    maxLength={3}
                    type="number"
                    className="w-full"
                    value={itemVenta.Cantidad}
                    onChange={(e) => {
                      ActualizaItemVenta(
                        itemVenta.Posicion,
                        Number(e.target.value)
                      );
                    }}
                    onBlur={(e) => {
                      ActualizaItemVenta(
                        itemVenta.Posicion,
                        Number(e.target.value)
                      );
                    }}
                  ></Input>
                </TableCell>
                <TableCell className="text-center">
                  {itemVenta.Precio}
                </TableCell>
                <TableCell className="text-center">{itemVenta.Total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-center">
                {data.reduce((acumulador, producto) => {
                  return acumulador + producto.Total;
                }, 0)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  );
}
