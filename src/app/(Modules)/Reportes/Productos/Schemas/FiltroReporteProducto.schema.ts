import { z } from "zod";

export const FiltroReporteProductoSchema = z.object({
  TipoReporte: z.string().optional(),
  Ubicacion: z.string().optional(),
});
