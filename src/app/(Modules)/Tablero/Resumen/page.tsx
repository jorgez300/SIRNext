"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraficoLineal } from "./Components/GraficoLineal";
import Kpi from "./Components/KPI";
import { useEffect, useState } from "react";
import {
  GetCostoTotalInventario,
  GetItemsTotalInventario,
} from "@/domain/Services/ProductoService";
import {
  GetCantidadOperacionesVenta,
  GetCostosPreciosPorDia,
  GetTotalVentas,
  GetVentasPorDia,
} from "@/domain/Services/VentaService";
import { GetTotalCostos } from "@/domain/Services/CostoService";
import { DatoGraficoUnaSerie } from "@/domain/DTOs/DatoGraficoUnaSerie.dto";
import { GetComprasPorDia } from "@/domain/Services/CompraService";
import { DatoGraficoDosSeries } from "@/domain/DTOs/DatoGraficoDosSeries.dto";
import { GraficoLinealDosSeries } from "./Components/GraficoLinealDosSeries";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { DownloadCloud } from "lucide-react";

export default function ResumenPage() {
  const [periodo, setPeriodo] = useState<string>();
  const [listaPeriodos, setListaPeriodos] = useState<string[]>([]);

  const [CostoTotalInventario, setCostoTotalInventario] = useState<number>(0);
  const [ItemsTotalInventario, setItemsTotalInventario] = useState<number>(0);
  const [TotalVentas, setTotalVentas] = useState<number>(0);
  const [CantidadOperacionesVenta, setCantidadOperacionesVenta] =
    useState<number>(0);
  const [TotalCostos, setTotalCostos] = useState<number>(0);

  const [VentasPorDia, setVentasPorDia] = useState<DatoGraficoUnaSerie[]>([]);
  const [ComprasPorDia, setComprasPorDia] = useState<DatoGraficoUnaSerie[]>([]);

  const [CostosPreciosPorDia, setCostosPreciosPorDia] = useState<
    DatoGraficoDosSeries[]
  >([]);

  useEffect(() => {
    GeneraPeriodo();
  }, []);

  const GeneraPeriodo = () => {
    const result: string[] = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      result.push(`${year}-${month}`);
      now.setMonth(now.getMonth() - 1);
    }
    setListaPeriodos(result);
  };

  const Actualizar = async () => {
    if (!periodo) {
      toast("Error", {
        description:'Seleccione un periodo',
      });
      return;
    }

    setCostoTotalInventario(await GetCostoTotalInventario());
    setItemsTotalInventario(await GetItemsTotalInventario());
    setTotalVentas(await GetTotalVentas(periodo));
    setCantidadOperacionesVenta(await GetCantidadOperacionesVenta(periodo));
    setTotalCostos(await GetTotalCostos(periodo));

    setVentasPorDia(await GetVentasPorDia(periodo));
    setComprasPorDia(await GetComprasPorDia(periodo));

    setCostosPreciosPorDia(await GetCostosPreciosPorDia(periodo));
  };

  const HandleSeleccionPeriodo = async (periodo: string) => {
    setPeriodo(periodo);
    await Actualizar();
  };

  return (
    <main className="flex flex-col">
      <div className="grid grid-cols-5 gap-4 my-1">
        <div>
          <Select onValueChange={HandleSeleccionPeriodo}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {listaPeriodos.map((item) => {
                  return (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            className="bg-teal-600"
            onClick={async () => {
              await Actualizar();
            }}
          >
            <DownloadCloud className="mr-2" />
            Actualizar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 my-1">
        <Kpi
          Title="Total Ventas"
          Value={`$ ${TotalVentas}`}
          Subtitle="Monto total de las ventas realizadas en el mes"
        />
        <Kpi
          Title="Operaciones de venta"
          Value={`${CantidadOperacionesVenta}`}
          Subtitle="Cantidad de ventas realizadas en el mes"
        />

        <Kpi
          Title="Costos operativos"
          Value={`$ ${TotalCostos}`}
          Subtitle="Costos de funcionamiento en el mes"
        />
        <Kpi
          Title="Items en inventario"
          Value={`${ItemsTotalInventario}`}
          Subtitle="Cantidad de articulos en inventario"
        />
        <Kpi
          Title="Valor Inventario"
          Value={`$ ${CostoTotalInventario}`}
          Subtitle="Sumatoria del costo de todos los productos"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 my-1">
        <GraficoLineal
          Title="Total Ventas"
          SubTitle="Detalle del total de ventas por dia dentro del periodo seleccionado"
          TituloSerieA="Ventas"
          chartData={VentasPorDia}
        />
        <GraficoLineal
          Title="Total Compras"
          TituloSerieA="Compras"
          SubTitle="Detalle del total de compras por dia dentro del periodo seleccionado"
          chartData={ComprasPorDia}
        />
        <GraficoLinealDosSeries
          Title="Total Costo / Ventas"
          TituloSerieA="Costo"
          TituloSerieB="Venta"
          SubTitle="Detalle del costo/venta por dia dentro del periodo seleccionado"
          chartData={CostosPreciosPorDia}
        />
      </div>
      <Toaster />
    </main>
  );
}
