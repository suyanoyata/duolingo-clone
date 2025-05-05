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

class UploadService {
  public async createBucket(challengeId: number) {
    return await supabase().storage.createBucket(`${challengeId}-lesson`, {
      public: true,
    });
  }

  public async upload(challengeId: number, file: File) {
    const { error } = await supabase().storage.getBucket(`${challengeId}-lesson`);

    if (error) {
      throw new Error("Something went wrong while getting storage bucket.");
    }

    const id = crypto.randomUUID();

    await supabase().storage.from(`${challengeId}-lesson`).upload(id, file);

    return supabase().storage.from(`${challengeId}-lesson`).getPublicUrl(id);
  }
}

export default new UploadService();

export const upload = async (file: File, challengeId: number): Promise<UploadImageResponse> => {
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

  const image = supabase().storage.from("images").getPublicUrl(`${challengeId}-challenge-image`);

  return image;
};
