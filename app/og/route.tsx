/* eslint-disable @next/next/no-img-element */
import { getCourseByCode } from "@/actions/courses/courses.edge-action";
import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { headers as NextHeaders } from "next/headers";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const Stats = ({ count, label }: { count: number; label: string }) => (
    <div tw="flex flex-col items-center mr-5">
      <span style={{ fontFamily: "Nunito Black" }} tw="text-4xl text-zinc-800">
        {count}
      </span>
      <span tw="text-zinc-400">{label}</span>
    </div>
  );

  const bold = await fetch(
    new URL("../../public/fonts/Nunito-Bold.ttf", import.meta.url),
  );
  const black = await fetch(
    new URL("../../public/fonts/Nunito-Black.ttf", import.meta.url),
  );

  const params = req.nextUrl.searchParams;

  const course = await getCourseByCode(params.get("code") || "");

  const headers = NextHeaders();
  const origin =
    process.env.NODE_ENV == "production"
      ? `https://${headers.get("host")}`
      : `http://${headers.get("host")}`;

  const imageSize = 82;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          padding: "10px 20px",
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
          tw="flex text-xl items-center justify-center rounded-2xl font-bold bg-sky-400 text-white uppercase border-sky-500 border-b-[6px] h-15 mt-4 max-w-[290px]"
        >
          Почати
        </div>
        <div tw="flex flex-row mt-5">
          <Stats count={course.units} label="розділів" />
          <Stats count={course.lessons} label="уроків" />
        </div>
        <img
          alt=""
          tw="absolute right-4 top-4 rounded-xl"
          width={imageSize}
          height={imageSize / 1.3333}
          src={`${origin}/flags/${course.code}.svg`}
        />
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
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
