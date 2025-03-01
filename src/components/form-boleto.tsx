"use client"
import EventEmitter from 'eventemitter3'

const emitter = new EventEmitter()

import axios, { isAxiosError } from 'axios'
import { format, formatDate, parse } from 'date-fns'
import { Loader2, Pencil, PlusIcon } from 'lucide-react'
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


export function FormBoleto({ boleto }: { boleto: Boleto | null }) {

    const router = useRouter()

    const { register, handleSubmit, watch, setValue, formState } = useForm({
        defaultValues: {
            descricao: boleto?.description || '',
            valor: boleto?.value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) || '',
            data: boleto ? formatDate(parse(boleto.due, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : ''
        }
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

            if (boleto) {
                await axios.put(`/api/boletos/${boleto.id}`, preparedValues)


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
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>

            <div>
                <Label>Descrição</Label>
                <Input {...register('descricao')} />
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
    const [boleto, setBoleto] = useState<any>(null)

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
                <FormBoleto boleto={boleto} />
            </DialogContent>

        </Dialog>
    )
}

export function ButtonEditar({ boleto }: any) {
    return <Button onClick={() => openDialog(boleto)} size={'icon'} variant={'ghost'}>
        <Pencil />
    </Button>
}

export function ButtonCadastrar() {
    return <Button onClick={() => openDialog()} variant={'default'}>
        <PlusIcon /> Cadastrar
    </Button>
}

export function openDialog(boleto: any = null) {

    emitter.emit(`open`, boleto);

    return new Promise(acc => {
        emitter.on('close', () => {
            emitter.emit(`close-sheet`, null)
            acc(null)
        })
    })
}