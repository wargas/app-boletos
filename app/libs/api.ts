import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ResponseSearch } from "../types";

const Api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})

Api.interceptors.request.use(async (config) => {

    const cookiesStore = await cookies()

    config.headers.Authorization = `Bearer ${cookiesStore.get('token')?.value}`


    return config
}, error => {

    throw error
})

Api.interceptors.response.use(config => config, error => {

    if (error.status == 401) {
        console.log('redirect from interceptor')
        return redirect('/login?id=interceptor')
    }

    throw error
})

export const getUser = async () => {
    try {


        const { data } = await Api.get('me')

        return data as { fullName: string };

    } catch (error) {
        const e = btoa(JSON.stringify(error))
        console.log('redirect from /me')
        redirect('/login?id='+e)
    }
}

export const getBoletos = async () => {
    return await Api.get<ResponseSearch>('search');
}


export default Api;