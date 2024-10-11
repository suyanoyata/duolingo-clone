import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { changeNickname, nicknameExists } from "@/actions/users/user.action";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { LoadingCircle } from "../loading-overlay";

export const ChangeNickname = ({ nickname }: { nickname: string }) => {
  const [name, setName] = useState<string>(nickname);
  const requestName = useDebounce(name, 500);

  const queryClient = useQueryClient();

  const {
    data: isNicknameTaken,
    mutate,
    isPending,
  } = useMutation({
    mutationKey: ["user-exists", requestName],
    mutationFn: async (name: string) => {
      if (name == "") return undefined;
      if (name.length < 2) return undefined;
      return await nicknameExists(name);
    },
  });

  const { mutate: changeName, isPending: isNicknameChangePending } =
    useMutation({
      mutationKey: ["changing-nickname", requestName],
      mutationFn: async (name: string) => {
        return await changeNickname(name);
      },
      onSuccess: (result) => {
        queryClient.setQueryData(["user"], () => {
          return result;
        });
      },
    });

  useEffect(() => {
    if (nickname == requestName) return;
    mutate(requestName);
  }, [requestName, mutate, nickname, name]);

  return (
    <section className="flex flex-row min-[640px]:items-end gap-2 max-sm:flex-col max-sm:justify-end max-sm:items-normal">
      <div className="flex flex-row items-center flex-1 relative">
        <div className="flex-1">
          <Input
            onChange={(event) => setName(event.target.value)}
            disabled={isNicknameChangePending}
            className="pr-8"
            label="Імʼя користувача"
            value={name}
          />
        </div>
        {!isNicknameTaken && isNicknameTaken != undefined && (
          <Check className="text-green-400 mt-7 absolute right-4" />
        )}
        {!!isNicknameTaken && isNicknameTaken != undefined && (
          <X className="text-red-400 mt-7 absolute right-4" />
        )}
      </div>
      <Button
        onClick={() => changeName(requestName)}
        className="min-[640px]:w-[100px]"
        disabled={
          isPending ||
          isNicknameTaken == undefined ||
          isNicknameTaken == true ||
          isNicknameChangePending
        }
        variant="secondary"
      >
        {!isNicknameChangePending ? (
          "Змінити"
        ) : (
          <LoadingCircle className="text-white" />
        )}
      </Button>
    </section>
  );
};
