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
import { MantenedorClienteSchema } from "../Schemas/MantenedorClientes.schema";

import { Cliente } from "@/domain/Models/Clientes/Cliente";
import {
  ActualizaCliente,
  GetClienteByIdentificacion,
  InsertaCliente,
} from "@/domain/Services/ClienteService";
import { useAdministraClienteStore } from "../Store/AdmistraCliente.store";

type MantenedorClienteProps = {
  setOpen: (date: boolean) => void;
};

export default function MantenedorCliente(
  props: Readonly<MantenedorClienteProps>
) {
  const { Cliente, ResetCliente, RegistraCliente } =
    useAdministraClienteStore();

  let MantenedorClienteDefault = {
    Identificacion: "",
    Nombre: "",
  };

  if (Cliente) {
    MantenedorClienteDefault = {
      Identificacion: Cliente?.Identificacion,
      Nombre: Cliente?.Nombre,
    };
  }

  const form = useForm<z.infer<typeof MantenedorClienteSchema>>({
    resolver: zodResolver(MantenedorClienteSchema),
    defaultValues: MantenedorClienteDefault,
  });

  const handleClose = async () => {
    form.reset();
    await ResetCliente();
    props.setOpen(false);
  };

  const ValidaExiste = async (Identificacion: string) => {
    const data = await GetClienteByIdentificacion(Identificacion);

    if (data) {
      await RegistraCliente(data);
      form.setValue("Identificacion", data.Identificacion);
      form.setValue("Nombre", data.Nombre);
    }
  };

  function handleSubmit() {
    form.trigger().then(() => {
      if (form.formState.isValid) {
        const NewItem: Cliente = {
          Id: Cliente ? Cliente.Id : undefined,
          Identificacion: form.getValues("Identificacion"),
          Nombre: form.getValues("Nombre"),
        };
        if (Cliente) {
          ActualizaCliente(NewItem);
        } else {
          InsertaCliente(NewItem);
        }

        handleClose();
      }
    });
  }

  return (
    <Dialog defaultOpen={true}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
        className="w-full max-w-6xl"
      >
        <DialogHeader>
          <DialogTitle>{Cliente ? "Editar" : "Nuevo"}</DialogTitle>
          <DialogDescription>Version</DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="grid grid-cols-4 gap-4"
            >
              <FormField
                control={form.control}
                name="Identificacion"
                render={({ field }) => (
                  <FormItem className="col-span-4 ">
                    <FormLabel>Identificacion</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Identificacion"
                        {...field}
                        disabled={Cliente ? true : false}
                        onBlur={async (e) => {
                          await ValidaExiste(e.target.value.toUpperCase());
                        }}
                      />
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
                    <FormLabel>Nombre</FormLabel>
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
