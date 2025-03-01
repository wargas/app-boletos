import { auth } from "@/auth";
import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";

const Api = axios.create({
    baseURL: 'https://boletos-api.deltex.com.br/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

Api.interceptors.request.use(async (config) => {
    const session = await auth()

    if(session?.api_token) {
        config.headers.set('Authorization', `Bearer ${session.api_token}`)
    }

    return config;
}, null)

Api.interceptors.response.use(null,async (err:AxiosError) => {
    if(err.status == 401) {
       redirect('/api/logout')
    }
})

export default Api;