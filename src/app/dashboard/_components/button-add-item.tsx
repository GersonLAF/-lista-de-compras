"use client"
import { addItem } from "@/actions/item_compra"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  title: z.string().min(3, "Seu item precisa ter no mínimo 3 caracteres"),
  prioridade: z.enum(["ALTA", "MÉDIA", "BAIXA"], {
    message: "Selecione uma prioridade",
  }),
})

export function ButtonAddItem() {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      prioridade: "BAIXA",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await addItem({
        title: data.title,
        prioridade: data.prioridade,
      });

      setOpen(false);
      form.reset();

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao criar o item."
      );
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-yellow-600 text-white hover:bg-yellow-700"
      >
        Adicionar Item
      </Button>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
        }}
      >
        <DialogContent>
          <DialogTitle></DialogTitle>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Seu Item
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Digite um item de compra..."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="prioridade"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="prioridade-select">
                      Prioridade
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="prioridade-select">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALTA">Alta</SelectItem>
                        <SelectItem value="MÉDIA">Média</SelectItem>
                        <SelectItem value="BAIXA">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <DialogFooter>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Limpar
              </Button>
              <Button
                type="submit"
                form="form-rhf-demo"
                className="bg-yellow-600 text-white hover:bg-yellow-700"
              >
                Criar
              </Button>
            </Field>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
