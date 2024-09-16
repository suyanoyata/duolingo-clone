import { getLanguages } from "@/actions/language.action";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay } from "./loading-overlay";
import { CourseComponent } from "./course-component";

export const SelectCourse = () => {
  const { data, isPending } = useQuery({
    queryKey: ["language-courses"],
    queryFn: async () => await getLanguages(),
    retry: false,
    staleTime: 1000 * 60 * 1,
  });

  if (isPending || !data) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      {data.map((language) => (
        <CourseComponent language={language} />
      ))}
    </div>
  );
};
