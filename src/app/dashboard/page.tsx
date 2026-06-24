import { deleteItem, toggleItem, updateItem } from "@/actions/item_compra"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { CheckIcon, PenIcon, TrashIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { ButtonAddItem } from "./_components/button-add-item"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/login")
  }

  const itens = await prisma.itemCompra.findMany({
    where: { userId },
  })

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex justify-between">
       
          <h1 className="text-2xl font-bold">Meus Itens de Compra</h1>

        <ButtonAddItem />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itens.map((itemCompra) => (
            <TableRow key={itemCompra.id}>
              <TableCell
                className={itemCompra.done ? "text-gray-500 line-through" : ""}
              >
                {itemCompra.title}
              </TableCell>
               <TableCell>{itemCompra.prioridade}</TableCell>
               
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <form
                    action={async () => {
                      "use server"
                      await toggleItem(itemCompra.id, itemCompra.done)
                    }}
                  >
                    <Button
                      variant={itemCompra.done ? "default" : "outline"}
                      size="icon-sm"
                      type="submit"
                    >
                      <CheckIcon />
                    </Button>
                  </form>

                  <form
                    action={async () => {
                      "use server"
                      await deleteItem(itemCompra.id)
                    }}
                  >
                    <Button variant="destructive" size="icon-sm" type="submit">
                      <TrashIcon />
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
