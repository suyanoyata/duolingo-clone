import Image from "next/image";
import ImageCode from "@/public/en.svg";
import { Button } from "./ui/button";

export const CourseComponent = ({
  language,
}: {
  language: { id: number; name: string; code: string };
}) => {
  return (
    <Button
      className="flex-col h-[180px] w-[180px] rounded-xl text-xl font-extrabold gap-3"
      key={language.id}
    >
      <h3 className="font-bold text-zinc-600">{language.name}</h3>
      <Image
        className="rounded-md"
        src={ImageCode}
        alt=""
        width={64}
        height={64}
      />
    </Button>
  );
};
