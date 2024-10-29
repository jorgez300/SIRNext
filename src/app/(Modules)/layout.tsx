import "../globals.css";

import Link from "next/link";
import {
  Handshake,
  Wrench,
  Receipt,
  ClipboardPlus,
  BadgeDollarSign,
  PackageSearch,
  Truck,
  ChartColumn,
  Hotel,
  FileBox,
  KeyRound,
  ReceiptCent,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import InfoUsuario from "./Layout/Components/InfoUsuario";
import CodPantallaHeader from "./Layout/Components/CodPantallaHeader";

import type { Metadata } from "next";
import { ObtieneRolUsuario } from "@/domain/Services/UsuarioService";

export const metadata: Metadata = {
  title: "SIR",
  description: "...",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rol = await ObtieneRolUsuario();

  const MenuAdmin = () => {
    return (
      <nav className="grid gap-6 text-lg font-medium">
        <Link
          href="/Tablero/Resumen"
          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
        >
          <Wrench className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">SIR</span>
        </Link>
        <Link
          href="/Mantenedores/Clientes"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Handshake className="h-5 w-5" />
          Clientes
        </Link>
        <Link
          href="/Mantenedores/Productos/Lista"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <PackageSearch className="h-5 w-5" />
          Lista Productos
        </Link>
        <Link
          href="/Reportes/Productos"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <FileBox className="h-5 w-5" />
          Reporte Productos
        </Link>
        <Link
          href="/Operaciones/Ventas"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <BadgeDollarSign className="h-5 w-5" />
          Ventas
        </Link>
        <Link
          href="/Reportes/Ventas"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <ClipboardPlus className="h-5 w-5" />
          Reporte Ventas
        </Link>
        <Link
          href="/Operaciones/Compras"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Truck className="h-5 w-5" />
          Compras
        </Link>
        <Link
          href="/Reportes/Compras"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Receipt className="h-5 w-5" />
          Reporte Compras
        </Link>
        <Link
          href="/Tablero/Resumen"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <ChartColumn className="h-5 w-5" />
          Tablero Resumen
        </Link>
        <Link
          href="/Mantenedores/Proveedores"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Hotel className="h-5 w-5" />
          Proveedores
        </Link>
        <Link
          href="/Mantenedores/Costos"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <ReceiptCent className="h-5 w-5" />
          Costos
        </Link>
        <Link
          href="/Mantenedores/Usuarios"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <KeyRound className="h-5 w-5" />
          Usuarios
        </Link>
      </nav>
    );
  };

  const MenuVendedor = () => {
    return (
      <nav className="grid gap-6 text-lg font-medium">
        <Link
          href="/Tablero/Resumen"
          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
        >
          <Wrench className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">SIR</span>
        </Link>
        <Link
          href="/Mantenedores/Clientes"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Handshake className="h-5 w-5" />
          Clientes
        </Link>
        <Link
          href="/Reportes/Productos"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <FileBox className="h-5 w-5" />
          Reporte Productos
        </Link>
        <Link
          href="/Operaciones/Ventas"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <BadgeDollarSign className="h-5 w-5" />
          Ventas
        </Link>
        <Link
          href="/Operaciones/Compras"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Truck className="h-5 w-5" />
          Compras
        </Link>
        <Link
          href="/Tablero/Resumen"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <ChartColumn className="h-5 w-5" />
          Tablero Resumen
        </Link>
        <Link
          href="/Mantenedores/Proveedores"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Hotel className="h-5 w-5" />
          Proveedores
        </Link>
      </nav>
    );
  };

  return (
    <body>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4">
        <div className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background sm:static sm:h-auto sm:border-0 sm:bg-transparent">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Menu</Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <SheetTitle className="hidden"></SheetTitle>
                <SheetDescription className="hidden"></SheetDescription>
                {rol == "ADMIN" ? MenuAdmin() : MenuVendedor()}
              </SheetContent>
            </Sheet>
            <div className="grid grid-cols-12 gap-2 w-full">
              <div className="col-span-11">
                <CodPantallaHeader />
              </div>
              <div className="col-span-1 flex justify-end">
                <InfoUsuario />
              </div>
            </div>
          </header>
          <Separator className="my-2" />
          {children}
        </div>
      </div>
    </body>
  );
}
