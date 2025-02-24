"use client";

import { getLanguages } from "@/actions/language.action";
import { getCurrentUserCourses, setActiveCourse } from "@/actions/users/user.action";
import { CountryFlag } from "@/components/country-flag";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Button } from "@/components/ui/button";
import { UnitsList } from "@/components/units/units-list";
import { clientStore } from "@/store/user-store";
import { User } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { toast } from "sonner";

export default function Page({ params }: { params: { code: string } }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    setLastLanguageCode,
    lessonId,
    setCurrentChallengeIndex,
    setPreviousChallengeCompleting,
  } = clientStore();

  const { data: currentCourseInfo, isPending: isCurrentCourseLoading } = useQuery({
    queryKey: ["current-user-courses"],
    queryFn: async () => await getCurrentUserCourses(),
  });

  const { data: languageCourses, isPending: isLanguageCoursesLoading } = useQuery({
    queryKey: ["language-courses"],
    queryFn: async () => await getLanguages(),
  });

  const { data: userData, isPending: isUserDataPending } = useQuery<User>({
    queryKey: ["user"],
  });

  const course = currentCourseInfo?.find((course) => course.languageCode === params.code);

  const courseData = languageCourses?.find((languageCourse) => {
    return languageCourse.code === course?.languageCode;
  });

  useEffect(() => {
    queryClient.removeQueries({
      queryKey: ["lesson", lessonId],
    });
    setCurrentChallengeIndex(0);
  }, [lessonId, queryClient, setCurrentChallengeIndex]);

  useEffect(() => {
    setPreviousChallengeCompleting(false);
  }, [setPreviousChallengeCompleting]);

  useEffect(() => {
    setLastLanguageCode(params.code);
  }, [params.code, setLastLanguageCode]);

  useEffect(() => {
    if (course) {
      setActiveCourse(course.languageCode);
    }
  }, [params.code, course]);

  if (isCurrentCourseLoading || isLanguageCoursesLoading || isUserDataPending || !userData) {
    return <LoadingOverlay />;
  }

  if (!course || !courseData) {
    // toast.error("Ви не підписані на цей курс");
    return router.push("/learn") as unknown as React.ReactNode;
  }

  return (
    <div className="p-2 flex-1 max-w-[900px] mx-auto">
      <header className="flex items-center gap-2 mb-2">
        <Button
          onClick={() => {
            router.push("/learn");
          }}
          variant="ghost"
          size="sm"
        >
          <ChevronLeft />
        </Button>
        <p className="text-lg font-bold text-zinc-700">{courseData.name}</p>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => {
            router.push("/learn");
          }}
        >
          <CountryFlag code={courseData.code} />
        </Button>
        <Button variant="ghost" size="sm" className="text-zinc-700">
          <Heart className="fill-red-500 mr-1" size={18} strokeWidth={0} />
          {userData.hearts}
        </Button>
      </header>
      <UnitsList languageCode={params.code} />
    </div>
  );
}
