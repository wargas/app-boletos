import Api from "@/lib/api";
import { NextRequest } from "next/server";

export  async function GET(req: Request) {
    return Response.json(req.url);
}

export  async function DELETE(_: NextRequest, {params: {id}}:any) {
    
    const request = await Api.delete(`boletos/${id}`)

    return Response.json(request.data);
}

export  async function PUT(req: NextRequest, {params: {id}}:any) {

    const data = await req.json();
    
    const request = await Api.put(`boletos/${id}`, data)

    return Response.json(request.data);
}