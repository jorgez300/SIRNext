"use client";
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
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Brush, CalendarIcon, SearchCheckIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiltroCompra } from "@/domain/DTOs/Compras/FiltroCompra";
import { FiltroCompraSchema } from "../Schemas/FiltroCompra.schema";

type FiltroCompraProps = {
  Buscar: (filtros: FiltroCompra) => void;
  RegistraFiltros: (filtros: FiltroCompra) => Promise<void>;
  ResetFiltros: () => Promise<void>;
};

export default function FiltrosCompra(props: Readonly<FiltroCompraProps>) {
  const form = useForm<z.infer<typeof FiltroCompraSchema>>({
    resolver: zodResolver(FiltroCompraSchema),
    defaultValues: {
      ProveedorId: "",
      CompraId: 0,
      Estado: "TODOS",
    },
  });

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  function handleSubmit() {
    form.trigger().then(() => {
      if (form.formState.isValid) {
        const NewItem: FiltroCompra = {
          ProveedorId: form.getValues("ProveedorId"),
          Estado: form.getValues("Estado"),
          CompraId: form.getValues("CompraId"),
          FechaDesde: date?.from,
          FechaHasta: date?.to,
        };
        props.RegistraFiltros(NewItem);
        props.Buscar(NewItem);
      }
    });
  }

  const handleLimpiar = async () => {
    form.reset();
    setDate({
      from: new Date(),
      to: addDays(new Date(), 1),
    });
    await props.ResetFiltros();
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="ProveedorId"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Proveedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CompraId"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Nro Compra</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Numero de compra"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-2">
              <div className="">
                <FormField
                  name={""}
                  render={() => (
                    <FormItem>
                      <FormLabel>Periodo</FormLabel>
                      <br />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            name="date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "LLL dd, y")} -{" "}
                                  {format(date.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(date.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="Estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TODOS">Todos</SelectItem>
                          <SelectItem value="VIGENTE">Vigente</SelectItem>
                          <SelectItem value="DEVUELTO">Devuelto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
