import { Button } from "@/components/ui/button"
import { SignUpButton } from "@clerk/nextjs"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Crie sua conta
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
          Comece a organizar sua lista de compras agora mesmo gratuitamente.
        </p>

        <SignUpButton mode="modal">
          <Button className="w-full font-semibold" size="lg">
            Cadastrar-se gratuitamente
          </Button>
        </SignUpButton>
      </div>
    </div>
  )
}
