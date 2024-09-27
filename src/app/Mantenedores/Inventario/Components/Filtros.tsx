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
import { SearchCheckIcon } from "lucide-react";
import { FiltroInventario } from "@/domain/DTOs/FiltroInventario";
import {
  FiltroInventarioDefault,
  FiltroInventarioSchema,
} from "../Schemas/FiltroInventario.schema";

type FiltroInventarioProps = {
  Buscar: (filtros: FiltroInventario) => void;
};

export default function FiltrosInventario(props: Readonly<FiltroInventarioProps>) {
  const form = useForm<z.infer<typeof FiltroInventarioSchema>>({
    resolver: zodResolver(FiltroInventarioSchema),
    defaultValues: FiltroInventarioDefault,
  });

  function handleSubmit() {
    form.trigger();
    if (form.formState.isValid) {
      const NewItem: FiltroInventario = {
        Codigo: form.getValues("Codigo"),
        Descripcion: form.getValues("Descripcion"),
      };
      props.Buscar(NewItem);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Form {...form}>
          <form className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="Codigo"
              render={({ field }) => (
                <FormItem className="col-span-2 ">
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
                <FormItem className="col-span-2 ">
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripcion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div>
        <div className="flex justify-start">
          <Button onClick={handleSubmit}>
            <SearchCheckIcon className="mr-2" />
            Consultar
          </Button>
        </div>
      </div>
    </div>
  );
}
