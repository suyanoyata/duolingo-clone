import { z } from "zod";
import validator from "validator";

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

export type CourseCreateFormData = z.infer<typeof CourseCreateSchema>;
export type EditUnitFormData = z.infer<typeof EditUnitSchema>;
