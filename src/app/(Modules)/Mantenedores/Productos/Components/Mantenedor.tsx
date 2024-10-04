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
import React, {  useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

type MantenedorProductoProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  open: boolean;
  setOpen: (date: boolean) => void;
  producto?: ProductoCompleto;
  listaModelosPorMarca?: ModelosPorMarca[];
};

export default function MantenedorProducto(
  props: Readonly<MantenedorProductoProps>
) {
  const form = useForm<z.infer<typeof MantenedorProductoSchema>>({
    resolver: zodResolver(MantenedorProductoSchema),
    defaultValues: MantenedorProductoDefault,
  });

  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState<string>("");
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  if (props.producto) {
    form.setValue("Codigo", props.producto.Item!.Codigo);
    form.setValue("Descripcion", props.producto.Item!.Descripcion);
    form.setValue("Existencia", props.producto.Item!.Existencia);
    form.setValue("Costo", props.producto.Item!.Costo);
    form.setValue("Precio", props.producto.Item!.Precio);
    form.setValue("Minimo", props.producto.Item!.Minimo!);
    form.setValue("Maximo", props.producto.Item!.Maximo!);
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
      <>
        <div key={item.Brand + item.Model} className="text-sm">
          {item.Brand + " - " + item.Model}
        </div>
        <Separator className="my-1" />
      </>
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
        Minimo: form.getValues("Minimo"),
        Maximo: form.getValues("Maximo"),
      };
      GuardaProducto(NewItem);
      handleClose();
    }
  }

  function agregaVehiculo() {
    const lista = vehiculos;

    if (
      !lista.find(
        (x) => x.Brand === marcaSeleccionada && x.Model === modeloSeleccionado
      )
    ) 
    {

      lista.push({
        Brand: marcaSeleccionada,
        Model: modeloSeleccionado,
      });

      setVehiculos([]);
      setVehiculos(lista);
    }
  }

  function limpiaVehiculos() {
    console.log(vehiculos);
    setVehiculos([]);
  }

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
                  <FormItem className="col-span-4 ">
                    <FormLabel>Codigo</FormLabel>
                    <FormControl>
                      <Input placeholder="Codigo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Descripcion"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Descripcion</FormLabel>
                    <FormControl>
                      <Input placeholder="Descripcion" {...field} />
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
              <FormField
                control={form.control}
                name="Minimo"
                render={({ field }) => (
                  <FormItem className=" ">
                    <FormLabel>Minimo</FormLabel>
                    <FormControl>
                      <Input placeholder="Minimo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Maximo"
                render={({ field }) => (
                  <FormItem className=" ">
                    <FormLabel>Maximo</FormLabel>
                    <FormControl>
                      <Input placeholder="Maximo" {...field} />
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
                <div className="flex items-end gap-4">
                  <Button onClick={agregaVehiculo}>Agregar</Button>
                  <Button onClick={limpiaVehiculos}>Limpiar</Button>
                </div>
              </div>
              <div className="px-4">
                <ScrollArea className="h-36 w-48 rounded-md border">
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
