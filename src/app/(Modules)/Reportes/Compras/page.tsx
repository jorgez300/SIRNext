"use client";

import { Receipt } from "lucide-react";
import { useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { useCodPantallaStore } from "@/app/global/Store/CodPantalla.store";
import { DetalleCompra } from "@/domain/DTOs/Compras/DetalleCompra";
import { FiltroCompra } from "@/domain/DTOs/Compras/FiltroCompra";
import { RetornaListaCompras } from "@/domain/Services/CompraService";
import { useFiltroCompraStore } from "./Store/FiltroCompra.store";
import FiltrosCompra from "./Components/Filtros";
import { TablaCompras } from "./Components/Tabla";
import ModalDetalleCompra from "./Components/Detalle";

export default function ReporteComprasPage() {
  const [open, setOpen] = useState(false);
  const [listaCompras, setListaCompras] = useState<DetalleCompra[]>([]);
  const [compra, setCompra] = useState<DetalleCompra>();

  const { RegistraCodPantalla } = useCodPantallaStore();

  const { Filtros, RegistraFiltros, ResetFiltros } = useFiltroCompraStore();

  useEffect(() => {
    RegistraCodPantalla({
      Codigo: "",
      Version: "V 1.0",
      Titulo: "Reporte Compras",
    });
  }, []);

  const Buscar = async (filtro: FiltroCompra) => {
    setListaCompras(await RetornaListaCompras(filtro));
  };

  const AbreDetalleCompra = (item: DetalleCompra) => {
    setCompra(item);
    DetalleCompraVisible(true);
  };

  const DetalleCompraVisible = (flag?: boolean) => {
    if (!flag) {
      setCompra(undefined);
      setOpen(false);

      if (Filtros) {
        Buscar(Filtros);
      }
    } else {
      setOpen(true);
    }
  };

  const columns: ColumnDef<DetalleCompra>[] = [
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
      accessorKey: "ProveedorDsc",
      size: 450,
      header: "Proveedor",
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
      accessorKey: "TotalCompra",
      size: 50,
      header: "Total Compra",
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
                AbreDetalleCompra(item);
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
        <FiltrosCompra
          Buscar={Buscar}
          RegistraFiltros={RegistraFiltros}
          ResetFiltros={ResetFiltros}
        />
      </div>
      <div className="w-full">
        <TablaCompras columns={columns} data={listaCompras} />
      </div>
      {open ? (
        <ModalDetalleCompra
          setOpen={DetalleCompraVisible}
          ItemSeleccionado={compra}
        />
      ) : (
        <></>
      )}
    </main>
  );
}
