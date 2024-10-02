import { getCourseByCode } from "@/actions/courses/courses.action";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  if (typeof params.code === "string") {
    const course = await getCourseByCode(params.code);

    return {
      title: `Fluenty - ${course?.name} мова`,
      description: `Почніть вдосконалювати свою ${course?.name.slice(0, -1)}у мову.`,
      openGraph: {
        images: [
          {
            width: 1200,
            height: 600,
            url:
              process.env.NODE_ENV == "production"
                ? `https://duolingo-clone-five.vercel.app/og?code=${params.code}`
                : `http://localhost:3000/og?code=${params.code}`,
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
