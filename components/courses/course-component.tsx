import Image from "next/image";
import { Button } from "../ui/button";

export const CourseComponent = ({
  language,
  select,
  setSelect,
}: {
  select: number;
  setSelect: (value: number) => void;
  language: { id: number; name: string; code: string };
}) => {
  return (
    <Button
      onClick={() => {
        setSelect(language.id);
      }}
      disabled={select !== 0}
      className="h-[180px] w-[180px] rounded-xl text-xl font-extrabold gap-3 flex flex-col items-center duration-100 transition-all"
      key={language.id}
    >
      <Image
        className="rounded-md shadow-lg"
        src={`/flags/${language.code}.svg`}
        alt=""
        width={88}
        height={88}
      />
      <h3 className="font-extrabold text-zinc-600 text-xl normal-case">
        {language.name}
      </h3>
    </Button>
  );
};
