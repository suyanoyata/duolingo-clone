"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AnimatePresence } from "framer-motion";

import { ChevronLeft, Plus } from "lucide-react";
import { CreateChallengeSelectType } from "./create-challenge/step-1";
import { createChallengeStore } from "@/store/create-lesson-store";
import { CreateChallengeInputStep } from "./create-challenge/step-2";

export const CreateChallenge = () => {
  const [open, setOpen] = useState(false);
  const { challengeType } = createChallengeStore();

  const [step, setStep] = useState(0);

  // const queryClient = useQueryClient();

  const stepBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="primary" className="mb-2 gap-2 max-sm:w-full">
          <Plus />
          Створити завдання
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <div className="inline-flex items-center flex-row gap-2 font-semibold text-zinc-500 -mt-3">
          <Button
            disabled={step == 0}
            onClick={stepBack}
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="text-zinc-400" />
          </Button>
          Створити завдання
        </div>
        <section className="flex-1">
          <AnimatePresence>
            <CreateChallengeSelectType
              key="create-challenge-select-type"
              current={step}
              setCurrent={setStep}
              index={0}
              active={challengeType}
            />
          </AnimatePresence>
          <CreateChallengeInputStep index={1} current={step} />
        </section>
      </DialogContent>
    </Dialog>
  );
};
