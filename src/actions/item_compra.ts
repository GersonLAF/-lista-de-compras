"use server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addItem(data: { title: string; prioridade: 'ALTA' | 'MÉDIA' | 'BAIXA' }) {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/login")
  }

    if (data.prioridade === 'ALTA') {
    const prioridadeAltaPendente = await prisma.itemCompra.count({
      where: {
        userId: userId,
        prioridade: 'ALTA',
        done: false 
      }
    });

    if (prioridadeAltaPendente >= 5) {
      throw new Error("Você possui 5 itens com prioridade ALTA pendentes. Você precisa concluir ou remover algum para adicionar um novo.");
    }
  }

  await prisma.itemCompra.create({
    data: {
      title: data.title,
      prioridade: data.prioridade,
      userId: userId
    }
  });

  revalidatePath("/dashboard")
}

console.log(addItem)

export async function deleteItem(id: string) {
  await prisma.itemCompra.delete({ where: { id } })
  revalidatePath("/dashboard")
}

export async function toggleItem(id: string, currentStatus: boolean) {
  await prisma.itemCompra.update({
    where: { id },
    data: { done: !currentStatus },
  })
  revalidatePath("/dashboard")
}

type UpdateItemProps = {
  id: string;
  title?: string;
  prioridade?: "ALTA" | "MÉDIA" | "BAIXA";
  done?: boolean;
}

export async function updateItem(data: UpdateItemProps) {
  const { userId } = await auth()
  
  if (!userId) {
    return { error: "Usuário não autorizado." };
  }

  const itemAtual = await prisma.itemCompra.findUnique({
    where: { id: data.id }
  });

  if (!itemAtual || itemAtual.userId !== userId) {
    return { error: "Item não encontrado." };
  }

  const novaPrioridade = data.prioridade ?? itemAtual.prioridade;
  const novoStatus = data.done ?? itemAtual.done;

  const vaiFicarAltoPendente = novaPrioridade === "ALTA" && novoStatus === false;
  const jaEraAltoPendente = itemAtual.prioridade === "ALTA" && itemAtual.done === false;

  if (vaiFicarAltoPendente && !jaEraAltoPendente) {
    const itensAltosPendentes = await prisma.itemCompra.count({
      where: {
        userId: userId,
        prioridade: "ALTA",
        comprado: false
      }
    });

    if (itensAltosPendentes >= 5) {
      return { 
        error: "Limite atingido. Conclua ou remova um item de prioridade ALTA antes de mudar a prioridade deste." 
      };
    }
  }

  await prisma.itemCompra.update({
    where: { id: data.id },
    data: {
      title: data.title,
      prioridade: data.prioridade,
      done: data.done
    }
  });
  revalidatePath("/"); 

  return { success: true };
}