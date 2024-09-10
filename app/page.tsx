"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen items-center justify-center flex flex-col gap-2 px-2">
      <p className="text-sm text-slate-400 text-center">
        Landing page is not ready yet, however you can check out the
        application.
      </p>
      <Button asChild size="sm" variant="primary">
        <Link href="/game/challenge">Lets do this</Link>
      </Button>
    </div>
  );
}
