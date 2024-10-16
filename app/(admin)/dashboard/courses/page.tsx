"use client";

import { getLanguages } from "@/actions/language.action";
import { CreateCourse } from "@/components/admin/forms/create-course";
import { CountryFlag } from "@/components/country-flag";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const CourseComponent = ({
  language,
}: {
  language: { id: number; name: string; code: string };
}) => {
  return (
    <Button
      asChild
      className="h-[180px] w-[180px] rounded-xl text-xl font-extrabold gap-3 flex flex-col items-center duration-100 transition-all"
    >
      <Link href={`/dashboard/${language.code}/units`}>
        <CountryFlag code={language.code} size={88} />
        <h3 className="font-extrabold text-zinc-600 text-xl normal-case">
          {language.name}
        </h3>
      </Link>
    </Button>
  );
};

export default function Page() {
  const { data, isPending } = useQuery({
    queryKey: ["language-courses"],
    queryFn: async () => await getLanguages(),
  });

  if (isPending) {
    return <LoadingOverlay />;
  }

  return (
    <div className="p-2">
      <h1 className="text-3xl font-extrabold text-zinc-600 mb-3">Курси</h1>
      <div className="flex gap-2 flex-wrap">
        {data?.map((language) => (
          <CourseComponent key={language.id} language={language} />
        ))}
        <CreateCourse />
      </div>
    </div>
  );
}
