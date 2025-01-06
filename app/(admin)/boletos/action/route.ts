import Api from "@/app/libs/api";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest,) {
    const data = await request.formData()

    try {


        await Api.post('boletos', {
            description: data.get('description'),
            due: data.get('due'),
            value: data.get('value'),
        })
        redirect('/boletos')
    } catch (error) {
        const e = btoa(JSON.stringify(error))
        redirect(`/boletos?e=${e}`)
    }

}