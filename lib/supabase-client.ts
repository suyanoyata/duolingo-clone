"use server";

import { createClient } from "@supabase/supabase-js";

export const supabase = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
};

export const upload = async (file: File, challengeId: number) => {
  const imageUpload = await supabase()
    .storage.from("images")
    .upload(`${challengeId}-challenge-image`, file);

  if (imageUpload.error) {
    throw { message: imageUpload.error };
  }

  const image = supabase()
    .storage.from("images")
    .getPublicUrl(`${challengeId}-challenge-image`);

  return image;
};
