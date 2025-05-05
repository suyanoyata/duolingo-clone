"use client";

import { getLanguages } from "@/actions/language.action";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay } from "@/components/loading-overlay";
import { CourseComponent } from "@/components/courses/course-component";
import { useEffect, useState } from "react";
import { getCurrentUserCourses } from "@/actions/users/user.action";
import { useRouter } from "next/navigation";
import { CourseSubscribe } from "@/components/courses/course-subscribe-modal";

export const SelectCourse = () => {
  const [courseId, setCourseId] = useState(0);

  const { data, isPending } = useQuery({
    queryKey: ["language-courses"],
    queryFn: async () => await getLanguages(),
  });

  const { data: currentCoursesInfo } = useQuery({
    queryKey: ["current-user-courses"],
    queryFn: async () => await getCurrentUserCourses(),
  });

  const router = useRouter();
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  useEffect(() => {
    if (courseId === 0) return;

    const course = currentCoursesInfo?.filter((course) => course.courseId === courseId);

    if (course && course.length !== 0) {
      router.push(`/learn/${course[0].languageCode}`);
    } else {
      setOpenSubscribeModal(true);
    }
  }, [courseId, currentCoursesInfo, data, router]);

  const notSubscribedCourses = data?.filter((course) => {
    const courseInfo = currentCoursesInfo?.find((courseInfo) => courseInfo.courseId === course.id);
    return !courseInfo;
  });

  useEffect(() => {
    if (!openSubscribeModal) {
      setTimeout(() => {
        setCourseId(0);
      }, 160);
    }
  }, [openSubscribeModal]);

  if (isPending || !data || !currentCoursesInfo || !notSubscribedCourses) {
    return <LoadingOverlay />;
  }

  return (
    <div className="mx-auto">
      <CourseSubscribe
        courseId={courseId}
        open={openSubscribeModal}
        setOpen={setOpenSubscribeModal}
      />
      {currentCoursesInfo.length !== 0 && (
        <>
          <h1 className="text-2xl max-sm:text-xl font-extrabold mb-2 text-zinc-600">Мої курси</h1>
          <div className="flex gap-4 mb-2 flex-wrap max-w-[790px]">
            {currentCoursesInfo?.map((course) => (
              <CourseComponent
                select={courseId}
                setSelect={setCourseId}
                key={course.id}
                language={
                  data?.find((language) => language.id === course.courseId) ?? {
                    id: 0,
                    name: "",
                    code: "",
                  }
                }
              />
            ))}
          </div>
        </>
      )}
      {notSubscribedCourses.length > 0 && (
        <h1 className="text-2xl max-sm:text-xl font-extrabold mb-2 text-zinc-600">Всі курси</h1>
      )}
      <div className="flex gap-4 flex-wrap max-w-[790px]">
        {notSubscribedCourses!.map((language) => (
          <CourseComponent
            select={courseId}
            setSelect={setCourseId}
            key={language.id}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};
