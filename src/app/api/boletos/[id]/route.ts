import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("USER NOT AUTHENTICAD")
    }
    const id = (await params).id
    const boleto = await prisma.boleto.findFirst({
        where: {
            user_id: { equals: session.user.id || '' },
            id
        }
    })

    return Response.json({ ...boleto, value: boleto?.value.toNumber() });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("USER NOT AUTHENTICAD")
    }

    const id = (await params).id

    const request = await prisma.boleto.delete({
        where: {
            user_id: { equals: session.user.id || '' },
            id
        }
    })

    return Response.json(request);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("USER NOT AUTHENTICAD")
    }

    const id = (await params).id

    const data = await req.json()

    data.due = new Date(data.due)

    const update = await prisma.boleto.update({
        data,
        where: {
            user_id: { equals: session.user.id || '' },
            id
        }
    })

    return Response.json(update);
}