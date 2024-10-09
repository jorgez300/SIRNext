"use client";

import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function InfoUsuario() {
  const router = useRouter();
  function handleClickSalir() {
    router.push("/Login");
  }

  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Informacion</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Actualizar contrasena</DropdownMenuItem>
          <DropdownMenuItem>Soporte</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleClickSalir}>
            Cerrar sesion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
