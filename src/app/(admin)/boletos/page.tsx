import { ActionsBoleto } from "@/components/actions-boleto";
import { ButtonCadastrar, DialogBoleto } from "@/components/form-boleto";
import { FormSearch } from "@/components/form-search";
import { PaginateBoletos } from "@/components/paginate-boletos";
import { AppTableHead } from "@/components/table-head";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Api from "@/lib/api";
import { format, parse, subDays } from "date-fns";
import { orderBy } from "lodash";


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

export default async function BoletosPage({ searchParams }: { searchParams: SearchParams }) {

    const { start = defaultStart, end = defaultEnd, sort = 'id', order = 'asc', page = '1' } = await searchParams

    const parsedStart = parse(start, 'dd/MM/yyyy', new Date());
    const parsedEnd = parse(end, 'dd/MM/yyyy', new Date());

    const { data } = await Api.get<SearchResult>("/search", {
        params: {
            start: format(parsedStart, 'yyyy-MM-dd'),
            end: format(parsedEnd, 'yyyy-MM-dd'),
            page: page
        }
    })

    return <div>
        <DialogBoleto />
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <FormSearch defaultStart={defaultStart} defaultEnd={defaultEnd} />
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg">Total: <span className="font-bold">{data.sum.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></h1>
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
                        {orderBy(data.data, sort, order).map((boleto: any) => (
                            <TableRow key={boleto.id}>
                                <TableCell>{boleto.id}</TableCell>
                                <TableCell>{boleto.description}</TableCell>
                                <TableCell>{format(String(boleto.due), 'dd/MM/yyyy')}</TableCell>
                                <TableCell className="text-right">{boleto.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                <TableCell className="text-right">

                                    <ActionsBoleto boleto={boleto} />

                                </TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>


            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="flex justify-between items-center w-full">
                    <span className="text-sm text-stone-400">Filtrando {data.meta.total} boletos em {data.meta.lastPage} páginas entre {parsedStart.toLocaleDateString('pt-BR')} a {parsedEnd.toLocaleDateString('pt-BR')}</span>
                    {data.meta.lastPage > 1 && (
                        <PaginateBoletos pages={data.meta.lastPage} />
                    )}
                </div>
            </CardFooter>
        </Card>
    </div>
}