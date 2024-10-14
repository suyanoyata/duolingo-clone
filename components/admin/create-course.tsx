"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { LoadingCircle } from "@/components/loading-overlay";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { CourseCreateFormData, CourseCreateSchema } from "@/types/Forms";

import { createCourse } from "@/actions/admin/admin.actions";
import { Language } from "@prisma/client";

const CreateCourseFields = [
  {
    name: "course_name",
    label: "Назва курсу",
    placeholder: "Наприклад: Англійська",
  },
  {
    name: "course_code",
    label: "Код курсу",
    placeholder: "Наприклад: en",
  },
];

export const CreateCourse = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
    watch,
  } = useForm<CourseCreateFormData>({
    resolver: zodResolver(CourseCreateSchema),
  });

  const onSubmit = (data: CourseCreateFormData) => {
    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-course"],
    mutationFn: async (course: CourseCreateFormData) => {
      const result = await createCourse(course);
      if (result.success) return result.data!;

      throw new Error(result.message);
    },
    onSuccess: (data: Language) => {
      queryClient.setQueryData(["language-courses"], (oldData: Language[]) => {
        return [...oldData, data];
      });

      setOpen(false);
    },
    onError: (error) => {
      setError("root", {
        message: error.message,
      });
    },
  });

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      clearErrors("root");
    });
    return () => unsubscribe();
  }, [watch]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="h-[180px] w-[180px] rounded-xl text-xl font-extrabold gap-3 flex flex-col items-center duration-100 transition-all">
          <div className="w-[88px] h-[66px] rounded-lg bg-zinc-200 flex items-center justify-center">
            <Plus className="text-zinc-400" />
          </div>
          <h3 className="font-extrabold text-zinc-600 text-xl normal-case text-wrap">
            Новий курс
          </h3>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {CreateCourseFields.map((field) => (
            <div key={field.name}>
              <Input
                disabled={isPending}
                {...register(field.name as "course_name", {
                  required: "Це поле обов'язкове",
                })}
                label={field.label}
                placeholder={field.placeholder}
              />
              {errors[field.name as "course_name"] && (
                <FieldError>
                  {errors[field.name as "course_name"]!.message}
                </FieldError>
              )}
            </div>
          ))}
          <Button disabled={isPending} className="w-full" variant="primary">
            {!isPending && "Створити"}
            {isPending && <LoadingCircle className="text-white" />}
          </Button>
          {errors.root && <FieldError>{errors.root.message}</FieldError>}
        </form>
      </DialogContent>
    </Dialog>
  );
};
