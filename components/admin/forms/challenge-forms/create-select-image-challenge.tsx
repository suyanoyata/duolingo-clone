import { SelectImageChallengePreview } from "@/components/admin/challenge-previews/select-image-challenge-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createChallengeStore } from "@/store/create-lesson-store";
import {
  CreateSelectImageChallengeSchema,
  CreateSelectImageFormData,
} from "@/types/Forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChallengeType } from "@prisma/client";
import { useForm } from "react-hook-form";

const CreateSelectImageChallengeFields: Array<{
  name: keyof CreateSelectImageFormData;
  label: string;
  placeholder?: string;
}> = [
  {
    name: "question",
    label: "Запитання",
    placeholder: 'Наприклад: Як перекладається слово "літак?"',
  },
  {
    name: "correct",
    label: "Правильна відповідь",
    placeholder: "Введіть правильну відповідь",
  },
];

export const CreateSelectImageChallenge = () => {
  const { challengeType } = createChallengeStore();

  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateSelectImageChallengeSchema),
  });

  const isPending = false;
  const canBePreviewed = true;

  if (challengeType !== ChallengeType.SELECT_IMAGE) return null;

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
          {CreateSelectImageChallengeFields.map((field) => (
            <div key={field.name}>
              <Input
                {...register(field.name)}
                label={field.label}
                placeholder={field.placeholder}
              />
              {errors[field.name as "question"] && (
                <p className="text-red-500 font-medium text-sm">
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          ))}
          {/* {watch("options").map((_, index) => (
              <Input
                key={index}
                {...register(`options.${index}`)}
                label={`Варіант ${index + 1}`}
                placeholder="Введіть варіант"
              />
            ))} */}
          {/* <Button
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
          )} */}
          <Button
            disabled={isPending}
            className="w-full"
            variant="primary"
            // onClick={handleSubmit(onSubmit)}
            type="submit"
          >
            Створити завдання
          </Button>
          {/* {errors.global && (
              <p className="text-red-500 font-medium text-sm">
                {errors.global.message}
              </p>
            )} */}
        </form>
      </TabsContent>
      <TabsContent value="preview">
        <SelectImageChallengePreview
          challenge={{
            question: "Test question",
            correct: "Correct",
            words: [
              {
                image: "http://localhost:3000/select-challenge.png",
                word: "Incorrect",
              },
              {
                image: "http://localhost:3000/create-sentence.png",
                word: "Correct",
              },
            ],
          }}
        />
      </TabsContent>
    </Tabs>
  );
};
