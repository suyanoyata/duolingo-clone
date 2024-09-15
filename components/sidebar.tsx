import { SidebarLink } from "./sidebar-link";

export const Sidebar = () => {
  return (
    <div className="border-r border-slate-300 w-[200px] max-sm:hidden flex h-screen px-3 py-2 flex-col flex-shrink-0">
      <h1 className="text-4xl font-extrabold text-slate-800 select-none mb-3">
        fluenty
      </h1>
      <SidebarLink href="/game/challenge">Learn</SidebarLink>
    </div>
  );
};
