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

import { FiltroProveedor } from "@/domain/DTOs/Proveedores/FiltroProveedores";
import { Proveedor } from "@/domain/Models/Proveedores/Proveedor";

import { GetProveedoresOperacion } from "@/domain/Services/ProveedorService";
import { useState } from "react";
import { toast } from "sonner";

type ModalProveedorProps = {
  setOpen: (date: boolean) => void;
  ItemSeleccionado: (item: Proveedor) => void;
};

export default function ModalProveedor(props: Readonly<ModalProveedorProps>) {
  const [data, setData] = useState<Proveedor[]>([]);
  const [buscar, setBuscar] = useState<string>("");

  const Buscar = async () => {
    if (buscar.length >= 3) {
      const filtro: FiltroProveedor = {
        Nombre: buscar,
        Identificacion: buscar,
      };
      setData(await GetProveedoresOperacion(filtro));
    } else {
      toast("Error", {
        description: "Minimo de 3 caracteres para busqueda",
      });
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
          <SheetTitle>Buscar proveedor</SheetTitle>
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
                <TableHead>Identificacion</TableHead>
                <TableHead>Nombre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {data.map((item) => (
                <TableRow
                  key={item.Identificacion}
                  className="even:bg-zinc-50 odd:bg-white"
                  onClick={() => {
                    props.setOpen(false);
                    props.ItemSeleccionado(item);
                  }}
                >
                  <TableCell>{item.Identificacion}</TableCell>
                  <TableCell>{item.Nombre}</TableCell>
                </TableRow>
              ))}
              <TableRow key={"item.Identificacion"}>
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
