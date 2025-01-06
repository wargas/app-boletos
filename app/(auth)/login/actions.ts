'use server'

import Api from "@/app/libs/api"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function fazerLogin() {

    const {data} = await Api.post('auth', {
        email: 'admin@deltex.com.br',
        password: 'admin'
    })

    const cookiesStore = await cookies()

    cookiesStore.set('token', data.token)

    redirect('/boletos')
}

export async function fazerLogout() {
    const cookiesStore = await cookies()

    cookiesStore.delete('token')

    redirect('/login')
}