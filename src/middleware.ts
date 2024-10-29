import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./domain/Helpers/SessionHelper";

const protectedRoutes = [
  "/Mantenedores/Clientes",
  "/Mantenedores/Productos/Lista",
  "/Mantenedores/Productos/Administrar",
  "/Reportes/Productos",
  "/Operaciones/Ventas",
  "/Reportes/Ventas",
  "/Operaciones/Compras",
  "/Reportes/Compras",
  "/Tablero/Resumen",
  "/Mantenedores/Costos",
  "/Mantenedores/Proveedores",
  "/Mantenedores/Usuarios",
  "/Inicio",
  "/"
];
const publicRoutes = ["/Login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);


  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/Login", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/Tablero/Resumen", req.nextUrl));
  }

  return NextResponse.next();
}
