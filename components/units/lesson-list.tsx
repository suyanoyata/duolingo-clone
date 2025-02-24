import { Lesson, Progress } from "@prisma/client";
import { LessonComponent } from "./lesson-component";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay } from "../loading-overlay";

export const LessonList = ({
  lessons,
  languageCode,
}: {
  lessons: Lesson[];
  languageCode: string;
}) => {
  const { data } = useQuery<Progress[]>({
    queryKey: ["current-user-courses"],
  });

  const progress = data?.filter((progress) => progress.languageCode === languageCode)[0];

  if (!data || !progress) {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      {lessons.map((lesson, index) => (
        <LessonComponent
          isCurrentLesson={progress.lastCompletedLesson == lesson.id}
          isLessonAvailable={progress.lastCompletedLesson! >= lesson.id || index === 0}
          isPreviousLesson={progress.lastCompletedLesson! - 1 >= lesson.id}
          isUnitLocked={progress.unitId < lesson.unitId}
          key={lesson.id}
          id={lesson.id}
          index={index}
          length={lessons.length}
        />
      ))}
    </div>
  );
};
