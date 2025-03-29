"use client"
import EventEmitter from 'eventemitter3'

const emitter = new EventEmitter()

import { useQuery } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import { format, parse } from 'date-fns'
import { Loader2, Loader2Icon, Pencil, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { InputDate } from './ui/input-date'
import { Label } from './ui/label'
import { SheetFooter } from './ui/sheet'

type Props = {
    handleSave: () => void
}

export type Boleto = {
    id: number
    description: string
    value: number
    due: string
    userId: number
    createdAt: string
    updatedAt: string
}


export function FormBoleto({ id }: { id: string | null }) {

    const router = useRouter()

    const { register, handleSubmit, watch, setValue, formState } = useForm({
        defaultValues: {
            descricao: '',
            valor: '',
            data: ''
        }
    })

    const { isFetching } = useQuery({
        queryKey: ['boletos', id],
        queryFn: async () => {
            const response = await fetch(`/api/boletos/${id}`)

            if (response.status !== 200) {
                throw new Error("Erro na request")
            }

            const json = await response.json() as Boleto

            setValue('descricao', json.description)
            setValue('data', format(new Date(json.due), 'dd/MM/yyyy'))
            setValue('valor', json.value.toLocaleString('pt-BR', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            }))

            return json;

        },
        enabled: !!id && id?.length > 0
    })

    async function onSubmit(values: any) {
        
        const toastId = toast.loading('salvando boleto')
        try {
            const preparedValues = {
                description: values.descricao,
                due: format(parse(values.data, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd'),
                value: parseFloat(String(values.valor)
                    .replaceAll('.', '')
                    .replaceAll(',', '.'))
            }

            if (id) {

                console.log(preparedValues)
                await axios.put(`/api/boletos/${id}`, preparedValues)


            } else {
                await axios.post('/api/boletos', preparedValues)


            }
            toast.success('Boleto salvo com sucesso')


            router.refresh()

            emitter.emit('close', null)
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error('Erro ao salvar o boleto')
            } else {
                toast.error('Campos inválidos')

            }
            toast.dismiss(toastId)
        } finally {
            toast.dismiss(toastId)
        }
    }


    const onInputValorChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/\D/g, "")

        const numericValue = parseFloat(rawValue) / 100;

        setValue('valor', numericValue
            .toLocaleString('pt-BR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }, [])



    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 relative'>
            {isFetching && (
                <div className='absolute inset-[-10px] bg-white flex justify-center items-center'>
                    <Loader2Icon className='animate-spin' />
                </div>
            )}
            <div>
                <Label>Descrição</Label>
                <Input autoComplete='off' {...register('descricao')} />
            </div>
            <div>
                <Label>Data</Label>

                <InputDate {...register('data')} />
            </div>
            <div>
                <Label>Valor</Label>
                <Input {...register('valor', {
                    onChange: onInputValorChange
                })} />
            </div>
            <SheetFooter className='mt-6'>
                <Button disabled={formState.isSubmitting} className='w-full'>
                    {formState.isSubmitting && (

                        <Loader2 className='animate-spin' />
                    )}
                    Salvar
                </Button>
            </SheetFooter>
        </form>
    )
}

export function DialogBoleto() {

    const [open, setOpen] = useState(false)
    const [boleto, setBoleto] = useState<string>('')

    useEffect(() => {

        emitter.on('open', (boleto) => {
            setBoleto(boleto)
            setOpen(!open)
        })

        emitter.on(`close-sheet`, () => {
            setOpen(false)
        })

        return () => {
            emitter.off('open')
            emitter.off('close-sheet')
        }

    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader className='mb-4'>
                    <DialogTitle>Cadastrar boleto</DialogTitle>
                    <DialogDescription>
                        Informe os dados do boleto para cadastrar
                    </DialogDescription>
                </DialogHeader>
                <FormBoleto id={boleto} />
            </DialogContent>

        </Dialog>
    )
}

export function ButtonEditar({ id }: { id: string }) {
    return <Button onClick={() => openDialog(id)} size={'icon'} variant={'ghost'}>
        <Pencil />
    </Button>
}

export function ButtonCadastrar() {
    return <Button onClick={() => openDialog()} variant={'default'}>
        <PlusIcon /> Cadastrar
    </Button>
}

export function openDialog(id: string | null = null) {

    emitter.emit(`open`, id);

    return new Promise(acc => {
        emitter.on('close', () => {
            emitter.emit(`close-sheet`, null)
            acc(null)
        })
    })
}