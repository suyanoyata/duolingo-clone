"use client";

import { getLanguageLessons } from "@/actions/management/lessons";
import { LoadingOverlay } from "@/components/loading-overlay";
import { managementStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { CreateLesson } from "../components/create-lesson-modal";
import { Reorder } from "framer-motion";
import { useState } from "react";
import { LessonItem } from "../components/lesson-item";
import { Language } from "@prisma/client";
import { ManagementCenterText } from "../components/management-center-text";

export default function Page() {
  const { selectedLanguage } = managementStore();
  const { data, isPending } = useQuery({
    queryKey: ["language-lessons", selectedLanguage],
    queryFn: async () => {
      if (selectedLanguage == "") return [];
      const lessons = await getLanguageLessons(selectedLanguage);
      return lessons;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 1,
  });

  const { data: languages } = useQuery<Language[]>({
    queryKey: ["available-languages"],
  });

  const [pendingDelete, setPendingDelete] = useState<boolean>(false);

  const onReorder = (items: unknown) => {
    console.log(items);
  };

  const languageTitle =
    selectedLanguage &&
    languages!.map((lang) => lang.code == selectedLanguage && lang.name);

  const LessonsBlock = () => {
    if (isPending && selectedLanguage != "") {
      return <LoadingOverlay />;
    }

    if (selectedLanguage == "") {
      return <ManagementCenterText>Select language first</ManagementCenterText>;
    }

    if (data) {
      return (
        <div>
          <div className="flex flex-row justify-between">
            <h1 className="font-extrabold text-3xl max-md:text-xl">
              Lessons for {languageTitle}
            </h1>
            <CreateLesson />
          </div>
          <div className="flex-1">
            {data.length == 0 && selectedLanguage != "" && (
              <ManagementCenterText>
                {languageTitle} has no lessons
              </ManagementCenterText>
            )}
            <Reorder.Group
              axis="y"
              onReorder={onReorder}
              values={data}
              className="gap-2 flex flex-col mt-2"
            >
              {data.length !== 0 &&
                data.map((lesson) => (
                  <LessonItem
                    lesson={lesson}
                    pendingDelete={pendingDelete}
                    setPendingDelete={setPendingDelete}
                    key={lesson.id}
                  />
                ))}
            </Reorder.Group>
          </div>
        </div>
      );
    }
  };

  return (
    <main className="p-2 relative flex-1">
      <LessonsBlock />
    </main>
  );
}
