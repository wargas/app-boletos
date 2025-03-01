"use server"
import { signIn, signOut } from "@/auth";

export async function fazerLogin(state: any, data: FormData) {

    try {

        await signIn('credentials', data)

        return { error: false, message: 'logado' }

    } catch (error: any) {
        if (error.message == "NEXT_REDIRECT") {
            return { error: false, message: 'logado' }
        }
        return { error: true, email: data.get('email'), message: 'Credenciais invalidas' }

    }
}

export async function Sair() {
    return signOut()
}