"use client"
import { Sair } from "@/app/(auth)/login/actions"
import { ChevronsUpDown, LogOut } from "lucide-react"
import { User } from "next-auth"
import Link from "next/link"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Separator } from "./ui/separator"


type Props = {
    user: User
}
export function AppHeader({ user }: Props) {
    return <header className="absolute top-0 shadow-sm gap-4 left-0 right-0  bg-white ">
        <div className="container flex items-center mx-auto h-14">
            <div>
                <Link className="font-extrabold text-2xl " href={'/dashboard'}>CAIXAQUI</Link>
            </div>
            <div className="ml-auto flex text-sm items-center gap-2">
                <Button variant={'ghost'} asChild>
                    <Link href={'/boletos'}>Boletos</Link>
                </Button>
                <Separator orientation="vertical" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'}>
                            {user.name} <ChevronsUpDown size={12} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-52" align="end">
                        <DropdownMenuItem onClick={() => Sair()}>
                            <LogOut /> Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </header>
}