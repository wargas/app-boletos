import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export  async function GET(req: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("USER NOT AUTHENTICAD")
    }
    
    const boletos = await prisma.boleto.findMany({
        where: {
            user_id: session?.user?.id
        }
    })

    return Response.json(boletos);
}

export  async function POST(req: Request) {

    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("USER NOT AUTHENTICAD")
    }

    const data = await req.json();
    data.user_id = session.user.id
    data.due = new Date(data.due)

    const boleto = await prisma.boleto.create({
        data,
    })

    return Response.json(boleto);
}