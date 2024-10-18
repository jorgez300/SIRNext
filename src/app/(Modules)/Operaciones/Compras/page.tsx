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
import { PlusIcon, Trash, Trash2Icon } from "lucide-react";

import React, { useEffect } from "react";

import { Input } from "@/components/ui/input";

import { Producto } from "@/domain/Models/Productos/Producto";

import { AlertaAceptarCancelar } from "@/app/global/Components/Alertas.Confirmacion";

import ModalProveedor from "./Components/ModalProveedores";
import { Proveedor } from "@/domain/Models/Proveedores/Proveedor";
import { RegistroCompra } from "@/domain/DTOs/Compras/RegistroCompra";
import { InsertaOperacionCompra } from "@/domain/Services/CompraService";
import ModalProductos from "./Components/ModalProductos";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { useCodPantallaStore } from "@/app/global/Store/CodPantalla.store";

export default function OperacionCompraPage() {
  const [modalProductos, setModalProductos] = React.useState<boolean>(false);
  const [modalProveedor, setModalProveedor] = React.useState<boolean>(false);
  const [confirmacionTotalizar, setConfirmacionTotalizar] =
    React.useState<boolean>(false);
  const [proveedor, setProveedor] = React.useState<Proveedor>();
  const [data, setData] = React.useState<RegistroCompra[]>([]);
  const [ultimaOperacion, setUltimaOperacion] = React.useState<string>();

  const { RegistraCodPantalla } = useCodPantallaStore();

  useEffect(() => {
    RegistraCodPantalla({
      Codigo: "",
      Version: "V 0.1",
      Titulo: "Operacion de compra",
    });
  }, []);

  const Totalizar = async () => {
    const mensaje = [];
    if (data.length == 0) {
      mensaje.push("Seleccione productos");
    }
    if (!proveedor) {
      mensaje.push("Seleccione Proveedor");
    } else {
      if (!proveedor.Nombre) {
        mensaje.push("Seleccione Proveedor");
      }
    }

    if (mensaje.length > 0) {
      toast("Error", {
        description: mensaje.join(", "),
      });
      return;
    } else {
      setUltimaOperacion(await InsertaOperacionCompra(data, proveedor!));
      Limpiar();
    }

    ConfirmaTotalizarVisible(false);
  };

  const Limpiar = () => {
    setProveedor({
      Identificacion: "",
      Nombre: "",
    });
    setData([]);
  };

  const ConfirmaTotalizarVisible = async (flag: boolean) => {
    setConfirmacionTotalizar(flag);
  };

  const ModalProductosVisible = (flag: boolean) => {
    setModalProductos(flag);
  };

  const ModalProveedorVisible = (flag: boolean) => {
    setModalProveedor(flag);
  };

  const SeleccionaProveedor = (item: Proveedor) => {
    setProveedor(item);
  };

  const OrdenaPosicion = (lista: RegistroCompra[]) => {
    const nuevaLista = lista.map((item, i) => ({
      ...item,
      Posicion: i,
    }));
    setData(nuevaLista);
  };

  const AgregarItemCompra = (item: Producto) => {
    const lista = [...data];

    lista.push({
      Posicion: 0,
      ProductoId: item.Codigo,
      ProductoDsc: item.Descripcion,
      Cantidad: 1,
      Existencia: item.Existencia,
      Costo: item.Costo,
      Precio: item.Precio,
      Total: item.Precio,
    });

    OrdenaPosicion(lista);
  };

  const EliminarItemCompra = (posicion: number) => {
    const lista = [...data];
    const nlista: RegistroCompra[] = lista.filter(
      (item) => item.Posicion !== posicion
    );

    OrdenaPosicion(nlista);
  };

  const GetTotalCompra = () => {
    const lista = [...data];
    let Total: number = 0;

    lista.forEach((item) => {
      Total = Total + Number(item.Total);
    });

    return Total;
  };

  const GetTotalArticulos = () => {
    const lista = [...data];
    let Total: number = 0;

    lista.forEach((item) => {
      Total = Total + Number(item.Cantidad);
    });

    return Total;
  };

  const ActualizaItemCompra = (
    posicion: number,
    cantidad: number,
    existencia: number
  ) => {
    if (cantidad > existencia) {
      cantidad = existencia;
    }

    if (cantidad < 0) {
      cantidad = 1;
    }

    const lista = data;
    const nlista: RegistroCompra[] = lista.filter((item) => item.Posicion >= 0);
    nlista[posicion].Cantidad = cantidad;
    nlista[posicion].Total =
      nlista[posicion].Precio * nlista[posicion].Cantidad;

    OrdenaPosicion(nlista);
  };

  return (
    <main className="grid grid-cols-1 gap-4 p-4">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            readOnly
            value={
              proveedor
                ? `${proveedor?.Identificacion} - ${proveedor?.Nombre}`
                : ""
            }
          />
        </div>
        <div>
          <div className="flex flex-row  gap-4 justify-end">
            <Button
              className="bg-teal-600 ml-2"
              onClick={() => {
                ModalProductosVisible(true);
              }}
            >
              <PlusIcon className="mr-2" />
              Agregar Productos
            </Button>
            <Button
              className="bg-teal-600 ml-2"
              onClick={() => {
                ModalProveedorVisible(true);
              }}
            >
              <PlusIcon className="mr-2" />
              Seleccionar Proveedor
            </Button>
            <Button
              className="bg-teal-600 ml-2"
              onClick={() => {
                ConfirmaTotalizarVisible(true);
              }}
            >
              <PlusIcon className="mr-2" />
              Guardar
            </Button>
            <Button
              variant="destructive"
              className="ml-2"
              onClick={() => {
                Limpiar();
              }}
            >
              <Trash className="mr-2" />
              Limpiar
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        {ultimaOperacion ? (
          <Label>Ultima Operacion: {ultimaOperacion}</Label>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Acciones</TableHead>
              <TableHead className="w-[300px]">Codigo</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead className="w-[100px] text-center">Cantidad</TableHead>
              <TableHead className="w-[100px] text-center">Precio</TableHead>
              <TableHead className="w-[100px] text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((itemCompra) => (
              <TableRow
                className="even:bg-zinc-50 odd:bg-white"
                key={itemCompra.Posicion}
              >
                <TableCell>
                  <Trash2Icon
                    className="text-teal-600"
                    onClick={() => {
                      EliminarItemCompra(itemCompra.Posicion);
                    }}
                  />
                </TableCell>
                <TableCell>{itemCompra.ProductoId}</TableCell>
                <TableCell>{itemCompra.ProductoDsc}</TableCell>
                <TableCell>
                  <Input
                    maxLength={3}
                    type="number"
                    className="w-full"
                    max={itemCompra.Existencia}
                    value={itemCompra.Cantidad}
                    onChange={(e) => {
                      ActualizaItemCompra(
                        itemCompra.Posicion,
                        Number(e.target.value),
                        Number(itemCompra.Existencia)
                      );
                    }}
                    onBlur={(e) => {
                      ActualizaItemCompra(
                        itemCompra.Posicion,
                        Number(e.target.value),
                        Number(itemCompra.Existencia)
                      );
                    }}
                  ></Input>
                </TableCell>
                <TableCell className="text-center">
                  {itemCompra.Precio}
                </TableCell>
                <TableCell className="text-center">
                  {itemCompra.Total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-center">
                {GetTotalArticulos()}
              </TableCell>
              <TableCell></TableCell>
              <TableCell className="text-center">{GetTotalCompra()}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {modalProductos ? (
        <ModalProductos
          setOpen={ModalProductosVisible}
          agregaItemSeleccionado={AgregarItemCompra}
        />
      ) : (
        <></>
      )}
      {modalProveedor ? (
        <ModalProveedor
          setOpen={ModalProveedorVisible}
          ItemSeleccionado={SeleccionaProveedor}
        />
      ) : (
        <></>
      )}

      <AlertaAceptarCancelar
        Titulo="Totalizar"
        Mensaje="Confirme para guardar la operacion de Compra"
        Tipo="Ok"
        TextoAceptar="Totalizar"
        TextoCancelar="Seguir operacion"
        AccionAceptar={() => {
          Totalizar();
        }}
        AccionCancelar={() => {
          ConfirmaTotalizarVisible(false);
        }}
        setOpen={ConfirmaTotalizarVisible}
        open={confirmacionTotalizar}
      />
      <Toaster />
    </main>
  );
}
