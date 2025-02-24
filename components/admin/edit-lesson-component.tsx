import { Pencil } from "lucide-react";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { editLesson } from "@/actions/admin/admin.actions";

import Link from "next/link";

import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { FieldError } from "@/components/ui/field-error";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

import { cn } from "@/lib/utils";

import { Lesson } from "@prisma/client";

export const EditLessonComponent = ({ lesson }: { lesson: Lesson }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["edit-lesson", lesson?.id],
    mutationFn: async () => {
      setChecked(!checked);
      const result = await editLesson({
        ...lesson,
        isLessonVisible: !lesson?.isLessonVisible,
      });

      if (!result.success) {
        throw {
          message: result.message,
        };
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["unit-lessons", lesson.unitId],
      });
    },
    onError: () => {
      setChecked((prev) => !prev);
    },
  });

  const [checked, setChecked] = useState(lesson?.isLessonVisible);

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className={cn("w-20 h-20 rounded-full relative border-b-[10px] hover:border-b-[8px]")}
        >
          <Pencil className="fill-zinc-50" size={42} strokeWidth={0} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <main className="mt-4">
          <div className="flex justify-between mt-6">
            <p className="text-sm font-semibold text-zinc-600">Відображати цей урок</p>
            <Switch
              disabled={isPending}
              onCheckedChange={() => {
                mutate();
              }}
              checked={checked}
            />
          </div>
          <Button className="w-full mt-4" variant="primary" asChild>
            <Link href={`/dashboard/lesson/${lesson.id}/edit`}>Перейти до завдань</Link>
          </Button>
          {isError && <FieldError className="mt-2">{error?.message}</FieldError>}
        </main>
      </DialogContent>
    </Dialog>
  );
};
