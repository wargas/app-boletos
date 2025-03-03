"use server"
import { signIn, signOut } from "@/auth";
import { get } from "lodash";

export async function fazerLogin(state: any, data: FormData) {

    try {

        await signIn('credentials', {
            email: data.get('email'),
            password: data.get('password'),
            redirect: false
        })

        return { error: false, message: 'logado' }

    } catch (error: any) {
        if(get(error, 'type') == 'CredentialsSignin') {
            return {error: true, email: data.get('email'), message: 'Email ou senha incorretos'}
        }
        return { error: true, email: data.get('email'), message: 'Ocorreu um erro interno' }

    }
}

export async function Sair() {
    return signOut()
}