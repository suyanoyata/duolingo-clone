import { Metadata } from "next";
import Content from "./content";
import { getCourseByCode } from "@/actions/courses/courses.action";

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  // read route params
  const code = params.code;

  const course = await getCourseByCode(code);

  const modifiedTitle = `${course?.name} мова - Fluenty`;
  const modifiedDescription = `Почніть вивчати ${course?.name.slice(0, -1)}у мову із легкістю.`;

  return {
    title: modifiedTitle,
    description: modifiedDescription,
  };
}

export default function Page({ params }: { params: { code: string } }) {
  return <Content params={params} />;
}
