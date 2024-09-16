"use client";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRegisterFormData, UserRegisterSchema } from "@/types/User";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/actions/users/user.action";
import { LoadingCircle } from "../loading-overlay";
import { useRouter } from "next/navigation";
import { FieldError } from "../ui/field-error";
import { useEffect } from "react";

const fields = [
  {
    label: "Імʼя",
    name: "name",
  },
  {
    label: "Електронна адреса",
    name: "email",
  },
  {
    label: "Пароль",
    name: "password",
  },
];

export const RegisterForm = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (change: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(UserRegisterSchema),
  });

  const router = useRouter();

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationKey: ["create-user"],
    mutationFn: async (data: UserRegisterFormData) => {
      const user = await createUser(data);
      router.push("/learn");
      return user;
    },
  });

  useEffect(() => {
    if (error != null) {
      setError("root", {
        message: "Не вдалось створити аккаунт",
      });
    }
  }, [error]);

  const onSubmit = (data: UserRegisterFormData) => {
    mutate(data);
  };

  return (
    <div>
      <Button
        onClick={() => {
          onOpenChange(true);
        }}
        variant="secondary"
        className="w-full"
      >
        Створити аккаунт
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
                  Створити аккаунт
                </h1>
                <div className="flex flex-col gap-3">
                  {fields.map((field) => (
                    <div key={field.name}>
                      <Input
                        error={errors[field.name as "name"] !== undefined}
                        disabled={isPending || isSuccess}
                        type={field.name == "password" ? "password" : "text"}
                        placeholder={field.label}
                        {...register(field.name as "name")}
                      />
                      {errors[field.name as "name"] && (
                        <FieldError>
                          {errors[field.name as "name"]!.message}
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
                      "Створити"
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
