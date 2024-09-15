"use client";

import { getLanguageWords } from "@/actions/management/languages";
import { LoadingOverlay } from "@/components/loading-overlay";
import { managementStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { CreateWord } from "./components/create-word-modal";
import { Language } from "@prisma/client";
import { ManagementCenterText } from "./components/management-center-text";

export default function Page() {
  const { selectedLanguage } = managementStore();
  const { data, isPending } = useQuery({
    queryKey: ["language-words", selectedLanguage],
    queryFn: async () => await getLanguageWords(selectedLanguage),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 0.5,
  });

  const { data: languages } = useQuery<Language[]>({
    queryKey: ["available-languages"],
  });

  const languageTitle =
    selectedLanguage &&
    languages!.map((lang) => lang.code == selectedLanguage && lang.name);

  return (
    <main className="p-2 relative flex-1">
      {!isPending && selectedLanguage == "" && (
        <p className="absolute top-[50%] left-[50%] translate-x-[-50%] text-sm text-slate-800 font-medium">
          Select language first
        </p>
      )}
      {isPending && selectedLanguage != "" && <LoadingOverlay />}
      {data && (
        <div>
          <div className="flex flex-row justify-between">
            <h1 className="font-extrabold text-3xl max-md:text-xl">
              Words for {languageTitle}
            </h1>
            <CreateWord />
          </div>
          <div>
            {data.length == 0 && (
              <ManagementCenterText>
                {languageTitle} has no words
              </ManagementCenterText>
            )}
            {data.length != 0 &&
              data.map((word) => (
                <div className="flex flex-row gap-2" key={word.id}>
                  <p>{word.text}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </main>
  );
}
