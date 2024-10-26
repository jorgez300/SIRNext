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
  ActualizaCosto,
  GetCostoById,
  InsertaCosto,
} from "@/domain/Services/CostoService";
import { Costo } from "@/domain/Models/Costos/Costo";
import { MantenedorCostoSchema } from "../Schemas/MantenedorCosto.schema";
import { useAdministraCostoStore } from "../Store/AdministraCosto.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MantenedorCostoProps = {
  setOpen: (flag: boolean) => void;
};

export default function MantenedorCosto(props: Readonly<MantenedorCostoProps>) {
  const { Costo, RegistraCosto, ResetCosto } = useAdministraCostoStore();

  let MantenedorCostoDefault = {
    Codigo: "",
    Descripcion: "",
    Costo: 0,
    Tipo: "U",
  };

  if (Costo) {
    MantenedorCostoDefault = {
      Codigo: Costo.Codigo,
      Descripcion: Costo.Descripcion,
      Costo: Costo.Costo,
      Tipo: Costo.Tipo,
    };
  }

  const form = useForm<z.infer<typeof MantenedorCostoSchema>>({
    resolver: zodResolver(MantenedorCostoSchema),
    defaultValues: MantenedorCostoDefault,
  });

  const handleClose = async () => {
    form.reset();
    await ResetCosto();
    props.setOpen(false);
  };

  const ValidaExiste = async (id: string) => {
    const data = await GetCostoById(id);

    if (data) {
      await RegistraCosto(data);
      form.setValue("Codigo", data.Codigo);
      form.setValue("Descripcion", data.Descripcion);
      form.setValue("Costo", data.Costo);
      form.setValue("Tipo", data.Tipo);
    }
  };

  function handleSubmit() {
    form.trigger().then(() => {
      if (form.formState.isValid) {
        const NewItem: Costo = {
          Id: Costo ? Costo.Id : undefined,
          Codigo: form.getValues("Codigo"),
          Descripcion: form.getValues("Descripcion"),
          Costo: form.getValues("Costo"),
          Tipo: form.getValues("Tipo"),
        };
        if (Costo) {
          ActualizaCosto(NewItem);
        } else {
          InsertaCosto(NewItem);
        }

        handleClose();
      }
    });

  }

  return (
    <Dialog defaultOpen={true} onOpenChange={props.setOpen}>
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
          <DialogTitle>{Costo ? "Editar" : "Nuevo"}</DialogTitle>
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
                      <Input
                        placeholder="Codigo"
                        {...field}
                        disabled={Costo ? true : false}
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
              <FormField
                control={form.control}
                name="Tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeticion</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="R">Recurrente</SelectItem>
                        <SelectItem value="U">Unico</SelectItem>
                      </SelectContent>
                    </Select>
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
