import { getCourseByCode } from "@/actions/courses/courses.action";

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}) {
  if (typeof params.code === "string") {
    const course = await getCourseByCode(params.code);

    return {
      title: `Fluenty - ${course?.name} мова`,
      description: `Почніть вивчати ${course?.name.slice(0, -1)}у мову із легкістю вже зараз`,
    };
  } else {
    return {
      title: "Fluenty",
      description: "Почніть вивчати мови з легкістю вже зараз",
    };
  }
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { code: string };
}>) {
  return children;
}
