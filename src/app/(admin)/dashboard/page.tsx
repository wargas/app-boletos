import { Chart1 } from "@/components/charts/chart-1";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Api from "@/lib/api";
import { addDays, formatDate } from "date-fns";
import { sumBy } from "lodash";

export default async function Dashboard() {
    const { data: boletos } = await Api.get<any[]>(`boletos`);

    const proximosDias = Array(30).fill("")
        .map((_, i) => i)
        .map(i => addDays(new Date(), i))
        .map(d => formatDate(d, 'yyyy-MM-dd'))
        .map(d => {

            const list = boletos.filter(b => b.due == d)
            const value = sumBy(list, 'value')

            return {
                date: d,
                data: formatDate(d, 'd/M'),
                value: value,
                count: list.length
            }
        })


    return <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12" >
            <CardHeader>
                <CardTitle>Valor Boletos</CardTitle>
                <CardDescription>Próximos 30 dias</CardDescription>
            </CardHeader>
            <CardContent >
                <Chart1 data={proximosDias} />
            </CardContent>
        </Card>

        

    </div>
}