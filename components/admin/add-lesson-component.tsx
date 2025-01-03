import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { lessonCycle } from "@/lib/determine-lesson-cycle";

export const AddLessonComponent = ({ index }: { index: number }) => {
  const position = lessonCycle(index);

  return (
    <div>
      <Button
        disabled
        onClick={() => {}}
        variant="primary"
        className={cn(
          "w-20 h-20 rounded-full relative border-b-[10px] hover:border-b-[8px] bg-zinc-400 hover:bg-zinc-400 border-zinc-500",
        )}
        style={{
          left: `${position}px`,
        }}
      >
        <Plus className="fill-zinc-50" size={42} />
      </Button>
    </div>
  );
};
