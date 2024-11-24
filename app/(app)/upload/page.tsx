"use client";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { LoadingCircle } from "@/components/loading-overlay";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);

  const { mutate: uploadImage, isPending } = useMutation({
    mutationKey: ["upload-image"],
    mutationFn: async () => {
      return await axios.post(
        "/api/image-upload/3",
        {
          file: files[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
  });

  return (
    <main className="p-2 flex-1">
      <FileUploader disabled={isPending} onValueChange={setFiles} />
      <Button
        disabled={isPending}
        onClick={() => uploadImage()}
        className="w-full mt-3"
        variant="ghost"
      >
        {!isPending && "Upload"}
        {isPending && <LoadingCircle />}
      </Button>
    </main>
  );
}
