import { Sair } from "@/app/(auth)/login/actions";
import { redirect } from "next/navigation";

export  async function GET(req: Request) {
    await Sair()
    redirect('/login')
}