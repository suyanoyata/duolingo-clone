import { z } from "zod";

export const User = z.object({
  id: z.number(),
  email: z.string().email(),
});

export const UserWithoutId = User.omit({ id: true });

export type CreateUser = z.infer<typeof UserWithoutId>;
