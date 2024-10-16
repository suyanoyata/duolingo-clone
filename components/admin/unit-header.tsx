import { Unit } from "@prisma/client";
import { LessonList } from "@/components/admin/lesson-list";
import { useQuery } from "@tanstack/react-query";
import { getLessons } from "@/actions/courses/courses.action";
import { LoadingOverlay } from "../loading-overlay";
import { EditUnit } from "./forms/edit-unit-data";

export const UnitComponent = ({
  unit,
  language,
}: {
  unit: Unit;
  language: string;
}) => {
  const { data, isPending } = useQuery({
    queryKey: ["unit-lessons", unit.id],
    queryFn: async () =>
      await getLessons(unit.id, {
        showHidden: true,
      }),
  });

  if (!data || isPending) {
    return <LoadingOverlay />;
  }

  return (
    <section>
      <div className="bg-green-500 p-3 rounded-lg my-3 relative">
        <EditUnit language={language} unit={unit} />
        <p className="text-lg text-white font-bold">Урок {unit.order}</p>
        <h2 className="text-xl font-extrabold text-white">{unit.name}</h2>
        <p className="text-sm text-white font-medium">{unit.description}</p>
      </div>
      <LessonList languageCode={unit.languageCode} lessons={data} />
    </section>
  );
};
