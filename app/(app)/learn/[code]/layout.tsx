import { getCourseByCode } from "@/actions/courses/courses.action";
import { type Metadata } from "next";
import { headers as NextHeaders } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  if (typeof params.code === "string") {
    const course = await getCourseByCode(params.code);

    const headers = NextHeaders();
    const origin =
      process.env.NODE_ENV == "production"
        ? `https://${headers.get("host")}`
        : `http://${headers.get("host")}`;

    return {
      title: `Fluenty - ${course?.name} мова`,
      description: `Почніть вдосконалювати свою ${course?.name.slice(0, -1)}у мову.`,
      openGraph: {
        images: [
          {
            width: 1200,
            height: 600,
            url: `${origin}/og?code=${params.code}`,
          },
        ],
      },
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
}>) {
  return children;
}
