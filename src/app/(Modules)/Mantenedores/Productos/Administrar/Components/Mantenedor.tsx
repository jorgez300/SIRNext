"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { z } from "zod";
import { ProductoCompleto } from "@/domain/DTOs/Productos/ProductoCompleto";
import { Producto } from "@/domain/Models/Productos/Producto";
import { GuardaProducto } from "@/domain/Services/ProductoService";
import {
  MantenedorProductoSchema,
  MantenedorProductoDefault,
} from "../Schemas/MantenedorProducto.schema";
import { ModelosPorMarca } from "@/domain/DTOs/Vehiculos/ModelosPorMarca.Dto";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Vehiculo } from "@/domain/Models/Vehiculos/Vehiculo";
import { Textarea } from "@/components/ui/textarea";

import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
const qrcodeRegionId = "html5qr-code-full-region";

type MantenedorProductoProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  open: boolean;
  setOpen: (date: boolean) => void;
  producto?: ProductoCompleto;
  listaModelosPorMarca?: ModelosPorMarca[];
};

let DetenerCamara: () => void;

export default function MantenedorProducto(
  props: Readonly<MantenedorProductoProps>
) {
  const form = useForm<z.infer<typeof MantenedorProductoSchema>>({
    resolver: zodResolver(MantenedorProductoSchema),
    defaultValues: MantenedorProductoDefault,
  });

  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState<string>("");
  const [anioDesde, setAnioDesde] = useState<number>();
  const [anioHasta, setAnioHasta] = useState<number>();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  const onNewScanResult = (decodedTextR: string) => {
    form.setValue("Codigo", decodedTextR);
    DetenerCamara();
  };

  const InitCamera = (flag:boolean) => {
    if (flag) {
      const config: Html5QrcodeScannerConfig = {
        fps: 30,
        qrbox: { width: 800, height: 350 },
        aspectRatio: 1.777778,
        disableFlip: true,
      };

      const html5QrcodeScanner = new Html5QrcodeScanner(
        qrcodeRegionId,
        config,
        false
      );

      html5QrcodeScanner.render(onNewScanResult, () => {
        return;
      });

      DetenerCamara = () => {
        html5QrcodeScanner.clear().then(() => {
          //setCamaraActiva(false);
        });
      };

      return () => {
        html5QrcodeScanner.clear().catch((error) => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      };
    }
  };

  if (props.producto) {
    form.setValue("Codigo", props.producto.Item!.Codigo);
    form.setValue("Descripcion", props.producto.Item!.Descripcion);
    form.setValue("Existencia", props.producto.Item!.Existencia);
    form.setValue("Costo", props.producto.Item!.Costo);
    form.setValue("Precio", props.producto.Item!.Precio);
  }

  function FiltraModelos() {
    if (marcaSeleccionada == "") {
      return <SelectItem value="0">No hay opciones</SelectItem>;
    } else {
      const modelos: ModelosPorMarca[] | undefined =
        props.listaModelosPorMarca?.filter((item) => {
          return item.Brand == marcaSeleccionada;
        });

      return modelos![0].Models.map((item) => {
        return (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        );
      });
    }
  }

  function MuestraVehiculos() {
    return vehiculos.map((item) => (
      <div
        key={item.Brand + " - " + item.Model}
        className="flex gap-4 content-center my-1"
      >
        <Trash2Icon
          className="text-teal-600"
          onClick={() => {
            alert(item.Brand + " - " + item.Model);
            eliminaVehiculo(item.Brand, item.Model);
          }}
        />
        <Label className="mt-1">{`${item.Brand} - ${item.Model} (${
          item.YearStart ?? ""
        } - ${item.YearTo ?? ""})`}</Label>
      </div>
    ));
  }

  function handleClose() {
    form.reset();
    props.setOpen(false);
  }

  function handleSubmit() {
    form.trigger();
    if (form.formState.isValid) {
      const NewItem: Producto = {
        Id: props.producto ? props.producto.Item!.Id : undefined,
        Codigo: form.getValues("Codigo"),
        Descripcion: form.getValues("Descripcion"),
        Existencia: form.getValues("Existencia"),
        Costo: form.getValues("Costo"),
        Precio: form.getValues("Precio"),
      };
      GuardaProducto(NewItem);
      handleClose();
    }
  }

  function agregaVehiculo() {
    if (!marcaSeleccionada) {
      return;
    }
    if (!modeloSeleccionado) {
      return;
    }

    const lista = vehiculos.filter((item) => item.Brand != "");

    if (
      !lista.find(
        (x) => x.Brand === marcaSeleccionada && x.Model === modeloSeleccionado
      )
    ) {
      lista.push({
        Brand: marcaSeleccionada,
        Model: modeloSeleccionado,
        YearStart: anioDesde,
        YearTo: anioHasta ?? anioDesde,
      });

      setVehiculos(lista);
    }
  }

  function eliminaVehiculo(Brand: string, Model: string) {
    const lista = vehiculos.filter(
      (item) => item.Brand + item.Model != Brand + Model
    );

    setVehiculos(lista);
  }

  function limpiaVehiculos() {
    console.log(vehiculos);
    setVehiculos([]);
  }

  const ObtieneAniosValidos = (desde?: number): number[] => {
    const añoActual: number = new Date().getFullYear();
    let listaAños: number[] = [];
    if (desde) {
      const largo: number = new Date().getFullYear() - desde;
      listaAños = Array.from({ length: largo }, (_, i) => añoActual - i);
    } else {
      listaAños = Array.from({ length: 31 }, (_, i) => añoActual - i);
    }

    return listaAños;
  };

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        className="w-full max-w-6xl"
      >
        <DialogHeader>
          <DialogTitle>{props.producto ? "Editar" : "Nuevo"}</DialogTitle>
          <DialogDescription>Version</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-50 rounded-md border p-4">
          <div>
            <Form {...form}>
              <form
                action={async () => {
                  handleSubmit();
                }}
                className="grid grid-cols-4 gap-4"
              >
                <FormField
                  control={form.control}
                  name="Codigo"
                  render={({ field }) => (
                    <FormItem className="col-span-3 ">
                      <FormLabel>Codigo</FormLabel>
                      <FormControl>
                        <Input placeholder="Codigo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-1">
                  <Button
                    type="button"
                    onClick={() => {
                      InitCamera(true);
                    }}
                  >
                    Iniciar
                  </Button>
                </div>
                <div className="col-span-4">
                  <div id={qrcodeRegionId} />
                </div>
                <FormField
                  control={form.control}
                  name="Descripcion"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Descripcion</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripcion" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Existencia"
                  render={({ field }) => (
                    <FormItem className=" ">
                      <FormLabel>Existencia</FormLabel>
                      <FormControl>
                        <Input placeholder="Existencia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Costo"
                  render={({ field }) => (
                    <FormItem className=" ">
                      <FormLabel>Costo</FormLabel>
                      <FormControl>
                        <Input placeholder="Costo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Precio"
                  render={({ field }) => (
                    <FormItem className=" ">
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input placeholder="Precio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
              <Separator className="my-4" />

              <div className="grid grid-cols-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="Marca">Marca</Label>
                    <Select
                      onValueChange={(e) => {
                        console.log("e", e);
                        setMarcaSeleccionada(e);
                      }}
                    >
                      <SelectTrigger className="">
                        <SelectValue
                          id="Marca"
                          placeholder="Seleccione una marca"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Marcas</SelectLabel>
                          {props.listaModelosPorMarca?.map((item) => {
                            return (
                              <SelectItem key={item.Brand} value={item.Brand}>
                                {item.Brand}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Modelo">Modelo</Label>
                    <Select
                      onValueChange={(e) => {
                        console.log("e", e);
                        setModeloSeleccionado(e);
                      }}
                    >
                      <SelectTrigger className="">
                        <SelectValue
                          id="Modelo"
                          placeholder="Seleccione un modelo"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Modelo</SelectLabel>
                          {FiltraModelos()}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Desde">Desde</Label>
                    <Select
                      onValueChange={(e) => {
                        console.log("e", e);
                        setAnioDesde(Number.parseInt(e));
                      }}
                    >
                      <SelectTrigger className="">
                        <SelectValue id="Desde" placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Anio Inicio</SelectLabel>
                          {ObtieneAniosValidos().map((item) => {
                            return (
                              <SelectItem key={item} value={item.toString()}>
                                {item}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Hasta">Hasta</Label>
                    <Select
                      onValueChange={(e) => {
                        console.log("e", e);
                        setAnioHasta(Number.parseInt(e));
                      }}
                    >
                      <SelectTrigger className="">
                        <SelectValue id="Hasta" placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Anio Hasta</SelectLabel>
                          {ObtieneAniosValidos(anioDesde).map((item) => {
                            return (
                              <SelectItem key={item} value={item.toString()}>
                                {item}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-4">
                    <Button onClick={agregaVehiculo}>Agregar</Button>
                    <Button onClick={limpiaVehiculos}>Limpiar</Button>
                  </div>
                </div>
                <div className="px-4">
                  <ScrollArea className="h-36 w-full rounded-md border">
                    <div className="p-4">
                      <h4 className="mb-4 text-sm font-medium leading-none">
                        Vehiculos
                      </h4>
                      {MuestraVehiculos()}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </Form>
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-end">
          <Button onClick={handleSubmit}>Guardar</Button>
          <Button onClick={handleClose} type="button" variant="secondary">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
