'use client'

import { ChevronDown, ChevronUp } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

type Props = {
    label: string,
    name: string
}

export function AppTableHead({ label, name }: Props) {
    const params = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const sort = params.get('sort') || ''
    const order = params.get('order') || 'asc'

    const handleClick = useCallback(() => {
        const qs = new URLSearchParams(params)

        if(sort == name) {
            if(order == 'asc') {
                qs.set('order', 'desc')
            } else {
                qs.delete('sort')
                qs.delete('order')
            }
        } else {
            qs.set('sort', name)
            qs.set('order', 'asc')

        }


        router.replace(`${pathname}?${qs.toString()}`)
    }, [sort, order]) 
     
    return <div onClick={handleClick} className="cursor-pointer flex items-center">
        {label} 
        {sort == name && order == 'asc' && (
            <ChevronDown size={15} />
        )}
         {sort == name && order == 'desc' && (
            <ChevronUp size={15} />
        )}
    </div>
}