import { useState } from "react";
import { LoadingCircle } from "./loading-overlay";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { clearSession } from "@/lib/session-helper";
import { useRouter } from "next/navigation";

export const Logout = () => {
  const [quitPending, setQuitPending] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  return (
    <Button
      onClick={() => {
        setQuitPending(true);
        clearSession();
        queryClient.clear();
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }}
      disabled={quitPending}
      className="mt-2 w-[200px]"
      variant="secondary"
    >
      {!quitPending && "Вийти"}
      {quitPending && <LoadingCircle className="text-white" />}
    </Button>
  );
};
