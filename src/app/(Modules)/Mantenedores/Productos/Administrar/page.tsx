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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash2Icon, SaveAll, DoorOpen } from "lucide-react";
import { z } from "zod";
import { Producto } from "@/domain/Models/Productos/Producto";
import {
  GetProductoById,
  ActualizaProducto,
  InsertaProducto,
} from "@/domain/Services/ProductoService";

import { ModelosPorMarca } from "@/domain/DTOs/Vehiculos/ModelosPorMarca.Dto";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Vehiculo } from "@/domain/Models/Vehiculos/Vehiculo";
import { Textarea } from "@/components/ui/textarea";

import {
  MantenedorProductoSchema,
  MantenedorProductoDefault,
} from "./Schemas/MantenedorProducto.schema";
import { EscanerProducto } from "@/app/global/Components/Camara";
import {
  GetModelosPorMarca,
  GetVehiculosPorProducto,
} from "@/domain/Services/VehiculoService";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useAdministraProductoStore } from "../Store/AdmistraProducto.store";

export default function MantenedorProductoPage() {
  const form = useForm<z.infer<typeof MantenedorProductoSchema>>({
    resolver: zodResolver(MantenedorProductoSchema),
    defaultValues: MantenedorProductoDefault,
  });
  const [listaModelosPorMarca, setListaModelosPorMarca] = useState<
    ModelosPorMarca[]
  >([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState<string>("");
  const [anioDesde, setAnioDesde] = useState<number>();
  const [anioHasta, setAnioHasta] = useState<number>();
  const [producto, setProducto] = useState<Producto | undefined>();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  const [camaraActiva, setCamaraActiva] = useState<boolean>(false);
  const [decodedText, setDecodedText] = useState<string>();
  const router = useRouter();

  const { Codigo } = useAdministraProductoStore();

  useEffect(() => {
    Listas();
    isEdit();
  }, []);

  if (decodedText) {
    form.setValue("Codigo", decodedText);
  }

  const isEdit = async () => {
    if (Codigo) {
      const Item = await GetProductoById(Codigo);
      if (Item) {
        form.setValue("Codigo", Item.Codigo);
        form.setValue("Descripcion", Item.Descripcion);
        form.setValue("Existencia", Item.Existencia);
        form.setValue("Costo", Item.Costo);
        form.setValue("Precio", Item.Precio);
      }
      setProducto(Item);
      setVehiculos(await GetVehiculosPorProducto(Codigo));
    }
  };

  const Listas = async () => {
    setListaModelosPorMarca(await GetModelosPorMarca());
  };

  function FiltraModelos() {
    if (marcaSeleccionada == "") {
      return <SelectItem value="0">No hay opciones</SelectItem>;
    } else {
      const modelos: ModelosPorMarca[] | undefined =
        listaModelosPorMarca?.filter((item) => {
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

  function MuestraVehiculos() {
    return vehiculos.map((item) => (
      <div
        key={item.Marca + " - " + item.Modelo}
        className="flex gap-4 content-center my-1"
      >
        <Trash2Icon
          className="text-teal-600"
          onClick={() => {
            eliminaVehiculo(item.Marca, item.Modelo);
          }}
        />
        <Label className="mt-1">{`${item.Marca} - ${item.Modelo} (${
          item.Desde ?? ""
        } - ${item.Hasta ?? ""})`}</Label>
      </div>
    ));
  }

  function handleClose() {
    router.push("/Mantenedores/Productos/Lista");
  }

  const handleSubmit = async () => {
    form.trigger().then(() => {
      if (form.formState.isValid) {
        const NewItem: Producto = {
          //Id: props.producto ? props.producto.Item!.Id : undefined,
          Codigo: form.getValues("Codigo"),
          Descripcion: form.getValues("Descripcion"),
          Vigente: form.getValues("Vigente"),
          Existencia: form.getValues("Existencia"),
          Costo: form.getValues("Costo"),
          Precio: form.getValues("Precio"),
        };
        if (Codigo) {
          ActualizaProducto({
            Item: NewItem,
            Vehiculos: vehiculos,
          });
        } else {
          InsertaProducto({
            Item: NewItem,
            Vehiculos: vehiculos,
          });
        }

        handleClose();
      }
    });
  };

  function agregaVehiculo() {
    if (!marcaSeleccionada) {
      return;
    }
    if (!modeloSeleccionado) {
      return;
    }

    const lista = vehiculos.filter((item) => item.Marca != "");

    if (
      !lista.find(
        (x) => x.Marca === marcaSeleccionada && x.Modelo === modeloSeleccionado
      )
    ) {
      lista.push({
        Marca: marcaSeleccionada,
        Modelo: modeloSeleccionado,
        Desde: anioDesde,
        Hasta: anioHasta ?? anioDesde,
      });

      setVehiculos(lista);
    }
  }

  function eliminaVehiculo(Marca: string, Modelo: string) {
    const lista = vehiculos.filter(
      (item) => item.Marca + item.Modelo != Marca + Modelo
    );

    setVehiculos(lista);
  }

  function limpiaVehiculos() {
    setVehiculos([]);
  }

  const ObtieneAniosValidos = (desde?: number): number[] => {
    const añoActual: number = new Date().getFullYear();
    let listaAños: number[] = [];
    if (desde) {
      const largo: number = new Date().getFullYear() - desde;
      listaAños = Array.from({ length: largo }, (_, i) => añoActual - i);
    } else {
      listaAños = Array.from({ length: 31 }, (_, i) => añoActual - i);
    }

    return listaAños;
  };

  return (
    <main className="grid grid-cols-1 gap-3 p-4">
      <Form {...form}>
        <form className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="Codigo"
            render={({ field }) => (
              <FormItem className="col-span-3 ">
                <FormLabel>Codigo</FormLabel>
                <FormControl>
                  <Input
                    disabled={producto ? true : false}
                    placeholder="Codigo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-1 content-end ">
            <Button
              type="button"
              className={producto ? "self-end hidden" : "self-end"}
              hidden={producto ? true : false}
              onClick={() => {
                setCamaraActiva(true);
                setDecodedText("");
              }}
            >
              Escanear
            </Button>
          </div>
          <FormField
            control={form.control}
            name="Descripcion"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descripcion" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Vigente"
            render={({ field }) => (
              <FormItem className="col-span-4 flex flex-row">
                <div className="">
                  <FormLabel className="mr-4">Vigente</FormLabel>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Existencia"
            render={({ field }) => (
              <FormItem className=" ">
                <FormLabel>Existencia</FormLabel>
                <FormControl>
                  <Input placeholder="Existencia" {...field} />
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
            name="Precio"
            render={({ field }) => (
              <FormItem className=" ">
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input placeholder="Precio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        <Separator className="my-4" />

        <div className="grid grid-cols-2">
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
                  <SelectValue id="Marca" placeholder="Seleccione una marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Marcas</SelectLabel>
                    {listaModelosPorMarca?.map((item) => {
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
              <Label htmlFor="Modelo">Modelo</Label>
              <Select
                onValueChange={(e) => {
                  console.log("e", e);
                  setModeloSeleccionado(e);
                }}
              >
                <SelectTrigger className="">
                  <SelectValue id="Modelo" placeholder="Seleccione un modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Modelo</SelectLabel>
                    {FiltraModelos()}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Desde">Desde</Label>
              <Select
                onValueChange={(e) => {
                  console.log("e", e);
                  setAnioDesde(Number.parseInt(e));
                }}
              >
                <SelectTrigger className="">
                  <SelectValue id="Desde" placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Anio Inicio</SelectLabel>
                    {ObtieneAniosValidos().map((item) => {
                      return (
                        <SelectItem key={item} value={item.toString()}>
                          {item}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Hasta">Hasta</Label>
              <Select
                onValueChange={(e) => {
                  setAnioHasta(Number.parseInt(e));
                }}
              >
                <SelectTrigger className="">
                  <SelectValue id="Hasta" placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Anio Hasta</SelectLabel>
                    {ObtieneAniosValidos(anioDesde).map((item) => {
                      return (
                        <SelectItem key={item} value={item.toString()}>
                          {item}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-4">
              <Button onClick={agregaVehiculo}>Agregar</Button>
              <Button onClick={limpiaVehiculos}>Limpiar</Button>
            </div>
          </div>
          <div className="px-4">
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">
                  Vehiculos
                </h4>
                {MuestraVehiculos()}
              </div>
            </ScrollArea>
          </div>
        </div>
        <EscanerProducto
          camaraActiva={camaraActiva}
          setCamaraActiva={setCamaraActiva}
          decodedText={decodedText}
          setDecodedText={setDecodedText}
        />
      </Form>

      <Separator className="my-4" />
      <div className="flex justify-end">
        <Button
          className="bg-teal-600 ml-2"
          onClick={async () => {
            handleSubmit();
          }}
        >
          <SaveAll className="mr-2" />
          Guardar
        </Button>
        <Button
          className="bg-teal-600 ml-2"
          onClick={async () => {
            handleClose();
          }}
        >
          <DoorOpen className="mr-2" />
          Salir
        </Button>
      </div>
    </main>
  );
}