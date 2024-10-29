"use client";

import { useRouter } from "next/navigation";

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

import { LoginSchema } from "./Schemas/Login.schema";
import { ValidaUsuario } from "@/domain/Services/UsuarioService";
import { toast, Toaster } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const handleClickLogin = async () => {
    form.trigger().then(async () => {
      if (form.formState.isValid) {
        if (await ValidaUsuario(form.getValues("Id"), form.getValues("Pass"))) {
          router.push("/Tablero/Resumen");
        }
        else{
          toast("Error", {
            description: `Datos de usuario no validos`,
          });
        }
      }
    });
  };

  const LoginDefault = {
    Id: "",
    Pass: "",
  };

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: LoginDefault,
  });

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Iniciar sesion</h1>
        <p className="text-balance text-muted-foreground">
          Ingrese con su cuenta de usuario
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="grid gap-2"
        >
          <FormField
            control={form.control}
            name="Id"
            render={({ field }) => (
              <FormItem className="col-span-2 ">
                <FormLabel>Usuario</FormLabel>
                <FormControl>
                  <Input placeholder="Usuario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Pass"
            render={({ field }) => (
              <FormItem className="col-span-2 ">
                <FormLabel>Clave</FormLabel>
                <FormControl>
                  <Input placeholder="Clave" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2">
            <Button className="w-full" onClick={handleClickLogin}>
              Acceder
            </Button>
          </div>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}
