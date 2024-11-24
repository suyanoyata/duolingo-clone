import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createChallengeStore } from "@/store/create-lesson-store";
import {
  CreateSelectChallengeFormData,
  CreateSelectChallengeSchema,
} from "@/types/Forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChallengeType } from "@prisma/client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

const CreateSelectChallengeFields = [
  {
    name: "question",
    label: "Запитання",
    placeholder: 'Наприклад: Як перекладається слово "літак?"',
  },
  {
    name: "answer",
    label: "Правильна відповідь",
  },
];

const CreateSelectChallenge = () => {
  const { challengeType } = createChallengeStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSelectChallengeFormData>({
    resolver: zodResolver(CreateSelectChallengeSchema),
  });

  const onSubmit = (data: CreateSelectChallengeFormData) => {
    console.log(data);
  };

  if (challengeType == ChallengeType.SELECT) {
    return (
      <form className="space-y-2">
        {CreateSelectChallengeFields.map((field) => (
          <div key={field.name}>
            <Input
              {...register(field.name as "question")}
              label={field.label}
              placeholder={field.placeholder}
            />
            {errors[field.name as "name"] && (
              <p className="text-red-500 font-medium text-sm">
                {errors[field.name as "name"]!.message}
              </p>
            )}
          </div>
        ))}
        {/* <Input label="Варіанти" placeholder="Наприклад: Plane" />
        <Input placeholder="Наприклад: Helicopter" />
        <Input placeholder="Наприклад: Jet" /> */}
        <Button
          className="w-full"
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          type="submit"
        >
          Створити
        </Button>
      </form>
    );
  }
};

const CreateSelectImageChallenge = () => {
  const { challengeType } = createChallengeStore();

  if (challengeType == ChallengeType.SELECT_IMAGE) {
    return <div>creating select image challenge</div>;
  }
};

const CreateBuildSentenceChallenge = () => {
  const { challengeType } = createChallengeStore();

  if (challengeType == ChallengeType.SENTENCE) {
    return <div>creating build sentence challenge</div>;
  }
};

export const CreateChallengeInputStep = ({
  index,
  current,
}: {
  index: number;
  current: number;
}) => {
  if (current != index) return null;

  return (
    <motion.div
      className="flex-1"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, type: "tween" }}
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -20 }}
    >
      <CreateSelectChallenge />
      <CreateSelectImageChallenge />
      <CreateBuildSentenceChallenge />
    </motion.div>
  );
};
