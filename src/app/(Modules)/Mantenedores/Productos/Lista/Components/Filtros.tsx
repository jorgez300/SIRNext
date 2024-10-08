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
  Buscar: (filtros: FiltroProducto) => void;
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
    form.trigger().then(() => {
      if (form.formState.isValid) {
        const NewItem: FiltroProducto = {
          Codigo: form.getValues("Codigo"),
          Descripcion: form.getValues("Descripcion"),
          Modelo: modeloSeleccionado,
          Marca: marcaSeleccionada
        };
        props.Buscar(NewItem);
      }
    });
  };

  const handleLimpiar = async () => {
    form.reset();
  };

  function FiltraModelos() {
    if (marcaSeleccionada == "") {
      return <SelectItem value="0">No hay opciones</SelectItem>;
    } else {
      const modelos: ModelosPorMarca[] | undefined =
        props.listaModelosPorMarca?.filter((item) => {
          return item.Brand == marcaSeleccionada;
        });

      return modelos![0].Models.map((item) => {
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Marca">Marca</Label>
                <Select
                  onValueChange={(e) => {
                    console.log("e", e);
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
                          <SelectItem key={item.Brand} value={item.Brand}>
                            {item.Brand}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="Modelo">Modelo</Label>
                <Select
                  onValueChange={(e) => {
                    console.log("e", e);
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
          <Button className="mr-2" onClick={handleLimpiar}>
            <Brush className="mr-2" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}
