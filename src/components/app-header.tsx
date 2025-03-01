"use client"
import { Sair } from "@/app/(auth)/login/actions"
import { BarcodeIcon, ChevronsUpDown, LogOut } from "lucide-react"
import { User } from "next-auth"
import Link from "next/link"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"


type Props = {
    user: User
}
export function AppHeader({ user }: Props) {
    return <header className="absolute top-0 shadow-sm gap-4 left-0 right-0 h-14 bg-white flex items-center px-4">
        <div>
            <Link className="font-extrabold text-2xl" href={'/'}>CAIXAQUI</Link>
        </div>
        <div>
            <Button variant={'ghost'} asChild>
                <Link href={'/boletos'}><BarcodeIcon /> Boletos</Link>
            </Button>
        </div>
        <div className="ml-auto flex text-sm items-center">
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
    </header>
}