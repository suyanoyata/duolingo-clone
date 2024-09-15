"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllLanguages } from "@/actions/management/languages";
import { CreateLanguage } from "@/app/management/components/create-language-modal";
import { managementStore } from "@/store/user-store";
import { SidebarLink } from "./sidebar-link";

export const DevSidebar = () => {
  const { data: languages } = useQuery({
    queryKey: ["available-languages"],
    queryFn: async () => await getAllLanguages(),
    staleTime: 1000 * 60 * 2,
  });

  const { setSelectedLanguage } = managementStore();

  return (
    <div className="border-r border-slate-300 w-[240px] max-sm:hidden flex h-screen px-3 py-2 flex-col flex-shrink-0">
      <h1 className="text-3xl font-extrabold text-slate-800 select-none mb-3">
        fluenty
      </h1>
      <div className="flex flex-row mb-2">
        <Select
          onValueChange={(value) => {
            setSelectedLanguage(value);
          }}
        >
          <SelectTrigger
            disabled={!languages || languages.length == 0}
            className="w-[180px] duration-200"
          >
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages?.map((language) => (
              <SelectItem key={language.id} value={language.code}>
                {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CreateLanguage />
      </div>
      <div className="flex flex-col gap-2">
        <SidebarLink href="/management/lessons">Lessons</SidebarLink>
        <SidebarLink href="/management">Words</SidebarLink>
      </div>
    </div>
  );
};
