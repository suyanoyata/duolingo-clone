import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Plus } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createLesson } from "@/actions/admin/admin.actions";
import { lessonCycle } from "@/lib/determine-lesson-cycle";

import { Unit } from "@prisma/client";

export const AddLessonComponent = ({ index, unitId }: { index: number; unitId: number }) => {
  const position = lessonCycle(index);

  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-lesson-callback"],
    mutationFn: async () => createLesson(unitId),
    onSuccess: (data) => {
      client.setQueryData(["unit-lessons", unitId], (prev: Unit[]) => [...prev, data]);
    },
  });

  return (
    <div>
      <Button
        disabled={isPending}
        onClick={() => mutate()}
        variant="secondary"
        className={cn("w-20 h-20 rounded-full relative border-b-[10px] hover:border-b-[8px]")}
        style={{
          left: `${position}px`,
        }}
      >
        <Plus className="fill-zinc-50" size={42} />
      </Button>
    </div>
  );
};
