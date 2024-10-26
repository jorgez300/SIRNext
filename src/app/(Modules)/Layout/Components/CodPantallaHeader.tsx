"use client";

import { useCodPantallaStore } from "@/app/global/Store/CodPantalla.store";
import { Label } from "@/components/ui/label";


export default function CodPantallaHeader() {
  const { Pantalla } = useCodPantallaStore();

  return (
    <div className="ml-72">
      <Label className="font-semibold">{Pantalla ? Pantalla.Titulo : ""}</Label>
      <br />
      <Label className="text-sm font-light">
        {Pantalla ? Pantalla.Codigo + " " + Pantalla.Version : ""}
      </Label>
    </div>
  );
}
