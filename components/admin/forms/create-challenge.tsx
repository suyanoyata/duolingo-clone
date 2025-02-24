"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AnimatePresence } from "framer-motion";

import { ChevronLeft, Plus } from "lucide-react";

import { CreateChallengeSelectType } from "./create-challenge/step-1";
import { CreateChallengeInputStep } from "./create-challenge/step-2";

import { createChallengeStore } from "@/store/create-lesson-store";
import { useMutation } from "@tanstack/react-query";

export const CreateChallenge = () => {
  const { setChallengeType, open, setOpen } = createChallengeStore();

  const [step, setStep] = useState(0);

  const stepBack = () => {
    if (step > 0) setStep(step - 1);
  };

  useMutation({
    mutationKey: ["create-challenge"],
    onSuccess: () => {
      setOpen(false);
    },
  });

  useEffect(() => {
    return () => {
      setTimeout(() => {
        if (!open) {
          setStep(0);
          setChallengeType(undefined);
        }
      }, 50);
    };
  }, [open]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="primary" className="mb-2 gap-2 max-sm:w-full">
          <Plus />
          Створити завдання
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col overflow-hidden">
        <div className="inline-flex items-center flex-row gap-2 font-semibold text-zinc-500 -mt-3">
          <Button disabled={step == 0} onClick={stepBack} variant="ghost" size="sm">
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
            />
          </AnimatePresence>
          <CreateChallengeInputStep index={1} current={step} />
        </section>
      </DialogContent>
    </Dialog>
  );
};
