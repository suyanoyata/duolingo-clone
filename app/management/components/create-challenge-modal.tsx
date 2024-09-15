import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LoadingCircle } from "@/components/loading-overlay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useForm } from "react-hook-form";
import { createChallenge } from "@/actions/management/challenges";
import { managementStore } from "@/store/user-store";
import { ManagementCenterText } from "./management-center-text";

type CreateChallenge = {
  code: string;
  name: string;
  type: string;
  sentence: string;
};

const sentenceChallengeFields = [
  {
    label: "Sentence text",
    name: "sentence",
    required: true,
  },
  {
    label: "Translate",
    name: "translate",
    required: true,
  },
];

export const CreateChallenge = ({ lesson }: { lesson: number }) => {
  const { selectedLanguage } = managementStore();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (newChallenge: never) =>
      await createChallenge(newChallenge),
    onSuccess: () => {
      setOpen(false);
    },
  });

  const [open, setOpen] = useState<boolean>(false);

  const [create, setCreate] = useState<CreateChallenge>({} as CreateChallenge);

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm();

  const onSubmit = (data: object) => {
    const formData: {
      language: string;
      lesson: number;
      bait: string;
      code: string;
      name: string;
      type: string;
      sentence: string;
    } = {
      ...data,
      ...create,
      language: selectedLanguage,
      lesson,
      bait: "song music cinema",
    };
    // @ts-expect-error - fix typing error for this call
    mutate(formData);
  };

  const SubmitButton = () => {
    return (
      <Button
        type="submit"
        disabled={
          isPending ||
          (isError && !isDirty) ||
          create.type == "select" ||
          !create.type
        }
        variant="primary"
        className="relative"
      >
        {isPending && <LoadingCircle />}
        {!isPending && "Create challenge"}
      </Button>
    );
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        asChild
        className="focus:outline-none focus-visible:outline-none"
      >
        <Button variant="primary" className="ml-2">
          Create challenge
        </Button>
      </DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Create challenge</DialogTitle>
        </VisuallyHidden>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mt-2"
        >
          <Select
            onValueChange={(type) => {
              setCreate({
                ...create,
                type,
              });
            }}
          >
            <div>
              <p className="font-bold text-slate-700 text-base select-none">
                Select challenge type
              </p>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Challenge type" />
              </SelectTrigger>
            </div>
            <SelectContent>
              <SelectItem value="sentence">Sentence</SelectItem>
              <SelectItem value="select">Select</SelectItem>
            </SelectContent>
          </Select>
          {sentenceChallengeFields.map((field) => (
            <div key={field.name}>
              <Input
                {...register(field.name, {
                  required: field.required,
                })}
                label={field.label}
              />
              {errors[field.name]?.type == "required" && (
                <ManagementCenterText>
                  This field is required
                </ManagementCenterText>
              )}
            </div>
          ))}
          {isError && <p className="text-red-400">{JSON.stringify(error)}</p>}
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
};
