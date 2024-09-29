import { getCourseByCode } from "@/actions/courses/courses.action";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const course = await getCourseByCode(params.get("code") || "");

  const nunito = await fetch(new URL("./nunito.ttf", import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );

  return new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col bg-white">
        <div tw="flex flex-col ml-6">
          <h2 tw="font-semibold text-4xl text-zinc-800">
            {course?.name} мова - Fluenty
          </h2>
          <p tw="text-6xl font-extrabold text-zinc-800 w-[900px]">
            Почніть вивчати {course?.name.slice(0, -1)}у мову із легкістю вже
            зараз
          </p>
          <h1 tw="w-[230px] select-none inline-flex items-center justify-center whitespace-nowrap rounded-xl text-2xl font-bold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 uppercase bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0 h-14 px-4 text-white">
            Почати
          </h1>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Nunito",
          data: nunito,
          style: "normal",
        },
      ],
    },
  );
}
