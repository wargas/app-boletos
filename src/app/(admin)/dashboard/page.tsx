import { auth } from "@/auth";
import { Chart1 } from "@/components/charts/chart-1";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { addDays, formatDate, isSameDay, max, min } from "date-fns";
import { sumBy } from "lodash";

export default async function Dashboard() {
    const session = await auth()

    const days = Array(30).fill("")
        .map((_, i) => i)
        .map(i => addDays(new Date(), i))


    const boletos = await prisma.boleto.findMany({
        where: {
            user_id: session?.user?.id,
            due: { gte: min(days), lte: max(days) }
        }
    })


    // .map(d => formatDate(d, 'yyyy-MM-dd'))
    const proximosDias = days.map(d => {

        const list = boletos.filter(b => isSameDay(b.due, d))
            .map(i => ({ ...i, value: i.value.toNumber() }))
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