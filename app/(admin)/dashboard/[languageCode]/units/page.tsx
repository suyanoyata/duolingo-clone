"use client";

import { getUnits } from "@/actions/courses/courses.action";
import { UnitComponent } from "@/components/admin/unit-header";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { languageCode: string } }) {
  const { data: units, isPending: isUnitsLoading } = useQuery({
    queryKey: ["units-list", params.languageCode],
    queryFn: async () => await getUnits(params.languageCode),
  });

  const router = useRouter();

  if (isUnitsLoading || !units) {
    return <LoadingOverlay />;
  }

  return (
    <div className="px-2 pb-4 mx-auto max-w-[900px]">
      <header className="flex items-center gap-2 my-2">
        <Button
          onClick={() => {
            router.push("/dashboard/courses");
          }}
          variant="ghost"
          size="sm"
        >
          <ChevronLeft />
        </Button>
      </header>
      {units.map((unit) => (
        <UnitComponent
          language={params.languageCode}
          unit={unit}
          key={unit.id}
        />
      ))}
    </div>
  );
}
