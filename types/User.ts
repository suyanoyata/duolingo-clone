import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email({
    message: "Введіть коректну електронну адресу",
  }),
  password: z.string().min(6, {
    message: "Ваш пароль занадто короткий",
  }),
});

export const UserRegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: "Імʼя занадто коротке",
      })
      .max(32),
  })
  .extend(UserLoginSchema.shape);

export const User = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  hearts: z.number(),
  experience: z.number(),
  score: z.number(),
  joinedAt: z.date(),
  progressId: z.number().nullable(),
});

export type UserLoginFormData = z.infer<typeof UserLoginSchema>;
export type UserRegisterFormData = z.infer<typeof UserRegisterSchema>;
