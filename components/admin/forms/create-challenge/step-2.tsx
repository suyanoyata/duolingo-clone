import { CreateBuildSentenceChallenge } from "@/components/admin/forms/challenge-forms/create-build-sentence-challenge";
import { CreateSelectChallenge } from "@/components/admin/forms/challenge-forms/create-select-challenge";
import { CreateSelectImageChallenge } from "@/components/admin/forms/challenge-forms/create-select-image-challenge";
import { motion } from "framer-motion";

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
