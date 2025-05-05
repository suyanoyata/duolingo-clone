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
    queryFn: async () => {
      return await getCurrentUser();
    },
    enabled: true,
  });
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [loginAccountOpen, setLoginAccountOpen] = useState(false);

  const router = useRouter();

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (data) {
    return router.push("/learn");
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto">
      <section className="h-screen flex items-center justify-center flex-wrap">
        <div className="w-[400px] h-[400px] bg-zinc-100 rounded-lg overflow-hidden">
          <p className="text-zinc-300 text-sm font-bold -rotate-45 w-[550px] h-[600px] -translate-x-16 -translate-y-24 select-none text-justify">
            {Array.from({ length: 25 }).map(
              () =>
                "Привіт Hello 안녕하세요 Bonjour Witam Ahoj Γειά σου Hola こんにちは Ciao Xin chào مرحبًا Hei "
            )}
          </p>
        </div>
        <div className="text-center flex flex-col items-center w-[480px]">
          <h1 className="text-3xl font-extrabold text-zinc-700 mb-5">
            Простий та веселий шлях вивчити іноземну мову
          </h1>
          <div className="w-[280px]">
            <RegisterForm onOpenChange={setCreateAccountOpen} open={createAccountOpen} />
            <LoginForm onOpenChange={setLoginAccountOpen} open={loginAccountOpen}>
              В мене вже є аккаунт
            </LoginForm>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
