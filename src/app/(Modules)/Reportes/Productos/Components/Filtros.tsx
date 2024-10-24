"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SearchCheckIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiltroReporteProducto } from "@/domain/DTOs/Productos/FiltroReporteProducto";
import { FiltroReporteProductoSchema } from "../Schemas/FiltroReporteProducto.schema";

type FiltroReporteProductoProps = {
  Buscar: (filtros: FiltroReporteProducto) => Promise<void>;
};

export default function FiltroReporteProductos(
  props: Readonly<FiltroReporteProductoProps>
) {
  const FiltroReporteProductoDefault = {
    TipoReporte: "TODOS",
    Ubicacion: "TODOS",
  };

  const form = useForm<z.infer<typeof FiltroReporteProductoSchema>>({
    resolver: zodResolver(FiltroReporteProductoSchema),
    defaultValues: FiltroReporteProductoDefault,
  });

  const handleSubmit = async () => {
    form.trigger().then(async () => {
      if (form.formState.isValid) {
        const NewItem: FiltroReporteProducto = {
          TipoReporte: form.getValues("TipoReporte"),
          Ubicacion: form.getValues("Ubicacion"),
        };
        console.log('FiltroReporteProducto', NewItem)
        await props.Buscar(NewItem);
      }
    });
  };

  const GeneraUbicacion = () => {
    const cont = [];

    for (let i = 1; i <= 50; i++) {
      cont.push(i);
    }

    return cont.map((i) => {
      return (
        <SelectItem
          key={`Ubicacion${i}`}
          value={`${i}`}
        >{`Estante ${i}`}</SelectItem>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Form {...form}>
          <form className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="TipoReporte"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Tipo Reporte</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo de reporte a ver" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TODOS">Todos</SelectItem>
                      <SelectItem value="Exis<=0">
                        Existencia en cero
                      </SelectItem>
                      <SelectItem value="Exis<=Min">
                        Existencia menor o igual al minimo
                      </SelectItem>
                      <SelectItem value="Exis>=Max">
                        Existencia mayor o igual al maximo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicacion</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione ubicacion" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TODOS">Todos</SelectItem>
                      {GeneraUbicacion()}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div>
        <div className="flex justify-start gap-2">
          <Button className="mr-2" onClick={handleSubmit}>
            <SearchCheckIcon className="mr-2" />
            Consultar
          </Button>
        </div>
      </div>
    </div>
  );
}
