import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LoadingCircle } from "@/components/loading-overlay";
import { managementStore } from "@/store/user-store";
import { addNewLesson } from "@/actions/management/lessons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type CreateLesson = {
  name: string;
  isDirty: boolean;
};

export const CreateLesson = () => {
  const queryClient = useQueryClient();
  const { selectedLanguage } = managementStore();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (newLesson: CreateLesson) => {
      await addNewLesson({
        ...newLesson,
        language: selectedLanguage,
      }).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["language-lessons", selectedLanguage],
        });
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  const [open, setOpen] = useState<boolean>(false);
  const [create, setCreate] = useState<CreateLesson>({
    isDirty: false,
  } as CreateLesson);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        asChild
        className="focus:outline-none focus-visible:outline-none"
      >
        <Button variant="primary" className="ml-2">
          Add a new lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Add a new lesson</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col gap-2 mt-2">
          <Input
            onChange={(event) => {
              setCreate({
                ...create,
                name: event.target.value,
                isDirty: true,
              });
            }}
            label="Lesson Name"
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
            {!isPending && "Add a new lesson"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
