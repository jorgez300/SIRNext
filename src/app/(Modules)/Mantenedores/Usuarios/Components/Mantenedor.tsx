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
import { useAdministraUsuarioStore } from "../Store/AdministraUsuario";
import { MantenedorUsuarioSchema } from "../Schemas/MantenedorUsuario.schema";
import {
  ActualizaUsuario,
  GetUsuarioById,
  InsertaUsuario,
} from "@/domain/Services/UsuarioService";
import { Usuario } from "@/domain/Models/Usuarios/Usuario";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MantenedorUsuarioProps = {
  setOpen: (flag: boolean) => void;
};

export default function MantenedorUsuario(
  props: Readonly<MantenedorUsuarioProps>
) {
  const { Usuario, ResetUsuario, RegistraUsuario } =
    useAdministraUsuarioStore();

  let MantenedorUsuarioDefault = {
    Id: "",
    Nombre: "",
    Rol: "",
    Pass: "",
  };

  if (Usuario) {
    MantenedorUsuarioDefault = {
      Id: Usuario.Id!,
      Nombre: Usuario.Nombre!,
      Rol: Usuario.Rol!,
      Pass: Usuario.Pass!,
    };
  }

  const form = useForm<z.infer<typeof MantenedorUsuarioSchema>>({
    resolver: zodResolver(MantenedorUsuarioSchema),
    defaultValues: MantenedorUsuarioDefault,
  });

  const handleClose = async () => {
    form.reset();
    await ResetUsuario();
    props.setOpen(false);
  };

  const ValidaExiste = async (Identificacion: string) => {
    const data = await GetUsuarioById(Identificacion);

    if (data) {
      await RegistraUsuario(data);
      form.setValue("Id", data.Id!);
      form.setValue("Nombre", data.Nombre!);
      form.setValue("Rol", data.Rol!);
      form.setValue("Pass", data.Pass!);
    }
  };

  function handleSubmit() {
    form.trigger().then(() => {
      if (form.formState.isValid) {
        const NewItem: Usuario = {
          Id: Usuario ? Usuario.Id : form.getValues("Id"),
          Nombre: form.getValues("Nombre"),
          Rol: form.getValues("Rol"),
          Pass: form.getValues("Pass"),
        };
        if (Usuario) {
          ActualizaUsuario(NewItem);
        } else {
          InsertaUsuario(NewItem);
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
          <DialogTitle>{Usuario ? "Editar" : "Nuevo"}</DialogTitle>
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
                name="Id"
                render={({ field }) => (
                  <FormItem className="col-span-4 ">
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Usuario"
                        {...field}
                        disabled={Usuario ? true : false}
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
              <FormField
                control={form.control}
                name="Rol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permisos</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Permisos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="VENDEDOR">VENDEDOR</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Pass"
                render={({ field }) => (
                  <FormItem className="col-span-4 ">
                    <FormLabel>Clave</FormLabel>
                    <FormControl>
                      <Input placeholder="Clave" type="password" {...field} />
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
