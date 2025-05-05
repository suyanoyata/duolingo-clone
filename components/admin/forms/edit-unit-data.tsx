"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { LoadingCircle } from "@/components/loading-overlay";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Unit } from "@prisma/client";
import { EditUnitFormData, EditUnitSchema } from "@/types/Forms";

import { deleteUnit, editUnit } from "@/actions/admin/admin.actions";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export const EditUnit = ({ unit, language }: { unit: Unit; language: string }) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
    watch,
    reset,
  } = useForm<EditUnitFormData>({
    resolver: zodResolver(EditUnitSchema),
    defaultValues: {
      name: unit.name,
      description: unit.description,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-unit"],
    mutationFn: async (data: EditUnitFormData) => {
      const result = await editUnit({
        ...unit,
        name: data.name,
        description: data.description,
      });

      if (!result.success) {
        throw {
          message: result.message,
        };
      }

      return result.data!;
    },

    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["units-list", language] });
      setOpen(false);
    },

    onError: (error) => {
      setError("root", {
        message: error.message,
      });
    },
  });

  const onSubmit = (data: EditUnitFormData) => {
    mutate(data);
  };

  const { mutateAsync: removeUnit, isPending: deleteUnitPending } = useMutation({
    mutationKey: ["delete-unit"],
    mutationFn: async () => await deleteUnit(unit.id),
    onSuccess: () => {
      queryClient.setQueryData(["units-list", language], (prev: Unit[]) =>
        prev.filter((x) => x.id != unit.id)
      );
      queryClient.refetchQueries({
        queryKey: ["units-list", language],
      });
    },
  });

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      clearErrors("root");
    });
    return () => unsubscribe();
  }, [watch, clearErrors]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <div className="flex items-center gap-1 justify-end absolute top-2 right-2">
        <Button
          disabled={deleteUnitPending}
          onClick={() => {
            toast.promise(removeUnit, {
              loading: "Видаляємо урок",
              success: "Урок видалено",
              error: "Не вдалось видалити урок",
            });
          }}
          size="sm"
          variant="destructive"
        >
          <Trash2 size={16} />
        </Button>
        <DialogTrigger asChild>
          <Button size="sm" variant="game">
            Редагувати
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {editUnitFields.map((field) => (
            <div key={field.name}>
              <Input
                {...register(field.name as "name", {
                  required: "Це поле обов'язкове",
                })}
                label={field.label}
                placeholder={field.placeholder}
              />
              {errors[field.name as "name"] && (
                <FieldError>{errors[field.name as "name"]!.message}</FieldError>
              )}
            </div>
          ))}
          <Button type="submit" disabled={isPending} className="w-full" variant="primary">
            {!isPending && "Зберегти"}
            {isPending && <LoadingCircle className="text-white" />}
          </Button>
          <Button
            className="w-full"
            type="button"
            onClick={() => {
              reset();
            }}
            variant="ghost"
          >
            Повернути
          </Button>
          {errors.root && <FieldError>{errors.root.message}</FieldError>}
        </form>
      </DialogContent>
    </Dialog>
  );
};
