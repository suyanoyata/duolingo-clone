import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { addNewWord } from "@/actions/management/languages";
import { LoadingCircle } from "@/components/loading-overlay";
import { managementStore } from "@/store/user-store";

type CreateWord = {
  text: string;
  meaning: string;
  language: string;
  isDirty: boolean;
};

export const CreateWord = () => {
  const { invalidateQueries } = useQueryClient();
  const { selectedLanguage } = managementStore();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (newWord: CreateWord) => {
      await addNewWord({
        ...newWord,
        language: selectedLanguage,
      }).then(() => {
        invalidateQueries({ queryKey: ["language-words", selectedLanguage] });
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  const [open, setOpen] = useState<boolean>(false);
  const [create, setCreate] = useState<CreateWord>({
    isDirty: false,
  } as CreateWord);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        asChild
        className="focus:outline-none focus-visible:outline-none"
      >
        <Button variant="primary" className="ml-2">
          Add a new word
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2 mt-2">
          <Input
            onChange={(event) => {
              setCreate({
                ...create,
                text: event.target.value,
                isDirty: true,
              });
            }}
            label="Word"
            maxLength={32}
          />
          <Input
            onChange={(event) => {
              setCreate({
                ...create,
                meaning: event.target.value,
                isDirty: true,
              });
            }}
            label="Meaning"
            maxLength={32}
          />
          {isError && <p className="text-red-400">{JSON.stringify(error)}</p>}
          <Button
            onClick={() => {
              mutate(create);
            }}
            disabled={isPending || (isError && !create.isDirty)}
            variant="primary"
            className="relative"
          >
            {isPending && <LoadingCircle />}
            {!isPending && "Add a new word"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
