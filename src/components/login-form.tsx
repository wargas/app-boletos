"use client"
import { fazerLogin } from "@/app/(auth)/login/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Loader2, OctagonAlert } from "lucide-react"
import Form from 'next/form'
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const router = useRouter()
  const [state, dispach, isPending] = useActionState<any, any>(fazerLogin, { error: false, message: '' })

  if (state?.message == 'logado') {
    router.refresh()
    return <div className="w-full flex justify-center">
      <Loader2 className="animate-spin" />
    </div>
  }

  return (

    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Digite seu e-mail abaixo para fazer login na sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={dispach}>
            {state?.error && (
              <Alert className="mb-4" variant={'destructive'}>
                <OctagonAlert />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>{state?.message}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={state?.email || ''}
                  name="email"
                  placeholder="exemplo@exemplo.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && (
                  <Loader2 className="animate-spin" />
                )}
                Login
              </Button>

            </div>

          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
