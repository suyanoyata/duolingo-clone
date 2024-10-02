import { getCourseByCode } from "@/actions/courses/courses.edge-action";
import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const regular = await fetch(
    new URL("../../public/fonts/Nunito-Regular.ttf", import.meta.url),
  );
  const medium = await fetch(
    new URL("../../public/fonts/Nunito-Medium.ttf", import.meta.url),
  );
  const semibold = await fetch(
    new URL("../../public/fonts/Nunito-SemiBold.ttf", import.meta.url),
  );
  const bold = await fetch(
    new URL("../../public/fonts/Nunito-Bold.ttf", import.meta.url),
  );
  const black = await fetch(
    new URL("../../public/fonts/Nunito-Black.ttf", import.meta.url),
  );

  const params = req.nextUrl.searchParams;

  const course = await getCourseByCode(params.get("code") || "");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          padding: "10px 20px",
          fontFamily: "Nunito, sans-serif",
          justifyContent: "center",
          fontSize: 28,
          backgroundColor: "white",
        }}
      >
        <div
          tw="top-4 left-4 absolute flex text-zinc-400"
          style={{
            fontFamily: "Nunito Black",
          }}
        >
          fluenty
        </div>
        <div
          tw="flex text-4xl text-zinc-600 my-0 py-0 leading-none"
          style={{
            fontFamily: "Nunito Bold",
          }}
        >
          {course!.name} мова
        </div>
        <div
          tw="flex text-5xl max-w-[800px] text-zinc-800 mt-2"
          style={{ fontFamily: "Nunito Black" }}
        >
          Почніть тренувати {course!.name.slice(0, -1)}у мову вже зараз із
          легкістю
        </div>
        <div
          style={{
            fontFamily: "Nunito Bold",
          }}
          tw="flex items-center justify-center rounded-xl font-bold bg-sky-400 text-white uppercase border-sky-500 border-b-4 h-15 mt-4 max-w-[240px]"
        >
          Почати
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      // debug: true,
      fonts: [
        {
          name: "Nunito",
          data: await regular.arrayBuffer(),
          style: "normal",
          weight: 400,
        },
        {
          name: "Nunito Medium",
          data: await medium.arrayBuffer(),
          style: "normal",
          weight: 500,
        },
        {
          name: "Nunito SemiBold",
          data: await semibold.arrayBuffer(),
          style: "normal",
          weight: 600,
        },
        {
          name: "Nunito Bold",
          data: await bold.arrayBuffer(),
          style: "normal",
          weight: 700,
        },
        {
          name: "Nunito Black",
          data: await black.arrayBuffer(),
          style: "normal",
          weight: 900,
        },
      ],
    },
  );
}
