"use client";

// import { LayoutGroup } from "framer-motion";
// import { WordPicker } from "@/components/build-sentence/word-picker";
// import { Sentence } from "@/components/build-sentence/sentence";
// import { useState } from "react";
import { clientStore } from "@/store/user-store";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/loading-overlay";

export default function Page() {
  // const [words, setWords] = useState<never[]>([]);
  // const [sentence, setSentence] = useState<never[]>([]);

  const { user } = clientStore();

  // todo: fix loading for random challenge, as db structure changed
  return (
    <div className="relative flex-1">
      <LoadingOverlay />
    </div>
  );

  // if (isError) {
  //   return (
  //     <div className="h-screen w-full items-center justify-center flex">
  //       <p>{JSON.stringify(error)}</p>
  //     </div>
  //   );
  // }

  // if (!data) return;

  return (
    <div className="p-2 mx-auto max-w-[600px] min-w-[330px]">
      <div className="min-h-[240px] flex flex-col">
        <Button variant="ghost" className="gap-1 self-start" size="sm">
          {user?.hearts} <Heart strokeWidth={0} className="fill-red-500" />
        </Button>
        <h1 className="text-3xl mb-2 font-extrabold max-[360px]:text-xl">
          {/* {data.translate} */}
        </h1>
        {/* <LayoutGroup>
          <Sentence
            words={words}
            sentence={sentence}
            setWords={setWords}
            setSentence={setSentence}
            animationConfig={animationConfig}
          />
          <WordPicker
            words={words}
            setWords={setWords}
            setSentence={setSentence}
            animationConfig={animationConfig}
          />
        </LayoutGroup> */}
        {/* <SubmitChallenge sentence={sentence} correct={data!.correct} /> */}
        {/* <p className="text-xs font-medium mt-2 font-mono whitespace-pre-wrap">
          Current animation config: {JSON.stringify(animationConfig, null, 2)}
        </p> */}
      </div>
    </div>
  );
}
