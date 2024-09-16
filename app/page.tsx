"use client";

import { getCurrentUser } from "@/actions/users/user.action";
import { RegisterForm } from "@/components/forms/register-form";
import { LoadingOverlay } from "@/components/loading-overlay";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";

export default function Home() {
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getCurrentUser(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 1,
    enabled: true,
  });
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [loginAccountOpen, setLoginAccountOpen] = useState(false);

  const router = useRouter();

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (data) {
    router.push("/learn");
    return;
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section className="h-screen flex items-center justify-center flex-wrap">
        <div className="w-[400px] h-[400px] bg-zinc-100 rounded-lg flex items-center justify-center">
          <p className="text-zinc-300 text-sm font-bold">
            todo: add some sort of avatar there
          </p>
        </div>
        <div className="text-center flex flex-col items-center w-[480px]">
          <h1 className="text-3xl font-extrabold text-zinc-700 mb-5">
            Простий та веселий шлях вивчити іноземну мову
          </h1>
          <div className="w-[280px]">
            <RegisterForm
              onOpenChange={setCreateAccountOpen}
              open={createAccountOpen}
            />
            <LoginForm
              onOpenChange={setLoginAccountOpen}
              open={loginAccountOpen}
            >
              В мене вже є аккаунт
            </LoginForm>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
