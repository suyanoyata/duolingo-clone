import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { createChallengeStore } from "@/store/create-lesson-store";

import { CreateBuildSentenceChallengeSchema, CreateBuildSentenceFormData } from "@/types/Forms";

import { ChallengeType } from "@prisma/client";
import { SentenceChallengePreview } from "@/components/admin/challenge-previews/build-sentence-challenge-preview";

import { createBuildSentenceChallenge } from "@/actions/admin/admin.actions";

const CreateBuildSentenceChallengeFields: Array<{
  name: keyof CreateBuildSentenceFormData;
  label: string;
  placeholder?: string;
}> = [
  {
    name: "question",
    label: "Речення для перекладу",
    placeholder: 'Наприклад: "Я люблю великі міста"',
  },
  {
    name: "correct",
    label: "Правильна відповідь",
    placeholder: 'Наприклад: "I love big cities"',
  },
  {
    name: "words",
    label: "Додаткові слова для вибору (без розділових знаків)",
    placeholder: "Введіть додаткові слова, наприклад: countries people",
  },
];

export const CreateBuildSentenceChallenge = () => {
  const { challengeType, setOpen } = createChallengeStore();
  const { lessonId } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateBuildSentenceFormData>({
    resolver: zodResolver(CreateBuildSentenceChallengeSchema),
    defaultValues: {
      question: "",
      correct: "",
      words: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-challenge"],
    mutationFn: async (data: CreateBuildSentenceFormData) =>
      await createBuildSentenceChallenge(data, Number(lessonId)),
    onSuccess: () => {
      setOpen(false);
      toast.success("Завдання створено");
    },
  });

  const onSubmit = (data: CreateBuildSentenceFormData) => {
    mutate(data);
  };

  const question = watch("question");
  const correct = watch("correct");
  const words = watch("words");

  const canBePreviewed = question.trim() != "" && correct.trim() != "" && words.trim() != "";

  if (challengeType != ChallengeType.SENTENCE) return null;

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
          {CreateBuildSentenceChallengeFields.map((field) => (
            <div key={field.name}>
              <Input
                {...register(field.name)}
                label={field.label}
                placeholder={field.placeholder}
              />
              {errors[field.name] && (
                <p className="text-red-500 font-medium text-sm mt-1">
                  {errors[field.name]!.message}
                </p>
              )}
            </div>
          ))}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
            variant="primary"
          >
            Створити завдання
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="preview">
        <SentenceChallengePreview
          sentence={{
            words: words.split(" "),
            question: question,
            correct: correct.split(" "),
          }}
        />
      </TabsContent>
    </Tabs>
  );
};
