import { Lesson, Progress } from "@prisma/client";
import { LessonComponent } from "./lesson-component";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay } from "../loading-overlay";

export const LessonList = ({ lessons }: { lessons: Lesson[] }) => {
  const { data } = useQuery<Progress[]>({
    queryKey: ["current-user-courses"],
  });

  if (!data) {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      {lessons.map((lesson, index) => (
        <LessonComponent
          isCurrentLesson={data[0].lastCompletedLesson == lesson.id}
          isLessonAvailable={
            data[0].lastCompletedLesson! >= lesson.id || index === 0
          }
          isPreviousLesson={data[0].lastCompletedLesson! - 1 >= lesson.id}
          isUnitLocked={data[0].unitId < lesson.unitId}
          key={lesson.id}
          id={lesson.id}
          index={index}
          length={lessons.length}
        />
      ))}
    </div>
  );
};
