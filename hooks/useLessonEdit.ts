import { GameLesson } from "@/types/Game";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLessonEdit = (
  lesson: GameLesson[],
  index: number,
  lessonId: number,
) => {
  const queryClient = useQueryClient();

  const { mutate: editLesson } = useMutation({
    mutationKey: ["edit-lesson"],
    mutationFn: async () => {
      return [...lesson!.filter((a) => a !== lesson![index]), lesson![index]];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["lesson", lessonId], data);
    },
  });

  return { editLesson };
};
