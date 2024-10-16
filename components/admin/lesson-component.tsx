import { lessonCycle } from "@/lib/determine-lesson-cycle";
import { EditLessonComponent } from "./edit-lesson-component";
import { Lesson } from "@prisma/client";

export const LessonComponent = ({
  id,
  lessons,
  index,
}: {
  id: number;
  lessons: Lesson[];
  index: number;
}) => {
  const position = lessonCycle(index);
  const lesson = lessons.find((lesson) => lesson.id === id);

  return (
    <div
      style={{
        left: `${position}px`,
      }}
    >
      <EditLessonComponent lesson={lesson!} />
    </div>
  );
};
