import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BadgeCheck, CircleAlert, TriangleAlert, OctagonX } from "lucide-react";

type AlertaAceptarCancelar = {
  Titulo: string;
  Mensaje: string;
  Tipo: "Error" | "Advertencia" | "Confirmacion" | "Ok";
  TextoAceptar?: string;
  TextoCancelar?: string;
  AccionAceptar: () => void;
  AccionCancelar: () => void;
  open: boolean;
  setOpen: (flag: boolean) => void;
};

const RetornaIconoTipo = (
  Tipo: "Error" | "Advertencia" | "Confirmacion" | "Ok"
) => {
  if (Tipo == "Error") {
    return <OctagonX className="mr-2 text-red-500" size={60} />;
  }
  if (Tipo == "Advertencia") {
    return <TriangleAlert className="mr-2 text-amber-400" size={60} />;
  }
  if (Tipo == "Confirmacion") {
    return <CircleAlert className="mr-2 text-sky-400" size={60} />;
  }
  if (Tipo == "Ok") {
    return <BadgeCheck className="mr-2 text-emerald-500" size={60} />;
  }
};

export function AlertaAceptarCancelar(props: AlertaAceptarCancelar) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="grid justify-items-center">
            <div>{RetornaIconoTipo(props.Tipo)}</div>
          </div>
          <AlertDialogTitle>{props.Titulo}</AlertDialogTitle>

          <AlertDialogDescription>{props.Mensaje}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            onClick={async () => {
              props.AccionAceptar();
            }}
          >
            {props.TextoAceptar ?? "Aceptar"}
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              props.AccionCancelar();
            }}
          >
            {props.TextoCancelar ?? "Cancelar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type AlertaAceptar = {
  Titulo: string;
  Mensaje: string;
  Tipo: "Error" | "Advertencia" | "Confirmacion" | "Ok";
  TextoAceptar?: string;
  AccionAceptar: () => void;
  open: boolean;
  setOpen: (flag: boolean) => void;
};

export function AlertaAceptar(props: AlertaAceptar) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="grid justify-items-center">
            <div>{RetornaIconoTipo(props.Tipo)}</div>
          </div>
          <AlertDialogTitle>{props.Titulo}</AlertDialogTitle>
          <AlertDialogDescription>{props.Mensaje}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            onClick={async () => {
              props.AccionAceptar();
            }}
          >
            {props.TextoAceptar ?? "Aceptar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
