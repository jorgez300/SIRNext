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
import { useAdministraProveedorStore } from "../Store/AdministraProveedor.store";
import { MantenedorProveedorSchema } from "../Schemas/MantenedorProveedor.schema";
import { Proveedor } from "@/domain/Models/Proveedores/Proveedor";
import {
  ActualizaProveedor,
  GetProveedorByIdentificacion,
  InsertaProveedor,
} from "@/domain/Services/ProveedorService";

type MantenedorProveedorProps = {
  setOpen: (date: boolean) => void;
};

export default function MantenedorProveedor(
  props: Readonly<MantenedorProveedorProps>
) {
  const { Proveedor, ResetProveedor, RegistraProveedor } =
    useAdministraProveedorStore();

  let MantenedorProveedorDefault = {
    Identificacion: "",
    Nombre: "",
  };

  if (Proveedor) {
    MantenedorProveedorDefault = {
      Identificacion: Proveedor?.Identificacion,
      Nombre: Proveedor?.Nombre,
    };
  }

  const form = useForm<z.infer<typeof MantenedorProveedorSchema>>({
    resolver: zodResolver(MantenedorProveedorSchema),
    defaultValues: MantenedorProveedorDefault,
  });

  const handleClose = async () => {
    form.reset();
    await ResetProveedor();
    props.setOpen(false);
  };

  const ValidaExiste = async (Identificacion: string) => {
    const data = await GetProveedorByIdentificacion(Identificacion);

    if (data) {
      await RegistraProveedor(data);
      form.setValue("Identificacion", data.Identificacion);
      form.setValue("Nombre", data.Nombre);
    }
  };

  function handleSubmit() {
    form.trigger().then(() => {
      if (form.formState.isValid) {
        const NewItem: Proveedor = {
          Id: Proveedor ? Proveedor.Id : undefined,
          Identificacion: form.getValues("Identificacion"),
          Nombre: form.getValues("Nombre"),
        };
        if (Proveedor) {
          ActualizaProveedor(NewItem);
        } else {
          InsertaProveedor(NewItem);
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
          <DialogTitle>{Proveedor ? "Editar" : "Nuevo"}</DialogTitle>
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
                        disabled={Proveedor ? true : false}
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
