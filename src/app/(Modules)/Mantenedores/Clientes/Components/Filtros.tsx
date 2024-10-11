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
import {
  FiltroClienteSchema,
  FiltroClienteDefault,
} from "../Schemas/FiltroClientes.schema";
import { FiltroCliente } from "@/domain/DTOs/Clientes/FiltroClientes";

type FiltroClienteProps = {
  Buscar: (filtros: FiltroCliente) => void;
};

export default function FiltrosCliente(props: Readonly<FiltroClienteProps>) {
  const form = useForm<z.infer<typeof FiltroClienteSchema>>({
    resolver: zodResolver(FiltroClienteSchema),
    defaultValues: FiltroClienteDefault,
  });

  function handleSubmit() {
    form.trigger().then(() => {
      if (form.formState.isValid) {
        const NewItem: FiltroCliente = {
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
