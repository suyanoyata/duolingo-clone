import { removeLesson } from "@/actions/management/lessons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { managementStore } from "@/store/user-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export const LessonItem = ({
  lesson,
  pendingDelete,
  setPendingDelete,
}: {
  lesson: { id: number; name: string; order: number };
  pendingDelete: boolean;
  setPendingDelete: (value: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const { selectedLanguage } = managementStore();

  const { mutate: deleteLesson, isPending } = useMutation({
    mutationFn: async (lesson: { id: number }) => {
      await removeLesson({
        id: lesson.id,
      }).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["language-lessons", selectedLanguage],
        });
      });
    },
  });

  useEffect(() => {
    if (isPending == false) {
      setTimeout(() => {
        setPendingDelete(isPending);
      }, 500);
    } else {
      setPendingDelete(isPending);
    }
  }, [isPending]);

  const drag = useDragControls();

  return (
    <Reorder.Item
      animate={{
        opacity: 1,
      }}
      dragControls={drag}
      value={lesson}
      drag={!pendingDelete ? "y" : false}
      key={lesson.id}
    >
      <div
        className={cn(
          "flex flex-row items-center gap-2 duration-100",
          pendingDelete ? "opacity-60" : "",
        )}
      >
        <div className="flex gap-1 bg-white border-2 border-b-4 border-slate-100 py-1.5 px-3 rounded-lg flex-1 items-center">
          <GripVertical size={18} className="cursor-grab text-slate-400" />
          <Link
            href={`/management/challenges?id=${lesson.id}`}
            className="text-slate-700 font-bold select-none flex-1"
          >
            {lesson.order}. {lesson.name}
          </Link>
        </div>
        <Button variant="destructive" disabled={pendingDelete}>
          <Trash2
            onClick={() => {
              deleteLesson(lesson);
            }}
            size={18}
            className="text-white cursor-pointer"
          />
        </Button>
      </div>
    </Reorder.Item>
  );
};
