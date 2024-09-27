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
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Inventario } from "@/domain/Models/Inventario/Inventario";
import { GuardaInventario } from "@/domain/Services/InventarioService";
import {
  MantenedorInventarioDefault,
  MantenedorInventarioSchema,
} from "../Schemas/MantenedorInventario.schema";

type MantenedorInventarioProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  open: boolean;
  setOpen: (date: boolean) => void;
  inventario?: Inventario;
};

export default function MantenedorInventario(
  props: Readonly<MantenedorInventarioProps>
) {
  const form = useForm<z.infer<typeof MantenedorInventarioSchema>>({
    resolver: zodResolver(MantenedorInventarioSchema),
    defaultValues: MantenedorInventarioDefault,
  });

  if (props.inventario) {
    form.setValue("Codigo", props.inventario.Codigo);
    form.setValue("Descripcion", props.inventario.Descripcion);
    form.setValue("Existencia", props.inventario.Existencia);
    form.setValue("Costo", props.inventario.Costo);
    form.setValue("Precio", props.inventario.Precio);
    form.setValue("Minimo", props.inventario.Minimo!);
    form.setValue("Maximo", props.inventario.Maximo!);

  }

  function handleClose() {
    form.reset();
    props.setOpen(false);
  }

  function handleSubmit() {
    form.trigger();
    if (form.formState.isValid) {
      const NewItem: Inventario = {
        Id: props.inventario ? props.inventario.Id : undefined,
        Codigo: form.getValues("Codigo"),
        Descripcion: form.getValues("Descripcion"),
        Existencia: form.getValues("Existencia"),
        Costo: form.getValues("Costo"),
        Precio: form.getValues("Precio"),
        Minimo: form.getValues("Minimo"),
        Maximo: form.getValues("Maximo"),
      };
      GuardaInventario(NewItem);
      handleClose();
    }
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
          <DialogTitle>{props.inventario ? "Editar" : "Nuevo"}</DialogTitle>
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
