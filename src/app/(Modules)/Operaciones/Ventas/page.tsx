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
import { RegistroVenta } from "@/domain/DTOs/Ventas/RegistroVenta";
import { Input } from "@/components/ui/input";

import ModalProductos from "./Components/ModalProductos";
import ModalClientes from "./Components/ModalClientes";
import { Producto } from "@/domain/Models/Productos/Producto";
import { Cliente } from "@/domain/Models/Clientes/Cliente";
import { AlertaAceptarCancelar } from "@/app/global/Components/Alertas.Confirmacion";
import { InsertaOperacionVenta } from "@/domain/Services/VentaService";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { useCodPantallaStore } from "@/app/global/Store/CodPantalla.store";

export default function OperacionVentaPage() {
  const [modalProductos, setModalProductos] = React.useState<boolean>(false);
  const [modalClientes, setModalClientes] = React.useState<boolean>(false);
  const [confirmacionTotalizar, setConfirmacionTotalizar] =
    React.useState<boolean>(false);
  const [cliente, setCliente] = React.useState<Cliente>();
  const [data, setData] = React.useState<RegistroVenta[]>([]);
  const [ultimaOperacion, setUltimaOperacion] = React.useState<string>();

  const { RegistraCodPantalla } = useCodPantallaStore();

  useEffect(() => {
    RegistraCodPantalla({
      Codigo: "",
      Version: "V 0.1",
      Titulo: "Operacion de venta",
    });
  }, []);

  const Totalizar = async () => {
    const mensaje = [];
    if (data.length == 0) {
      mensaje.push("Seleccione productos");
    }
    if (!cliente) {
      mensaje.push("Seleccione cliente");
    } else {
      if (!cliente.Nombre) {
        mensaje.push("Seleccione cliente");
      }
    }

    if (mensaje.length > 0) {
      toast("Error", {
        description: mensaje.join(", ")
      });
      return;
    } else {
      setUltimaOperacion(await InsertaOperacionVenta(data, cliente!));
      Limpiar();
    }

    ConfirmaTotalizarVisible(false);
  };

  const Limpiar = () => {
    setCliente({
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

  const ModalClientesVisible = (flag: boolean) => {
    setModalClientes(flag);
  };

  const SeleccionaCliente = (item: Cliente) => {
    setCliente(item);
  };

  const OrdenaPosicion = (lista: RegistroVenta[]) => {
    const nuevaLista = lista.map((item, i) => ({
      ...item,
      Posicion: i,
    }));
    setData(nuevaLista);
  };

  const AgregarItemVenta = (item: Producto) => {
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

  const EliminarItemVenta = (posicion: number) => {
    const lista = [...data];
    const nlista: RegistroVenta[] = lista.filter(
      (item) => item.Posicion !== posicion
    );

    OrdenaPosicion(nlista);
  };

  const GetTotalVenta = () => {
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

  const ActualizaItemVenta = (
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
    const nlista: RegistroVenta[] = lista.filter((item) => item.Posicion >= 0);
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
              cliente ? `${cliente?.Identificacion} - ${cliente?.Nombre}` : ""
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
                ModalClientesVisible(true);
              }}
            >
              <PlusIcon className="mr-2" />
              Seleccionar Cliente
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
            {data.map((itemVenta) => (
              <TableRow className="even:bg-zinc-50 odd:bg-white" key={itemVenta.Posicion}>
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
                    max={itemVenta.Existencia}
                    value={itemVenta.Cantidad}
                    onChange={(e) => {
                      ActualizaItemVenta(
                        itemVenta.Posicion,
                        Number(e.target.value),
                        Number(itemVenta.Existencia)
                      );
                    }}
                    onBlur={(e) => {
                      ActualizaItemVenta(
                        itemVenta.Posicion,
                        Number(e.target.value),
                        Number(itemVenta.Existencia)
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
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-center">
                {GetTotalArticulos()}
              </TableCell>
              <TableCell></TableCell>
              <TableCell className="text-center">{GetTotalVenta()}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {modalProductos ? (
        <ModalProductos
          setOpen={ModalProductosVisible}
          agregaItemSeleccionado={AgregarItemVenta}
        />
      ) : (
        <></>
      )}
      {modalClientes ? (
        <ModalClientes
          setOpen={ModalClientesVisible}
          ItemSeleccionado={SeleccionaCliente}
        />
      ) : (
        <></>
      )}

      <AlertaAceptarCancelar
        Titulo="Totalizar"
        Mensaje="Confirme para guardar la operacion de venta"
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
