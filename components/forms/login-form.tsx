"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { loginUser } from "@/actions/users/user.action";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { LoadingCircle } from "@/components/loading-overlay";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";

import { UserLoginFormData, UserLoginSchema } from "@/types/User";

const fields = [
  {
    label: "Електронна адреса",
    name: "email",
  },
  {
    label: "Пароль",
    name: "password",
  },
];

export const LoginForm = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (change: boolean) => void;
  children: React.ReactNode;
}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty = true },
  } = useForm<UserLoginFormData>({
    resolver: zodResolver(UserLoginSchema),
  });

  const router = useRouter();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (data: UserLoginFormData) => {
      const user = await loginUser(data);
      return user;
    },
    onSuccess: () => router.push("/learn"),
    onError: () => {
      setError("root", {
        message: "Не вдалось увійти в аккаунт",
      });
    },
  });

  const onSubmit = (data: UserLoginFormData) => {
    mutate(data);
  };

  return (
    <div>
      <Button
        onClick={() => {
          onOpenChange(true);
        }}
        className="w-full mt-3"
      >
        {children}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <div className="absolute top-0 left-0 h-screen w-full bg-white flex items-center justify-center">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white flex-1 max-w-[400px]"
              >
                <X
                  className="absolute top-4 left-4 text-zinc-600 cursor-pointer"
                  onClick={() => {
                    onOpenChange(false);
                  }}
                />
                <h1 className="font-extrabold text-2xl text-center mb-6 text-zinc-700 select-none">
                  Увійти
                </h1>
                <div className="flex flex-col gap-3">
                  {fields.map((field) => (
                    <div key={field.name}>
                      <Input
                        error={errors[field.name as "email"] !== undefined}
                        disabled={isPending || isSuccess}
                        type={field.name == "password" ? "password" : "text"}
                        placeholder={field.label}
                        {...register(field.name as "email")}
                      />
                      {errors[field.name as "email"] && (
                        <FieldError>
                          {errors[field.name as "email"]!.message}
                        </FieldError>
                      )}
                    </div>
                  ))}
                  <Button
                    disabled={isPending || isSuccess || !isDirty}
                    type="submit"
                    variant="secondary"
                    className="mt-2"
                  >
                    {!(isPending || isSuccess) ? (
                      "Увійти"
                    ) : (
                      <LoadingCircle className="text-white" />
                    )}
                  </Button>
                  {errors.root && (
                    <FieldError>{errors.root.message}</FieldError>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
