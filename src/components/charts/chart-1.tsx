"use client"

import { formatDate } from "date-fns"
import { useRouter } from "next/navigation"
import { Bar, BarChart, XAxis } from "recharts"
import { setSearchParam } from "../search-query"
import { Button } from "../ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"

type Chart1Props = {
    data: {
        data: string,
        value: number,
        count: number
    }[]
}

export function Chart1({ data }: Chart1Props) {

    const router = useRouter()

    const config = {
        value: {
            label: 'Valor: '
        }
    }


    function handleClickBar(data: any, index: number): void {
        const dateFormat = formatDate(data.date + ' 03:00:01', 'dd/MM/yyyy')

        router.replace(`/boletos?start=${dateFormat}&end=${dateFormat}&page=1`)
    }

    return (
        <>
            <ChartContainer config={config} className="w-full h-48">
                <BarChart data={data}>
                    <XAxis dataKey={'data'} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent formatter={(v, n, i) => `Valor: ${v.toLocaleString('pt-BR')} | Total: ${i.payload.count}`} label={"Valor"} />} />
                    <Bar onClick={handleClickBar} dataKey={'value'} fill="blue" radius={5} />
                </BarChart>
            </ChartContainer>
            <Button onClick={() => setSearchParam({page: 'dashboard'})}>Set query</Button>
        </>
    )
}