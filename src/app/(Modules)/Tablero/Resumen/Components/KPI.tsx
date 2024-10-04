import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KpiProps = {
  Value: string;
  Title: string;
  Subtitle?: string;
};

export default function Kpi(props: Readonly<KpiProps>) {
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.Title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{props.Value}</div>
        <p className="text-xs text-muted-foreground">{props.Subtitle ?? ""}</p>
      </CardContent>
    </Card>
  );
}
