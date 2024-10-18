"use client";

import { Button } from "@/components/ui/button";
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
import { DetalleCompra } from "@/domain/DTOs/Compras/DetalleCompra";
import { RegistroCompra } from "@/domain/DTOs/Compras/RegistroCompra";
import { GeneraDevolucion, RetornaDetalleCompra } from "@/domain/Services/CompraService";


import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

type DetalleCompraProps = {
  setOpen: (flag?: boolean) => void;
  ItemSeleccionado?: DetalleCompra;
};

export default function ModalDetalleCompra(props: Readonly<DetalleCompraProps>) {
  const [data, setData] = useState<RegistroCompra[]>([]);

  useEffect(() => {
    ObtieneDetalleCompra();
  }, []);

  const ObtieneDetalleCompra = async () => {
    setData(await RetornaDetalleCompra(props.ItemSeleccionado!));
  };

  const Devolucion = async () => {
    await GeneraDevolucion(props.ItemSeleccionado!, data);
    toast("Devolucion", {
      description: `Devolucion generada para compra ${props.ItemSeleccionado?.Id}`,
    });
    props.setOpen(false);
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
          <SheetTitle>Detalle Compra</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="grid items-center gap-4 px-2">
            <Button
              disabled={!(props.ItemSeleccionado?.Estado == "VIGENTE")}
              onClick={async () => {
                await Devolucion();
              }}
              type="button"
            >
              Devolver
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
                <TableHead>Cantidad</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {data.map((item) => (
                <TableRow  className="even:bg-zinc-50 odd:bg-white" key={item.Posicion}>
                  <TableCell>{item.ProductoId}</TableCell>
                  <TableCell>{item.ProductoDsc}</TableCell>
                  <TableCell>{item.Cantidad}</TableCell>
                  <TableCell>{item.Costo}</TableCell>
                  <TableCell>{item.Precio}</TableCell>
                  <TableCell>{item.Total}</TableCell>
                </TableRow>
              ))}
              <TableRow key={"item.Codigo"}>
                <TableCell colSpan={6}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SheetContent>
      <Toaster />
    </Sheet>
  );
}
