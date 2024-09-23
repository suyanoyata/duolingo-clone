import { getUnits } from "@/actions/courses/courses.action";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay } from "../loading-overlay";
import { UnitComponent } from "./unit-header";

export const UnitsList = ({ languageCode }: { languageCode: string }) => {
  const { data: units, isPending: isUnitsLoading } = useQuery({
    queryKey: ["units-list", languageCode],
    queryFn: async () => await getUnits(languageCode),
  });

  if (isUnitsLoading || !units) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      {units.map((unit) => (
        <UnitComponent key={unit.id} unit={unit} />
      ))}
    </div>
  );
};
