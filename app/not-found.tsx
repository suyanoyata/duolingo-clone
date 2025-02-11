import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex">
      <Sidebar />
      <main className="max-sm:ml-0 flex-1">
        <div className="flex-1 flex flex-col items-center justify-center h-screen">
          <p className="text-sm text-zinc-700 font-medium mb-2">
            Здається цієї сторінки не існує.
          </p>
          <Button asChild variant="ghost" size="sm">
            <Link href="/learn">Повернутись до курсів</Link>
          </Button>
        </div>
      </main>
    </main>
  );
}
