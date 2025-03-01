'use client'
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ButtonEditar } from "./form-boleto";
import { Button } from "./ui/button";
type Props = {
    boleto: any
}
export function ActionsBoleto({ boleto }: Props) {

    const router = useRouter()

    async function handleDelete() {
        const toastId = toast.loading('Excluindo')
        try {
            await axios.delete(`api/boletos/${boleto.id}`)
    
            toast.success(`Boleto excluído com sucesso`)
    
            router.refresh()
        } catch (error) {
            toast.error(`Erro ao tentar excluir`)
        } finally {
            toast.dismiss(toastId)
        }
    }

    return (
        <div className="flex justify-end gap-1">
            <Button onClick={handleDelete} size={'icon'} variant={'ghost'}>
                <TrashIcon />
            </Button>
            <ButtonEditar boleto={boleto} />
        </div>
    )
}