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
import { GuardaCosto } from "@/domain/Services/CostoService";
import { Costo } from "@/domain/Models/Costos/Costo";
import { MantenedorCostoSchema, MantenedorCostoDefault } from "../Schemas/MantenedorCosto.schema";


type MantenedorCostoProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  open: boolean;
  setOpen: (date: boolean) => void;
  costo?: Costo;
};

export default function MantenedorCosto(
  props: Readonly<MantenedorCostoProps>
) {
  const form = useForm<z.infer<typeof MantenedorCostoSchema>>({
    resolver: zodResolver(MantenedorCostoSchema),
    defaultValues: MantenedorCostoDefault,
  });

  if (props.costo) {
    form.setValue("Codigo", props.costo.Codigo);
    form.setValue("Descripcion", props.costo.Descripcion);
    form.setValue("Costo", props.costo.Costo);

  }

  function handleClose() {
    form.reset();
    props.setOpen(false);
  }

  function handleSubmit() {
    form.trigger();
    if (form.formState.isValid) {
      const NewItem: Costo = {
        Id: props.costo ? props.costo.Id : undefined,
        Codigo: form.getValues("Codigo"),
        Descripcion: form.getValues("Descripcion"),
        Costo: form.getValues("Costo")
      };
      GuardaCosto(NewItem);
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
          <DialogTitle>{props.costo ? "Editar" : "Nuevo"}</DialogTitle>
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
