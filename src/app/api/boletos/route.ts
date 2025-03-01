import { auth } from "@/auth";
import Api from "@/lib/api";

export  async function GET(req: Request) {
    const session = await auth()
    
    const boletos = await Api.get('boletos')

    return Response.json(boletos.data);
}

export  async function POST(req: Request) {

    const data = await req.json();

    const response = await Api.post('/boletos', data);

    return Response.json(response.data);
}