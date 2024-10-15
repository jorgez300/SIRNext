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
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Brush, SearchCheckIcon } from "lucide-react";
import { FiltroProveedor } from "@/domain/DTOs/Proveedores/FiltroProveedores";
import {
  FiltroProveedorSchema,
  FiltroProveedorDefault,
} from "../Schemas/FiltroProveedor.schema";

type FiltroProveedorProps = {
  Buscar: (filtros: FiltroProveedor) => void;
};

export default function FiltrosProveedor(props: Readonly<FiltroProveedorProps>) {
  const form = useForm<z.infer<typeof FiltroProveedorSchema>>({
    resolver: zodResolver(FiltroProveedorSchema),
    defaultValues: FiltroProveedorDefault,
  });

  function handleSubmit() {
    form.trigger().then(() => {
      if (form.formState.isValid) {
        const NewItem: FiltroProveedor = {
          Nombre: form.getValues("Nombre"),
        };
        props.Buscar(NewItem);
      }
    });
  }

  const handleLimpiar = async () => {
    form.reset();
  };

  return (
    <div className="grid grid-cols-1 gap-4">
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
              name="Nombre"
              render={({ field }) => (
                <FormItem className="col-span-2 ">
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
      <div>
        <div className="flex justify-start gap-2">
          <Button onClick={handleSubmit}>
            <SearchCheckIcon className="mr-2" />
            Consultar
          </Button>
          <Button
            variant="destructive"
            className="mr-2"
            onClick={handleLimpiar}
          >
            <Brush className="mr-2" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}
