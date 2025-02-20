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
    name: "answer",
    label: "Правильна відповідь",
    placeholder: "Введіть правильну відповідь",
  },
];

export const CreateSelectImageChallenge = () => {
  const params = useParams();

  const { challengeType } = createChallengeStore();

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["create-challenge"],
    mutationFn: async (data: CreateSelectImageFormData) => {
      const formData = new FormData();

      console.log(data);
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
      question: "test",
      answer: "test",
      options: [{ image: null, word: "test" }],
    },
    resolver: zodResolver(CreateSelectImageChallengeSchema),
  });

  // useEffect(() => {
  //   console.log(errors);
  // }, [errors]);

  const onSubmit = (data: CreateSelectImageFormData) => {
    mutate(data);
  };

  const canBePreviewed = true;

  function updateWord(index: number, file: File) {
    const values = getValues();

    const newItems = [...values.options];

    newItems[index].image = file;
    console.log(newItems);

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
                      {/* <label htmlFor={`${index}-image`}>
                        <Button type="button">Зображення</Button>
                      </label> */}
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
