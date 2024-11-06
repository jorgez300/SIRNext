"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DatoGraficoUnaSerie } from "@/domain/DTOs/DatoGraficoUnaSerie.dto";




type GraficoLinealProps = {
  Title: string;
  SubTitle?: string;
  Info?: string;
  Period?: string;
  TituloSerieA: string;
  chartData: DatoGraficoUnaSerie[];
};

export function GraficoLineal(props: Readonly<GraficoLinealProps>) {

  const chartConfig = {
    ValorA: {
      label: props.TituloSerieA,
      color: "hsl(var(--chart-2))",
    }
  } satisfies ChartConfig;


  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.Title}</CardTitle>
        <CardDescription>{props.SubTitle ?? ""}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={props.chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Fecha"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="ValorA"
              type="natural"
              fill="var(--color-ValorA)"
              fillOpacity={0.4}
              stroke="var(--color-ValorA)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {props.Info ?? ""}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
            {props.Period ?? ""}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
