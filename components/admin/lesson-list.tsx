import { Lesson } from "@prisma/client";
import { LessonComponent } from "@/components/admin/lesson-component";
import { AddLessonComponent } from "./add-lesson-component";

export const LessonList = ({
  lessons,
}: {
  lessons: Lesson[];
  languageCode: string;
}) => {
  return (
    <div className="flex flex-col gap-8 items-center">
      {lessons.map((lesson, index) => (
        <LessonComponent
          id={lesson.id}
          lessons={lessons}
          key={lesson.id}
          index={index}
        />
      ))}
      <AddLessonComponent index={lessons.length + 1} />
    </div>
  );
};
