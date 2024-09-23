import { Unit } from "@prisma/client";
import { LessonList } from "./lesson-list";
import { useQuery } from "@tanstack/react-query";
import { getLessons } from "@/actions/courses/courses.action";
import { LoadingOverlay } from "../loading-overlay";

export const UnitComponent = ({ unit }: { unit: Unit }) => {
  const { data, isPending } = useQuery({
    queryKey: ["unit-lessons", unit.id],
    queryFn: async () => await getLessons(unit.id),
  });

  if (isPending || !data) {
    return <LoadingOverlay />;
  }

  return (
    <section>
      <div className="bg-green-500 p-3 rounded-lg my-3">
        <p className="text-lg text-white font-bold">Урок {unit.order}</p>
        <h2 className="text-xl font-extrabold text-white">{unit.name}</h2>
        <p className="text-sm text-white font-medium">{unit.description}</p>
      </div>
      <LessonList lessons={data} />
    </section>
  );
};
