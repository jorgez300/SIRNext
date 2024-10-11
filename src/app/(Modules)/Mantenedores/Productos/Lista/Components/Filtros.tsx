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
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SearchCheckIcon, Brush } from "lucide-react";
import { FiltroProducto } from "@/domain/DTOs/Productos/FiltroProducto";
import {
  FiltroProductoSchema,
  FiltroProductoDefault,
} from "../Schemas/FiltroProducto.schema";
import { Label } from "@/components/ui/label";
import { ModelosPorMarca } from "@/domain/DTOs/Vehiculos/ModelosPorMarca.Dto";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FiltroProductoProps = {
  Buscar: (filtros: FiltroProducto) => Promise<void>;
  decodedText?: string;
  listaModelosPorMarca: ModelosPorMarca[];
};

export default function FiltrosProducto(props: Readonly<FiltroProductoProps>) {
  const form = useForm<z.infer<typeof FiltroProductoSchema>>({
    resolver: zodResolver(FiltroProductoSchema),
    defaultValues: FiltroProductoDefault,
  });

  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState<string>("");

  if (props.decodedText) {
    form.setValue("Codigo", props.decodedText);
  }

  const handleSubmit = async () => {
    form.trigger().then(async () => {
      if (form.formState.isValid) {
        const NewItem: FiltroProducto = {
          Codigo: form.getValues("Codigo"),
          Descripcion: form.getValues("Descripcion"),
          MarcaProd: form.getValues("MarcaProd"),
          Vehiculo: {
            Modelo: modeloSeleccionado,
            Marca: marcaSeleccionada,
          },
        };
        await props.Buscar(NewItem);
      }
    });
  };

  const handleLimpiar = async () => {
    form.reset();
    setMarcaSeleccionada("");
    setModeloSeleccionado("");
  };

  function FiltraModelos() {
    if (marcaSeleccionada == "") {
      return <SelectItem value="0">No hay opciones</SelectItem>;
    } else {
      const modelos: ModelosPorMarca[] | undefined =
        props.listaModelosPorMarca?.filter((item) => {
          return item.Marca == marcaSeleccionada;
        });

      return modelos![0].Modelos.map((item) => {
        return (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        );
      });
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
                    <Input
                      placeholder="Codigo"
                      {...field}
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
                <FormItem className="col-span-2 ">
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
              name="MarcaProd"
              render={({ field }) => (
                <FormItem className="col-span-2 ">
                  <FormLabel>Marca Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Marca Producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Marca">Marca Vehiculo</Label>
                <Select
                  value={marcaSeleccionada}
                  onValueChange={(e) => {
                    setMarcaSeleccionada(e);
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue
                      id="Marca"
                      placeholder="Seleccione una marca"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Marcas</SelectLabel>
                      {props.listaModelosPorMarca?.map((item) => {
                        return (
                          <SelectItem key={item.Marca} value={item.Marca}>
                            {item.Marca}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="Modelo">Modelo Vehiculo</Label>
                <Select
                  value={modeloSeleccionado}
                  onValueChange={(e) => {
                    setModeloSeleccionado(e);
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue
                      id="Modelo"
                      placeholder="Seleccione un modelo"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Modelo</SelectLabel>
                      {FiltraModelos()}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div>
        <div className="flex justify-start gap-2">
          <Button className="mr-2" onClick={handleSubmit}>
            <SearchCheckIcon className="mr-2" />
            Consultar
          </Button>
          <Button  variant="destructive" className="mr-2" onClick={handleLimpiar}>
            <Brush className="mr-2" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}
