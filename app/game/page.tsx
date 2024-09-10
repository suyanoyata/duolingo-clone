"use client";

import { getUsers } from "@/actions/users/user.action";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const {
    data: users,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryFn: async () => await getUsers(),
    queryKey: ["users"],
    staleTime: 1000 * 60 * 1,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <p className="text-sm font-medium h-screen w-full flex justify-center items-center">
        Loading...
      </p>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen gap-1">
        <p className="text-sm font-medium">database error, check logs</p>
        <p className="text-sm font-medium">{JSON.stringify(error)}</p>
        <Button
          variant="destructive"
          onClick={() => {
            refetch();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (users!.length == 0) {
    return <p className="text-sm font-medium">No users in database</p>;
  }

  return (
    <div className="mx-auto max-w-[900px] px-2">
      <div className="flex gap-3 items-center mt-3">
        <p className="text-3xl max-[410px]:text-xl font-extrabold self-start">
          All users in database
        </p>
        <Button
          onClick={() => {
            refetch();
          }}
          size="sm"
          variant="secondary"
        >
          Refresh
        </Button>
      </div>
      {users!.map((user) => (
        <div className="text-sm font-medium" key={user.id}>
          {user.email}
        </div>
      ))}
    </div>
  );
}
