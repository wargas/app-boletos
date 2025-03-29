import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import bcryptjs from 'bcryptjs';
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {

    const data = await req.json() as User

    if(!data.password) {
        throw new Error("NOT PROVIDED PASSWORD")
    }

    data.password = await bcryptjs.hash(data.password, 10)

    const user = await prisma.user.create({
        data
    })

    return Response.json(data)
}