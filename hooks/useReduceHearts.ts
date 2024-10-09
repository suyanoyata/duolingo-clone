import { reduceHearts } from "@/actions/users/user.action";
import { clientStore } from "@/store/user-store";
import { User } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useReduceHearts = () => {
  const { isPreviousChallengeCompleting } = clientStore();

  const queryClient = useQueryClient();
  const { data: user, refetch } = useQuery<User>({
    queryKey: ["user"],
  });

  const reduceUserHearts = async () => {
    if (!isPreviousChallengeCompleting && user && user.hearts > 0) {
      queryClient.setQueryData(["user"], (oldData: User) => {
        return {
          ...oldData,
          hearts: oldData.hearts - 1,
        };
      });
      reduceHearts().then(() => {
        refetch();
      });
    }
  };

  return { reduceUserHearts };
};
