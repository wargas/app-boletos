'use client'
import EventEmitter from "eventemitter3"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const Events = new EventEmitter()

export function SearchQuery() {

    const params = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {

        Events.on('set-query', data => {
            const _params = new URLSearchParams(params.toString())

            Object.keys(data).forEach((key) => {
                _params.set(key, data[key])
            })

            router.replace(`${pathname}?${_params.toString()}`)
        })

    }, [params, pathname])

    return <>
    </>
}

export function setSearchParam(data: any) {
    Events.emit('set-query', data)
}