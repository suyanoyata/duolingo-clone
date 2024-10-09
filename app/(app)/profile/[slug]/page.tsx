"use client";

import { getCourse } from "@/actions/courses/courses.action";
import { getCurrentUserCourses, getUser } from "@/actions/users/user.action";
import { LoadingOverlay } from "@/components/loading-overlay";
import { ProfileMainSection } from "@/components/profile/profile-main-section";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const { data, isPending } = useQuery<User>({
    queryKey: ["user"],
  });

  const router = useRouter();

  const {
    data: profileData,
    isPending: isProfilePending,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile", params.slug],
    queryFn: async () => {
      if (data!.nickname !== params.slug) {
        return await getUser(params.slug);
      } else {
        return data;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 2,
  });

  const { data: coursesData, isPending: isCoursesPending } = useQuery({
    queryKey: ["profile-courses", profileData?.id],
    queryFn: async () => await getCurrentUserCourses(profileData?.id),
  });

  const { data: courseData, isPending: isCourseDataPending } = useQuery({
    queryKey: ["profile-active-course", profileData?.progressId ?? 0],
    queryFn: async () => await getCourse(profileData?.progressId ?? 0),
  });

  useEffect(() => {
    if (data?.id != undefined) {
      refetchProfile();
    }
  }, [data, refetchProfile]);

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (
    isProfilePending ||
    !profileData ||
    isCourseDataPending ||
    isCoursesPending
  ) {
    return <LoadingOverlay />;
  }

  if (profileData.id == 0) {
    router.push("/not-found");
    return <LoadingOverlay />;
  }

  return (
    <div className="flex flex-row flex-1 p-2 px-12 gap-6">
      <ProfileMainSection courseData={courseData!} profileData={profileData} />
      <aside className="w-[240px] border-2 border-zinc-100 flex flex-col p-4 rounded-xl max-lg:hidden">
        {coursesData!.map((course) => (
          <div
            key={course.id}
            className="flex flex-row gap-2 items-center h-16"
          >
            <Image
              alt=""
              className="shadow-sm rounded-sm h-[20px] w-[28px]"
              src={`/flags/${course.languageCode}.svg`}
              width={28}
              height={22}
            />
            <div>
              <p className="font-bold">{course.language.name} мова</p>
              <p className="text-sm text-zinc-600 font-semibold">
                Кількість балів:{" "}
                <span className="font-bold text-zinc-700">{course.score}</span>
              </p>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}
