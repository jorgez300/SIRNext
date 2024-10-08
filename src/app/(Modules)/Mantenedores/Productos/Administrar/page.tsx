"use client";
import { Button } from "@/components/ui/button";

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
import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { z } from "zod";
import { Producto } from "@/domain/Models/Productos/Producto";
import { GuardaProducto } from "@/domain/Services/ProductoService";

import { ModelosPorMarca } from "@/domain/DTOs/Vehiculos/ModelosPorMarca.Dto";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Vehiculo } from "@/domain/Models/Vehiculos/Vehiculo";
import { Textarea } from "@/components/ui/textarea";

import {
  MantenedorProductoSchema,
  MantenedorProductoDefault,
} from "./Schemas/MantenedorProducto.schema";
import { EscanerProducto } from "@/app/global/Components/Camara";
import { GetModelosPorMarca } from "@/domain/Services/VehiculoService";

export default function MantenedorProducto() {
  const form = useForm<z.infer<typeof MantenedorProductoSchema>>({
    resolver: zodResolver(MantenedorProductoSchema),
    defaultValues: MantenedorProductoDefault,
  });
  const [listaModelosPorMarca, setListaModelosPorMarca] = useState<
    ModelosPorMarca[]
  >([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState<string>("");
  const [anioDesde, setAnioDesde] = useState<number>();
  const [anioHasta, setAnioHasta] = useState<number>();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  const [camaraActiva, setCamaraActiva] = useState<boolean>(false);
  const [decodedText, setDecodedText] = useState<string>();

  useEffect(() => {
    Listas();
  }, []);

  if (decodedText) {
    form.setValue("Codigo", decodedText);
  }

  const Listas = async () => {
    setListaModelosPorMarca(await GetModelosPorMarca());
  };

  /*if (props.producto) {
    form.setValue("Codigo", props.producto.Item!.Codigo);
    form.setValue("Descripcion", props.producto.Item!.Descripcion);
    form.setValue("Existencia", props.producto.Item!.Existencia);
    form.setValue("Costo", props.producto.Item!.Costo);
    form.setValue("Precio", props.producto.Item!.Precio);
  }*/

  function FiltraModelos() {
    if (marcaSeleccionada == "") {
      return <SelectItem value="0">No hay opciones</SelectItem>;
    } else {
      const modelos: ModelosPorMarca[] | undefined =
        listaModelosPorMarca?.filter((item) => {
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
  }

  function handleSubmit() {
    form.trigger();
    if (form.formState.isValid) {
      const NewItem: Producto = {
        //Id: props.producto ? props.producto.Item!.Id : undefined,
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
    <main className="grid grid-cols-1 gap-3 p-4">
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
          <div className="col-span-1 content-end">
            <Button
              type="button"
              className="self-end"
              onClick={() => {
                setCamaraActiva(true);
                setDecodedText("");
              }}
            >
              Escanear
            </Button>
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
                  <SelectValue id="Marca" placeholder="Seleccione una marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Marcas</SelectLabel>
                    {listaModelosPorMarca?.map((item) => {
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
                  <SelectValue id="Modelo" placeholder="Seleccione un modelo" />
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
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">
                  Vehiculos
                </h4>
                {MuestraVehiculos()}
              </div>
            </ScrollArea>
          </div>
        </div>
        <EscanerProducto
          camaraActiva={camaraActiva}
          setCamaraActiva={setCamaraActiva}
          decodedText={decodedText}
          setDecodedText={setDecodedText}
        />
      </Form>
    </main>
  );
}
