"use client";

import { getSession } from "@/actions/users/user.action";
import { clientStore } from "@/store/user-store";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/components/loading-overlay";
import { MotionConfig } from "framer-motion";

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState<QueryClient>(() => new QueryClient());
  // const { setUser, isPending, setIsPending } = clientStore();

  // useEffect(() => {
  //   getSession()
  //     .then((user) => {
  //       setUser(user);
  //       setIsPending(false);
  //     })
  //     .catch(() => {
  //       setIsPending(false);
  //     });
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <div className="relative">
          {/* {isPending && <LoadingOverlay />} */}
          {children}
        </div>
      </MotionConfig>
    </QueryClientProvider>
  );
};

export default ClientProviders;
