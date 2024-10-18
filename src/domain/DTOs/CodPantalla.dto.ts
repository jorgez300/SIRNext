export interface CodPantalla {
  Titulo: string;
  Codigo: string;
  Version: string;
}

export interface CodPantallaStore {
  Pantalla?: CodPantalla;
  RegistraCodPantalla: (pantalla: CodPantalla) => Promise<void>;
}
