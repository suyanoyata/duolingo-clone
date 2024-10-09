import { localDate } from "@/lib/date";
import { Language } from "@prisma/client";
import { CountryFlag } from "../country-flag";

export const ProfileMainSection = ({
  profileData,
  courseData,
}: {
  profileData: {
    id: number;
    name: string;
    joinedAt: Date;
    score: number;
  };
  courseData: Language;
}) => {
  return (
    <section className="flex-1 max-w-[1080px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-700">
            {profileData.name}
          </h1>
          <p className="text-zinc-600">
            Приєднався: {localDate(profileData.joinedAt)}
          </p>
        </div>
        {courseData?.code && <CountryFlag code={courseData.code} size={36} />}
      </div>
      <div className="h-[2px] bg-zinc-100 w-full my-6" />
      <h2 className="text-zinc-700 font-extrabold text-2xl mb-2">Статистика</h2>
      <div className="flex flex-row flex-1 gap-2 flex-wrap">
        <div className="card px-4 py-2 border-zinc-100 border-2 rounded-xl flex-1 max-w-[300px]">
          <p className="text-zinc-600 font-extrabold text-xl">
            {profileData.score}
          </p>
          <p className="font-medium text-zinc-500">Усього балів</p>
        </div>
      </div>
    </section>
  );
};
