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
import {
  MantenedorClienteDefault,
  MantenedorClienteSchema,
} from "../Schemas/MantenedorClientes.schema";

import { Cliente } from "@/domain/Models/Clientes/Cliente";
import { GuardaCliente } from "@/domain/Services/ClienteService";

type MantenedorClienteProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  open: boolean;
  setOpen: (date: boolean) => void;
  cliente?: Cliente;
};

export default function MantenedorCliente(props: Readonly<MantenedorClienteProps>) {
  const form = useForm<z.infer<typeof MantenedorClienteSchema>>({
    resolver: zodResolver(MantenedorClienteSchema),
    defaultValues: MantenedorClienteDefault,
  });

  if (props.cliente) {
    form.setValue("Identificacion", props.cliente.Identificacion!);
    form.setValue("Nombre", props.cliente.Nombre!);
  }

  function handleClose() {
    form.reset();
    props.setOpen(false);
  }

  function handleSubmit() {
    form.trigger();
    if (form.formState.isValid) {
      const NewItem: Cliente = {
        Id: (props.cliente) ? props.cliente.Id : undefined,
        Identificacion: form.getValues("Identificacion"),
        Nombre: form.getValues("Nombre"),
      };
      GuardaCliente(NewItem);
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
          <DialogTitle>{props.cliente ? "Editar" : "Nuevo"}</DialogTitle>
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
                name="Identificacion"
                render={({ field }) => (
                  <FormItem className="col-span-4 ">
                    <FormLabel>Titulo</FormLabel>
                    <FormControl>
                      <Input placeholder="Identificacion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Nombre"
                render={({ field }) => (
                  <FormItem className="col-span-4 ">
                    <FormLabel>Url</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
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
