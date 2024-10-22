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
    }

    if (mensaje.length > 0) {
      toast("Error", {
        description: mensaje.join(", "),
      });
      ConfirmaTotalizarVisible(false);
      return;
    } else if (RegistrosInvalidos()) {
      ConfirmaTotalizarVisible(false);
      return;
    } else {
      setUltimaOperacion(await InsertaOperacionCompra(data, proveedor!));
      Limpiar();
    }

    ConfirmaTotalizarVisible(false);
  };

  const RegistrosInvalidos = () => {
    let lista = [];

    lista = data.filter(
      (itemCompra) =>
        isNaN(itemCompra.Cantidad) ||
        isNaN(Number(itemCompra.Costo)) ||
        isNaN(Number(itemCompra.Precio))
    );

    if (lista.length > 0) {
      lista.forEach((itemCompra) => {
        toast("Error", {
          description: `Valide cantidad, costo y precio del producto: ${itemCompra.ProductoId}`,
        });
      });
      return true;
    }

    lista = data.filter(
      (itemCompra) =>
        itemCompra.Cantidad <= 0 ||
        Number(itemCompra.Costo) <= 0 ||
        Number(itemCompra.Precio) <= 0
    );

    if (lista.length > 0) {
      lista.forEach((itemCompra) => {
        toast("Error", {
          description: `Valide cantidad, costo y precio del producto: ${itemCompra.ProductoId}`,
        });
      });
      return true;
    }

    lista = data.filter((itemCompra) => Number(itemCompra.Costo) >= Number(itemCompra.Precio));
    if (lista.length > 0) {
      lista.forEach((itemCompra) => {
        toast("Error", {
          description: `Costo mayor que el precio del producto: ${itemCompra.ProductoId}`,
        });
      });
      return true;
    }

    return false;
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

    if (!lista.find((x) => x.ProductoId === item.Codigo)) {
      lista.push({
        Posicion: 0,
        ProductoId: item.Codigo,
        ProductoDsc: item.Descripcion,
        Cantidad: 1,
        Existencia: item.Existencia,
        Costo: 0,
        Precio: 0,
        Total: 0,
      });
    } else {
      toast("Error", {
        description: "Producto ya ingresado",
      });
    }

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

  const ActualizaCantidadItemCompra = (
    posicion: number,
    cantidad: number
  ) => {

    if (cantidad < 0) {
      cantidad = 1;
    }

    const lista = data;
    const nlista: RegistroCompra[] = lista.filter((item) => item.Posicion >= 0);
    nlista[posicion].Cantidad = cantidad;
    nlista[posicion].Total =
      Number(nlista[posicion].Costo) * nlista[posicion].Cantidad;

    OrdenaPosicion(nlista);
  };

  const ActualizaCostoItemCompra = (
    posicion: number,
    costo: number | string
  ) => {
    const lista = data;
    const nlista: RegistroCompra[] = lista.filter((item) => item.Posicion >= 0);
    nlista[posicion].Costo = costo;
    nlista[posicion].Total =
      Number(nlista[posicion].Costo) * nlista[posicion].Cantidad;

    OrdenaPosicion(nlista);
  };

  const ActualizaPrecioItemCompra = (
    posicion: number,
    precio: number | string
  ) => {
    const lista = data;
    const nlista: RegistroCompra[] = lista.filter((item) => item.Posicion >= 0);
    nlista[posicion].Precio = precio;

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
              className="btnAzul ml-2"
              onClick={() => {
                ModalProveedorVisible(true);
              }}
            >
              <PlusIcon className="mr-2" />
              Seleccionar Proveedor
            </Button>

            <Button
              className="btnAzul ml-2"
              onClick={() => {
                ModalProductosVisible(true);
              }}
            >
              <PlusIcon className="mr-2" />
              Agregar Productos
            </Button>

            <Button
              className="btnTeal ml-2"
              onClick={() => {
                ConfirmaTotalizarVisible(true);
              }}
            >
              <PlusIcon className="mr-2" />
              Guardar
            </Button>
            <Button
              className="btnRojo ml-2"
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
              <TableHead className="w-[100px] text-center">
                Existencia
              </TableHead>
              <TableHead className="w-[100px] text-center">Cantidad</TableHead>
              <TableHead className="w-[200px] text-center">Costo</TableHead>
              <TableHead className="w-[200px] text-center">Precio</TableHead>
              <TableHead className="w-[100px] text-center">
                Costo Total
              </TableHead>
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
                <TableCell>{itemCompra.Existencia}</TableCell>
                <TableCell>
                  <Input
                    maxLength={3}
                    type="number"
                    className="w-full"
                    max={itemCompra.Existencia}
                    value={Number(itemCompra.Cantidad)}
                    onChange={(e) => {
                      ActualizaCantidadItemCompra(
                        itemCompra.Posicion,
                        Number(e.target.value)
                      );
                    }}

                  ></Input>
                </TableCell>
                <TableCell>
                  <Input
                    maxLength={10}
                    type="text"
                    className="w-full"
                    lang="en"
                    value={itemCompra.Costo == 0 ? "" : itemCompra.Costo}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        ActualizaCostoItemCompra(
                          itemCompra.Posicion,
                          e.target.value
                        );
                      }
                    }}
                  ></Input>
                </TableCell>
                <TableCell>
                  <Input
                    maxLength={10}
                    type="text"
                    className="w-full"
                    lang="en"
                    value={itemCompra.Precio == 0 ? "" : itemCompra.Precio}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        ActualizaPrecioItemCompra(
                          itemCompra.Posicion,
                          e.target.value
                        );
                      }
                    }}
                  ></Input>
                </TableCell>
                <TableCell className="text-center">
                  {itemCompra.Total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-center">
                {GetTotalArticulos()}
              </TableCell>
              <TableCell colSpan={2}></TableCell>
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
