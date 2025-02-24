import { SelectImageChallengePreview } from "@/components/admin/challenge-previews/select-image-challenge-preview";

import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { createChallengeStore } from "@/store/create-lesson-store";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChallengeType } from "@prisma/client";
import { CreateSelectImageChallengeSchema, CreateSelectImageFormData } from "@/types/Forms";
import { useMutation } from "@tanstack/react-query";
import { createSelectImageChallenge } from "@/actions/admin/admin.actions";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

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
];

export const CreateSelectImageChallenge = () => {
  const params = useParams();

  const { challengeType, setOpen } = createChallengeStore();

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["create-challenge"],
    mutationFn: async (data: CreateSelectImageFormData) => {
      const formData = new FormData();

      data.options.forEach((file) => {
        const image = file.image as unknown as File;
        if (!image) return;
        formData.append("images", image);
      });

      createSelectImageChallenge(
        {
          ...data,
          options: undefined,
          imageOptions: data.options.map((option) => ({
            word: option.word,
          })),
          type: ChallengeType.SELECT_IMAGE,
        },
        formData,
        Number(params.lessonId)
      );
    },
    onSuccess: () => {
      setOpen(false);
      toast.success("Завдання створено");
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<CreateSelectImageFormData>({
    defaultValues: {
      options: [{ image: null, word: "" }],
    },
    resolver: zodResolver(CreateSelectImageChallengeSchema),
  });

  const onSubmit = (data: CreateSelectImageFormData) => {
    mutate(data);
  };

  const options = watch("options");
  const question = watch("question");
  const answer = watch("answer");

  const allOptionsProvided =
    options.every((option) => option.image != null && option.word.trim().length > 0) &&
    options.length != 0;

  const canBePreviewed =
    allOptionsProvided && question.trim().length > 4 && answer && answer.trim().length > 4;

  function updateWord(index: number, file: File) {
    const values = getValues();

    const newItems = [...values.options];

    newItems[index].image = file;

    setValue("options", newItems);
  }

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
                <FieldError>{errors[field.name]?.message as string}</FieldError>
              )}
            </div>
          ))}
          <div>
            <p className="font-bold text-zinc-700 text-base select-none">Правильна відповідь</p>
            <Select onValueChange={(value) => setValue("answer", value)}>
              <SelectTrigger disabled={!allOptionsProvided} className="h-11 text-base">
                {answer != undefined ? answer : "Оберіть відповідь"}
              </SelectTrigger>
              <SelectContent>
                {allOptionsProvided &&
                  options.map((option, index) => (
                    <SelectItem key={index} value={option.word}>
                      {option.word}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {watch("options").map((_, index) => (
            <section key={index}>
              <label
                htmlFor={`Варіант ${index + 1}`}
                className="font-bold text-zinc-700 text-base select-none"
              >
                {`Варіант ${index + 1}`}
              </label>
              <Controller
                control={control}
                name={`options.${index}.word`}
                render={({ field }) => (
                  <section>
                    <div className="flex gap-2">
                      <Input
                        id={`${index}-image`}
                        accept="image/*"
                        multiple={false}
                        onChange={(e) => e.target.files && updateWord(index, e.target.files[0])}
                        type="file"
                        className="text-sm text-zinc-400 font-medium"
                      />
                      <Input {...field} className="flex-1" placeholder="Введіть варіант" />
                    </div>
                    {errors.options && errors.options[index] && (
                      <FieldError>{errors.options[index].message}</FieldError>
                    )}
                  </section>
                )}
              />
            </section>
          ))}
          <Button
            className="w-full"
            type="button"
            disabled={watch("options").length >= 3}
            onClick={() => {
              setValue("options", [
                ...watch("options"),
                {
                  image: null,
                  word: "",
                },
              ]);
            }}
          >
            <Plus size={18} />
          </Button>
          <Button
            disabled={isPending}
            className="w-full"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            type="submit"
          >
            Створити завдання
          </Button>
          {isError && <FieldError>Something went wrong</FieldError>}
        </form>
      </TabsContent>
      <TabsContent value="preview">
        <SelectImageChallengePreview
          challenge={{
            question: watch("question"),
            correct: watch("answer"),
            words: watch("options").map((value) => ({
              image: value.image ? URL.createObjectURL(value.image) : "",
              word: value.word,
            })),
          }}
        />
      </TabsContent>
    </Tabs>
  );
};
