import { Lesson } from "@prisma/client";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Pencil } from "lucide-react";
import { Switch } from "../ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editLesson } from "@/actions/admin/admin.actions";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const EditLessonComponent = ({ lesson }: { lesson: Lesson }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
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
  });

  const [checked, setChecked] = useState(lesson?.isLessonVisible);

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className={cn(
            "w-20 h-20 rounded-full relative border-b-[10px] hover:border-b-[8px]",
          )}
        >
          <Pencil className="fill-zinc-50" size={42} strokeWidth={0} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <main>
          <div className="flex justify-between mt-6">
            <p className="text-sm font-semibold text-zinc-600">
              Відображати цей урок
            </p>
            <Switch
              disabled={isPending}
              onCheckedChange={() => {
                mutate();
              }}
              checked={checked}
            />
          </div>
          <Button className="w-full mt-4" variant="primary" asChild>
            <Link href={`/dashboard/lesson/${lesson.id}/edit`}>
              Перейти до завдань
            </Link>
          </Button>
        </main>
      </DialogContent>
    </Dialog>
  );
};
