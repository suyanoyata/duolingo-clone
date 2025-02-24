import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditUnitFormData, EditUnitSchema } from "@/types/Forms";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUnit } from "@/actions/admin/admin.actions";
import { FieldError } from "@/components/ui/field-error";
import { toast } from "sonner";
import { Unit } from "@prisma/client";

const editUnitFields = [
  {
    name: "name",
    label: "Назва розділу",
    placeholder: "Наприклад: Вивчіть базові речення",
  },
  {
    name: "description",
    label: "Опис розділу",
    placeholder: "Наприклад: В цьому розділі ви навчитесь...",
  },
];

export const CreateUnitComponent = ({ languageCode }: { languageCode: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUnitFormData>({
    resolver: zodResolver(EditUnitSchema),
  });

  const client = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationKey: ["create-unit"],
    mutationFn: async (data: EditUnitFormData) => {
      const result = await createUnit(languageCode, data);

      if (result.success == false) {
        throw {
          message: result.message,
        };
      }

      return result.data;
    },
    onSuccess: (data) => {
      client.setQueryData(["units-list", languageCode], (prev: Unit[]) => [...prev, data]);
      client.refetchQueries({
        queryKey: ["units-list", languageCode],
      });
      setOpen(false);
    },
  });

  const onSubmit = (data: EditUnitFormData) => {
    toast.promise(mutateAsync(data), {
      loading: "Створюємо урок",
      success: "Урок створено",
      error: "Не вдалось створити урок",
    });
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="bg-green-500 p-3 rounded-lg my-3 relative">
        <p className="text-lg text-white font-bold">Створити урок</p>
        <DialogTrigger asChild>
          <Button size="sm" className="mt-1">
            Створити
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Створити урок</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            {editUnitFields.map((field) => (
              <div key={field.name}>
                <Input
                  label={field.label}
                  placeholder={field.placeholder}
                  {...register(field.name as "name")}
                />
                {errors[field.name as "name"] && (
                  <FieldError>{errors[field.name as "name"]?.message}</FieldError>
                )}
              </div>
            ))}
            <Button disabled={isPending} variant="primary" className="mt-2 w-full">
              Створити
            </Button>
            {error && <FieldError className="mt-1">{error.message}</FieldError>}
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
};
