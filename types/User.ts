import { z } from "zod";

export const User = z.object({
  id: z.number(),
  hearts: z.number().max(5),

  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const UserWithoutId = User.omit({ id: true, hearts: true });
export const ClientUser = User.omit({ password: true });
export type CreateUser = z.infer<typeof UserWithoutId>;
export type User = z.infer<typeof ClientUser>;
