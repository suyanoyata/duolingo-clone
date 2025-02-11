"server-only";

import { createClient } from "@supabase/supabase-js";

export const supabase = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
};

type UploadImageResponse = {
  data: UploadImageData;
  error?: UploadImageError;
};

type UploadImageData = {
  publicUrl: string;
};

type UploadImageError = {
  message: string;
};

export const upload = async (
  file: File,
  challengeId: number
): Promise<UploadImageResponse> => {
  const imageUpload = await supabase()
    .storage.from("images")
    .upload(`${challengeId}-challenge-image`, file);

  if (imageUpload.error) {
    throw {
      error: {
        message: imageUpload.error,
      },
    };
  }

  const image = supabase()
    .storage.from("images")
    .getPublicUrl(`${challengeId}-challenge-image`);

  return image;
};
