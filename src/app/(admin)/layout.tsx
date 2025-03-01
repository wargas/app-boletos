import { auth } from "@/auth";
import { AppHeader } from "@/components/app-header";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";

type Props = Readonly<{
    children: React.ReactNode;
}>

export default async function LayoutAdmin({ children }: Props) {

    const session = await auth()

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <div className="bg-neutral-50 h-screen w-full pt-16">
            <AppHeader user={session?.user} />
            <div className="container mx-auto mt-4">
                {children}
            </div>
            <Toaster />
        </div>
    )
}