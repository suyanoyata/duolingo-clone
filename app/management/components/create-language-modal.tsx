import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { addNewLanguage } from "@/actions/management/languages";
import { LoadingCircle } from "@/components/loading-overlay";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type CreateLanguage = {
  code: string;
  name: string;
  isDirty: boolean;
};

export const CreateLanguage = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (newLanguage: CreateLanguage) => {
      await addNewLanguage(newLanguage).then(() => {
        queryClient.invalidateQueries({ queryKey: ["available-languages"] });
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  const [open, setOpen] = useState<boolean>(false);
  const [create, setCreate] = useState<CreateLanguage>({
    isDirty: false,
  } as CreateLanguage);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        asChild
        className="focus:outline-none focus-visible:outline-none"
      >
        <Button variant="primary" size="icon" className="ml-2">
          <Plus size={16} className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Add language</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col gap-2 mt-2">
          <Input
            onChange={(event) => {
              setCreate({
                ...create,
                code: event.target.value,
                isDirty: true,
              });
            }}
            label="Language code"
            maxLength={2}
          />
          <Input
            onChange={(event) => {
              setCreate({
                ...create,
                name: event.target.value,
                isDirty: true,
              });
            }}
            label="Language name"
            maxLength={16}
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
            {!isPending && "Add language"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
