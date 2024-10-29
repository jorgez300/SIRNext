import { FiltroReporteProducto } from "@/domain/DTOs/Productos/FiltroReporteProducto";
import { GetReporteProductos } from "@/domain/Services/ProductoService";

export async function GET() {

  const filtro: FiltroReporteProducto = {
    Ubicacion: "TODOS"
  }

  const data = await GetReporteProductos(filtro)


  return Response.json({ data: data });
}
