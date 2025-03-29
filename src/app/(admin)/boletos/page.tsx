import { auth } from "@/auth";
import { ActionsBoleto } from "@/components/actions-boleto";
import { ButtonCadastrar, DialogBoleto } from "@/components/form-boleto";
import { FormSearch } from "@/components/form-search";
import { PaginateBoletos } from "@/components/paginate-boletos";
import { AppTableHead } from "@/components/table-head";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { format, parse, subDays } from "date-fns";


type SearchResult = {
    sum: {
        value: number
    }
    meta: {
        total: number
        perPage: number
        currentPage: number
        lastPage: number
        firstPage: number
        firstPageUrl: string
        lastPageUrl: string
        nextPageUrl: any
        previousPageUrl: any
    }
    data: Array<{
        id: number
        description: string
        value: number
        due: string
        userId: number
        createdAt: string
        updatedAt: string
    }>
}

type SearchParams = Promise<{
    start?: string
    end?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    page?: string
}>

const defaultStart = format(subDays(new Date(), 30), 'dd/MM/yyyy')
const defaultEnd = format(new Date(), 'dd/MM/yyyy')
const PER_PAGE = 15

export default async function BoletosPage({ searchParams }: { searchParams: SearchParams }) {

    const session = await auth()

    const { start = defaultStart, end = defaultEnd, sort = 'id', order = 'asc', page = '1' } = await searchParams

    const skip = (parseInt(page) - 1) * PER_PAGE

    const parsedStart = parse(`${start}`, 'dd/MM/yyyy', new Date());
    const parsedEnd = parse(end, 'dd/MM/yyyy', new Date());

    parsedStart.setHours(0, 0, 1)
    parsedEnd.setHours(20, 59, 59)

    const where = {
        user_id: session?.user?.id,
        due: { gte: parsedStart, lte: parsedEnd }
    }

    const meta = await prisma.boleto.aggregate({
        _sum: {
            value: true
        },
        _count: {
            id: true
        },
        where
    })

    const data = await prisma.boleto.findMany({
        take: PER_PAGE,
        skip,
        where,
        orderBy: { due: 'desc'}
    })

    const pages = Math.floor(meta._count.id / PER_PAGE) + (meta._count.id % PER_PAGE === 0 ? 0 : 1)

    return <div>
        <DialogBoleto />
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <FormSearch defaultStart={defaultStart} defaultEnd={defaultEnd} />
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg">Total: <span className="font-bold">{meta._sum.value?.toNumber()?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></h1>
                        <ButtonCadastrar />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 border-t">
                <Table className="caption-bottom">
                    
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <AppTableHead name="id" label="ID" />
                            </TableHead>
                            <TableHead>
                                <AppTableHead name="description" label="Descrição" />
                            </TableHead>
                            <TableHead>
                                <AppTableHead name="due" label="Data" />
                            </TableHead>
                            <TableHead className="flex justify-end">
                                <AppTableHead name="value" label="Valor" />
                            </TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(b => ({...b, value: b.value.toNumber()})).map((boleto) => (
                            <TableRow key={boleto.id}>
                                <TableCell>{boleto.id.toString().substring(0, 5)}</TableCell>
                                <TableCell>{boleto.description}</TableCell>
                                <TableCell>{format(boleto.due, 'dd/MM/yyyy')} </TableCell>
                                <TableCell className="text-right">{boleto.value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                <TableCell className="text-right">

                                    <ActionsBoleto id={boleto.id} />

                                </TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>


            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="flex justify-between items-center w-full">
                    <span className="text-sm text-stone-400">Filtrando {meta._count.id} boletos em {pages} páginas entre {parsedStart.toLocaleDateString('pt-BR')} a {parsedEnd.toLocaleDateString('pt-BR')}</span>
                    {pages > 1 && (
                        <PaginateBoletos pages={pages} />
                    )}
                </div>
            </CardFooter>
        </Card>
    </div>
}