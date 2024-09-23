import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Language } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { subscribeToCourse } from "@/actions/users/user.action";
import { LoadingCircle } from "../loading-overlay";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const CourseSubscribe = ({
  courseId,
  open,
  setOpen,
}: {
  courseId: number;
  open: boolean;
  setOpen: (b: boolean) => void;
}) => {
  const { data } = useQuery<Language[]>({
    queryKey: ["language-courses"],
  });

  const router = useRouter();

  const client = useQueryClient();

  const { mutate, isPending, isSuccess, isError, reset } = useMutation({
    mutationKey: ["subscribe-course"],
    mutationFn: async (code: string) => {
      const course = await subscribeToCourse(code, courseId);
      return course;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      client.invalidateQueries({
        queryKey: ["current-user-courses"],
      });
      const course = data?.filter((course) => course.id === courseId);
      if (course) {
        router.push(`/learn/${course[0].code}`);
      }
    }
  }, [isSuccess, client, courseId, data, router]);

  useEffect(() => {
    if (courseId == 0) {
      reset();
    }
  }, [courseId, reset]);

  const course = data?.filter((course) => course.id === courseId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {course && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ви не підписані на цей курс</DialogTitle>
            <DialogDescription className="text-zinc-600">
              Підпишіться на курс{" "}
              <span className="font-bold text-zinc-800">
                {course[0]?.name} мова
              </span>{" "}
              та почніть вивчати її вже зараз
            </DialogDescription>
            <Button
              onClick={() => {
                mutate(course[0].code);
              }}
              disabled={isPending}
              variant="secondary"
              className="mt-4"
            >
              {!isPending && "Підписатись"}
              {isPending && <LoadingCircle className="text-white" />}
            </Button>
            {isError && (
              <p className="text-red-500 text-sm font-medium">
                Не вдалось підписатись на курс, спробуйте пізніше
              </p>
            )}
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
};
