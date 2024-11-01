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
import { deleteSession } from "@/domain/Helpers/SessionHelper";

export default function InfoUsuario() {
  const router = useRouter();
  const handleClickSalir = async () => {
    await deleteSession();
    router.push("/Login");
  };

  const handleDescargaApk = async () => {

    window.open('/SirAndroid.apk', '_blank');


  };

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
          <DropdownMenuItem onClick={handleDescargaApk}>
            SIR Android
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleClickSalir}>
            Cerrar sesion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
