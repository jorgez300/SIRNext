"use client";

import { Receipt } from "lucide-react";
import { useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { useCodPantallaStore } from "@/app/global/Store/CodPantalla.store";

import FiltrosVenta from "./Components/Filtros";
import { TablaVentas } from "./Components/Tabla";
import ModalDetalleVenta from "./Components/Detalle";
import { DetalleVenta } from "@/domain/DTOs/Ventas/DetalleVenta";
import { FiltroVenta } from "@/domain/DTOs/Ventas/FiltroVenta";
import { RetornaListaVentas } from "@/domain/Services/VentaService";
import { useFiltroVentaStore } from "./Store/FiltroVenta.store";

export default function ReporteVentasPage() {
  const [open, setOpen] = useState(false);
  const [listaVentas, setListaVentas] = useState<DetalleVenta[]>([]);
  const [venta, setVenta] = useState<DetalleVenta>();

  const { RegistraCodPantalla } = useCodPantallaStore();

  const { Filtros, RegistraFiltros, ResetFiltros } = useFiltroVentaStore();

  useEffect(() => {
    RegistraCodPantalla({
      Codigo: "",
      Version: "V 1.0",
      Titulo: "Reporte Ventas",
    });
  }, []);

  const Buscar = async (filtro: FiltroVenta) => {
    setListaVentas(await RetornaListaVentas(filtro));
  };

  const AbreDetalleVenta = (item: DetalleVenta) => {
    setVenta(item);
    DetalleVentaVisible(true);
  };

  const DetalleVentaVisible = (flag?: boolean) => {
    if (!flag) {
      setVenta(undefined);
      setOpen(false);

      if (Filtros) {
        Buscar(Filtros);
      }
    } else {
      setOpen(true);
    }
  };

  const columns: ColumnDef<DetalleVenta>[] = [
    {
      accessorKey: "Id",
      size: 50,
      header: "Id",
    },
    {
      accessorKey: "Fecha",
      header: "Fecha",
    },
    {
      accessorKey: "ClienteDsc",
      size: 450,
      header: "Cliente",
    },
    {
      accessorKey: "UsuarioId",
      size: 100,
      header: "Usuario",
    },
    {
      accessorKey: "TotalArticulos",
      size: 50,
      header: "Total Articulos",
    },
    {
      accessorKey: "TotalVenta",
      size: 50,
      header: "Total Venta",
    },
    {
      accessorKey: "Estado",
      size: 50,
      header: "Estado",
    },
    {
      header: "Acciones",
      size: 300,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="grid grid-cols-2 gap-3 w-52">
            <Receipt
              className="text-teal-600"
              onClick={async () => {
                AbreDetalleVenta(item);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <main className="grid grid-cols-1 gap-3 p-4">
      <div>
        <FiltrosVenta
          Buscar={Buscar}
          RegistraFiltros={RegistraFiltros}
          ResetFiltros={ResetFiltros}
        />
      </div>
      <div className="w-full">
        <TablaVentas columns={columns} data={listaVentas} />
      </div>
      {open ? (
        <ModalDetalleVenta
          setOpen={DetalleVentaVisible}
          ItemSeleccionado={venta}
        />
      ) : (
        <></>
      )}
    </main>
  );
}
