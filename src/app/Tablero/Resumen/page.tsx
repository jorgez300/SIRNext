import { GraficoLineal } from "./Components/GraficoLineal";
import Kpi from "./Components/KPI";

export default function ResumenPage() {
  return (
    <main className="flex flex-col">
      <div className="grid grid-cols-5 gap-4 my-1">
        <Kpi
          Title="Total Ventas"
          Value="$30,000"
          Subtitle="Monto total de las ventas realizadas en el mes"
        />
        <Kpi
          Title="Operaciones de venta"
          Value="30"
          Subtitle="Cantidad de ventas realizadas"
        />
        <Kpi
          Title="Items en inventario"
          Value="500"
          Subtitle="Cantidad de articulos en inventario"
        />
        <Kpi
          Title="Costos operativos"
          Value="$5,000"
          Subtitle="Costos de funcionamiento"
        />
        <Kpi
          Title="Ganancia bruta"
          Value="$10,000"
          Subtitle="Valor reflejado en base a la diferencia costo del producto y pvp"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 my-1">
        <GraficoLineal />
        <GraficoLineal />
        <GraficoLineal />
        <GraficoLineal />
        <GraficoLineal />
      </div>
    </main>
  );
}
