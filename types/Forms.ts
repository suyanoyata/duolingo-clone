import { z } from "zod";
import validator from "validator";
import { ChallengeType } from "@prisma/client";

export const CourseCreateSchema = z.object({
  course_name: z.string().min(2, {
    message: "Назва курсу занадто коротка",
  }),
  course_code: z
    .string()
    .length(2, {
      message: "Код курсу має бути довжиною 2 символи",
    })
    .refine((value) => {
      const code = value.toUpperCase();
      return (
        validator.isISO31661Alpha2(code),
        {
          message: "Невідомий код курсу",
        }
      );
    }),
});

export const EditUnitSchema = z.object({
  name: z.string().min(4, {
    message: "Назва занадто коротка",
  }),
  description: z.string().min(8, {
    message: "Опис занадто короткий",
  }),
});

export const BaseChallengeSchema = z.object({
  question: z.string().min(4, {
    message: "Питання занадто коротке",
  }),
});

// #region create select challenge schema
export const CreateSelectChallengeSchema = BaseChallengeSchema.extend({
  options: z
    .array(
      z.string().refine((data) => data.trim().length > 0, {
        path: ["global"],
        message: "Всі варіанти відповідей повинні бути заповнені",
      })
    )
    .min(2, {
      message: "Варіантів відповідей занадто мало",
    })
    .max(3, {
      message: "Варіантів відповідей може бути максимум 3",
    }),
  answer: z.string(),
  global: z.null().optional(),
})
  .refine((data) =>
    data.options.every((option) => option.trim().length > 0, {
      message: "Всі варіанти відповідей повинні бути заповнені",
      path: ["global"],
    })
  )
  .refine((data) => new Set(data.options).size === data.options.length, {
    path: ["global"],
    message: "Варіанти відповідей не мають повторюватися",
  })
  .refine((data) => data.options.includes(data.answer), {
    message: "Відповідь має бути в списку варіантів",
    path: ["answer"],
  });
// #endregion

export const CreateBuildSentenceChallengeSchema = BaseChallengeSchema.extend({
  question: z.string().min(4, {
    message: "Питання занадто коротке",
  }),
  words: z.string().refine((data) => data.split(" ").length > 2, {
    message: "Введіть хоча би 3 додаткових слова",
  }),
  correct: z.string().refine((data) => data.split(" ").length > 3, {
    message: "Правильна відповідь повинна включати в себе хоча би 4 слова",
  }),
});

export const CreateSelectImageChallengeSchema = BaseChallengeSchema.extend({
  correct: z.string().min(4, {
    message: "Відповідь занадто коротка",
  }),
  words: z.array(z.object({ image: z.string(), word: z.string() })),
});

export type CourseCreateFormData = z.infer<typeof CourseCreateSchema>;
export type EditUnitFormData = z.infer<typeof EditUnitSchema>;

export type CreateSelectChallengeFormData = z.infer<
  typeof CreateSelectChallengeSchema
>;
export type CreateBuildSentenceFormData = z.infer<
  typeof CreateBuildSentenceChallengeSchema
>;
export type CreateSelectImageFormData = z.infer<
  typeof CreateSelectImageChallengeSchema
>;

export type ChallengeData = {
  type: ChallengeType;
  question: string;
  answer: string;
  options?: string[];
  words?: string[];
  correct: string[];
};
