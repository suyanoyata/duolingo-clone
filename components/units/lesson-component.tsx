import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Crown, Star } from "lucide-react";
import { clientStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { lessonCycle } from "@/lib/determine-lesson-cycle";

export const LessonComponent = ({
  isCurrentLesson,
  isLessonAvailable,
  isUnitLocked,
  id,
  index,
  length,
}: {
  isCurrentLesson: boolean;
  isLessonAvailable: boolean;
  isUnitLocked: boolean;
  id: number;
  index: number;
  length: number;
}) => {
  const position = lessonCycle(index);
  const isLast = index === length - 1;
  const Icon = isLast ? Crown : Star;

  const { setLessonId } = clientStore();
  const router = useRouter();

  const BounceComponent = () => {
    if (isCurrentLesson) {
      return (
        <div className="absolute -top-8 -left-1 px-3 py-2.5 border-2 font-bold uppercase text-green-500 bg-white rounded-xl animate-bounce tracking-wide z-10">
          Почати
          <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2" />
        </div>
      );
    }
  };

  if (isUnitLocked) {
    return (
      <Button
        disabled={true}
        variant="primary"
        className={cn(
          "w-20 h-20 rounded-full relative border-b-8",
          "border-zinc-500 bg-zinc-400 hover:bg-zinc-400",
        )}
        style={{
          left: `${position}px`,
        }}
      >
        <Icon className="fill-zinc-50" size={42} strokeWidth={0} />
      </Button>
    );
  }

  return (
    <div>
      <Button
        onClick={() => {
          if (!isCurrentLesson && isLessonAvailable) {
            throw new Error("Implement previous lesson start");
          }
          setLessonId(id);
          router.push("/lesson");
        }}
        disabled={isUnitLocked || !isLessonAvailable}
        variant="primary"
        className={cn(
          "w-20 h-20 rounded-full relative border-b-8",
          isUnitLocked ||
            (!isLessonAvailable &&
              "border-zinc-500 bg-zinc-400 hover:bg-zinc-400"),
        )}
        style={{
          left: `${position}px`,
        }}
      >
        <BounceComponent />
        <Icon className="fill-zinc-50" size={42} strokeWidth={0} />
      </Button>
    </div>
  );
};