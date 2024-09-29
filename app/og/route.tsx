import { getCourseByCode } from "@/actions/courses/courses.action";
import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "@vercel/og";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function GET(req: NextRequest) {
  console.log({
    filename: __filename,
    dirname: __dirname,
  });

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
          tw="flex text-4xl text-zinc-700 my-0 py-0 leading-none"
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
          data: await readFile(
            join(__dirname, "../../public/fonts/Nunito-Regular.ttf"),
          ),
          style: "normal",
          weight: 400,
        },
        {
          name: "Nunito Medium",
          data: await readFile(
            join(__dirname, "../../public/fonts/Nunito-Medium.ttf"),
          ),
          style: "normal",
          weight: 500,
        },
        {
          name: "Nunito Bold",
          data: await readFile(
            join(__dirname, "../../public/fonts/Nunito-Bold.ttf"),
          ),
          style: "normal",
          weight: 700,
        },
        {
          name: "Nunito Black",
          data: await readFile(
            join(__dirname, "../../public/fonts/Nunito-Black.ttf"),
          ),
          style: "normal",
          weight: 900,
        },
      ],
    },
  );
}
