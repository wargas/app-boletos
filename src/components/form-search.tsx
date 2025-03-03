"use client"

import { FilterIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { setSearchParam } from "./search-query"
import { Button } from "./ui/button"
import { InputDate } from "./ui/input-date"

type Props = {
    defaultStart: string,

    defaultEnd: string
}

export function FormSearch({defaultStart, defaultEnd}: Props) {

    const params = useSearchParams()

    const {register, handleSubmit, watch} = useForm({
        defaultValues: {
            start: params.get('start') || defaultStart,
            end: params.get('end') || defaultEnd
        }
    })

    const onSubmit = useCallback((values:any) => {
        setSearchParam({...values, page: '1'})
    }, [params])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
            <InputDate {...register('start')} placeholder="inicio" />
            <InputDate {...register('end')} placeholder="fim" />
            <Button variant={'outline'} type="submit">
                <FilterIcon /> Filtrar
            </Button>
        </form>
    )
}