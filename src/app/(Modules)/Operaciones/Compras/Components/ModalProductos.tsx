"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiltroProducto } from "@/domain/DTOs/Productos/FiltroProducto";
import { Producto } from "@/domain/Models/Productos/Producto";
import { GetProductosOperacion } from "@/domain/Services/ProductoService";
import { useState } from "react";

type ModalProductosProps = {
  setOpen: (date: boolean) => void;
  agregaItemSeleccionado: (item: Producto) => void;
};

export default function ModalProductos(props: Readonly<ModalProductosProps>) {
  const [data, setData] = useState<Producto[]>([]);
  const [buscar, setBuscar] = useState<string>("");

  const Buscar = async () => {
    if (buscar.length >= 3) {
      const filtro: FiltroProducto = {
        Codigo: buscar,
        Descripcion: buscar,
        MarcaProd: buscar,
        ConExistencia: true,
      };
      setData(await GetProductosOperacion(filtro));
    } else {
      alert("Minimo de 3 caracteres para busqueda");
    }
  };

  return (
    <Sheet defaultOpen={true} onOpenChange={props.setOpen}>
      <SheetContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
        style={{ maxWidth: "50vw" }}
      >
        <SheetHeader>
          <SheetTitle>Buscar productos</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="grid col-span-2 items-center gap-4 px-2">
            <Label htmlFor="Buscar">Buscar</Label>
            <Input
              id="Buscar"
              className="w-full"
              maxLength={30}
              onChange={(e) => {
                setBuscar(e.target.value);
              }}
            />
          </div>
          <div className="grid items-center gap-4 px-2">
            <Button
              onClick={async () => {
                await Buscar();
              }}
              type="button"
            >
              Buscar
            </Button>
          </div>
          <div className="grid items-center gap-4 px-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                props.setOpen(false);
              }}
            >
              Cerrar
            </Button>
          </div>
        </div>
        <div className="col-span-2 items-center h-full overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead className="w-[50px] text-center">
                  Existencia
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {data.map((item) => (
                <TableRow
                  key={item.Codigo}
                  className="even:bg-zinc-50 odd:bg-white"
                  onClick={() => {
                    props.agregaItemSeleccionado(item);
                  }}
                >
                  <TableCell className="w-[100px] text-center">
                    {item.Codigo}
                  </TableCell>
                  <TableCell>{item.Descripcion}</TableCell>
                  <TableCell className="w-[50px] text-center">
                    {item.Existencia}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow key={"item.Codigo"}>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
