"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  function handleClickLogin() {
    router.push("/Inicio");
  }

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Iniciar sesion</h1>
        <p className="text-balance text-muted-foreground">
          Ingrese con su cuenta de usuario
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Usuario</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Clave</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="button" className="w-full" onClick={handleClickLogin}>
          Ingresar
        </Button>
      </div>
    </div>
  );
}
