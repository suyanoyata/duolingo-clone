import { getCourseByCode } from "@/actions/courses/courses.action";
import type { Metadata } from "next";

export async function generateMetadata(code: string): Promise<Metadata> {
  if (typeof code === "string") {
    const course = await getCourseByCode(code);

    return {
      title: `Fluenty - ${course?.name} мова`,
    };
  } else {
    return {
      title: "Fluenty",
    };
  }
}

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { code: string };
}>) {
  await generateMetadata(params.code);
  return children;
}
