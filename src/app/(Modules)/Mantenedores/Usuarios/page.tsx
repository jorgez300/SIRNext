"use client";
import { Button } from "@/components/ui/button";

import { ArrowUpDown, PlusIcon, Edit2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { useCodPantallaStore } from "@/app/global/Store/CodPantalla.store";
import { useAdministraUsuarioStore } from "./Store/AdministraUsuario";
import { Usuario } from "@/domain/Models/Usuarios/Usuario";
import { GetUsuarioById, GetUsuarios } from "@/domain/Services/UsuarioService";
import { TablaUsuarios } from "./Components/Tabla";
import MantenedorUsuario from "./Components/Mantenedor";

export default function UsuariosPage() {
  const [open, setOpen] = useState(false);
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);

  const { RegistraUsuario, ResetUsuario } = useAdministraUsuarioStore();

  const { RegistraCodPantalla } = useCodPantallaStore();

  useEffect(() => {
    RegistraCodPantalla({
      Codigo: "",
      Version: "V 0.1",
      Titulo: "Administrar Usuarios",
    });
    Buscar();
    ResetUsuario();
  }, []);

  const Buscar = async () => {
    setListaUsuarios(await GetUsuarios());
  };

  const ModalVisible = async (flag: boolean, id?: string | undefined) => {
    if (!flag) {
      await RegistraUsuario(undefined);
      await Buscar();
      setOpen(flag);
    } else if (!id) {
      await RegistraUsuario(undefined);
      setOpen(flag);
    } else {
      await RegistraUsuario(await GetUsuarioById(id));
      setOpen(flag);
    }
  };

  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: "Id",
      size: 300,
      header: "Usuario",
    },
    {
      accessorKey: "Nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Rol",
      size: 300,
      header: "Rol",
    },
    {
      header: "Acciones",
      size: 300,
      cell: ({ row }) => {
        const usuario = row.original;
        return (
          <div className="grid grid-cols-2 gap-3 w-52">
            <Edit2Icon
              className="text-teal-600"
              onClick={async () => {
                await ModalVisible(true, usuario.Id);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <main className="grid grid-cols-1 gap-3 p-4">
      <div className="flex justify-end">
        <Button
          className="bg-teal-600"
          onClick={() => {
            setOpen(true);
          }}
        >
          <PlusIcon className="mr-2" />
          Agregar
        </Button>
      </div>

      <div className="w-full">
        <TablaUsuarios columns={columns} data={listaUsuarios} />
      </div>
      {open ? <MantenedorUsuario setOpen={ModalVisible} /> : <></>}
    </main>
  );
}
