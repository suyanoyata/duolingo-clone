import { Plus, Trash2 } from "lucide-react";

import { createSelectChallenge } from "@/actions/admin/admin.actions";

import { SelectChallengePreview } from "@/components/admin/challenge-previews/select-challenge-preview";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { createChallengeStore } from "@/store/create-lesson-store";

import {
  CreateSelectChallengeFormData,
  CreateSelectChallengeSchema,
} from "@/types/Forms";
import { ChallengeType } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export const CreateSelectChallenge = () => {
  const { challengeType } = createChallengeStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateSelectChallengeFormData>({
    resolver: zodResolver(CreateSelectChallengeSchema),
    defaultValues: {
      options: [""],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-challenge"],
    mutationFn: async (data: CreateSelectChallengeFormData) =>
      createSelectChallenge(
        {
          ...data,
          type: ChallengeType.SELECT,
        },
        Number(params.lessonId)
      ),
  });

  const question = watch("question");
  const answer = watch("answer");
  const options = watch("options");

  const params = useParams();

  const allOptionsProvided =
    options.every((option) => option.trim().length > 0) && options.length != 0;

  const canBePreviewed =
    question != "" && allOptionsProvided && options.includes(answer);

  const onSubmit = (data: CreateSelectChallengeFormData) => {
    mutate(data);
  };

  if (challengeType == ChallengeType.SELECT) {
    return (
      <Tabs defaultValue="form">
        <TabsList>
          <TabsTrigger value="form">Змінити</TabsTrigger>
          <TabsTrigger disabled={isPending || !canBePreviewed} value="preview">
            Попередній перегляд
          </TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <form className="space-y-2">
            <Input
              {...register("question")}
              label="Запитання"
              placeholder="Наприклад: Як перекладається слово 'літак'?"
            />
            {errors.question && (
              <p className="text-red-500 font-medium text-sm">
                {errors.question.message}
              </p>
            )}
            <div>
              <p className="font-bold text-zinc-700 text-base select-none">
                Правильна відповідь
              </p>
              <Select onValueChange={(value) => setValue("answer", value)}>
                <SelectTrigger
                  disabled={!allOptionsProvided}
                  className="h-11 text-base"
                >
                  {answer != undefined ? answer : "Оберіть відповідь"}
                </SelectTrigger>
                <SelectContent>
                  {allOptionsProvided &&
                    options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {watch("options").map((_, index) => (
              <div key={index} className="flex flex-row items-center">
                <Input
                  {...register(`options.${index}`)}
                  label={`Варіант ${index + 1}`}
                  placeholder="Введіть варіант"
                />
                <Button
                  type="button"
                  className="mt-[27px] ml-2"
                  onClick={() => {
                    if (options[index] === answer) {
                      setValue("answer", undefined as unknown as string);
                    }
                    setValue(
                      "options",
                      options.filter((_, i) => i !== index)
                    );
                  }}
                  variant="destructive"
                >
                  <Trash2 size={18} className="text-white" />
                </Button>
              </div>
            ))}
            <Button
              className="w-full"
              type="button"
              disabled={watch("options").length >= 3}
              onClick={() => {
                setValue("options", [...watch("options"), ""]);
              }}
            >
              <Plus size={18} />
            </Button>
            {errors.options && (
              <p className="text-red-500 font-medium text-sm">
                {errors.options.message}
              </p>
            )}
            <Button
              disabled={isPending || !canBePreviewed}
              className="w-full"
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              type="submit"
            >
              Створити завдання
            </Button>
            {errors.global && (
              <p className="text-red-500 font-medium text-sm">
                {errors.global.message}
              </p>
            )}
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <SelectChallengePreview
            select={{
              options: watch("options"),
              question: watch("question"),
              answer: watch("answer"),
            }}
          />
        </TabsContent>
      </Tabs>
    );
  }
};
