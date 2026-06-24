import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Bem-vindo de volta
        </h1>
        <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          Faça login para acessar sua lista de compras.
        </p>

        <SignInButton mode="modal">
          <Button className="w-full font-semibold" size="lg">
            Entrar na minha conta
          </Button>
        </SignInButton>
      </div>
    </div>
  )
}
