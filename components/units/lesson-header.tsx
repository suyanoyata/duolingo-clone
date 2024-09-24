import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { User } from "@prisma/client";
import { QuitLessonModal } from "./quit-lesson-modal-confirm";
import { clientStore } from "@/store/user-store";

export const LessonHeader = ({
  user,
  length,
}: {
  user: User;
  length: number;
}) => {
  const { currentChallengeIndex } = clientStore();
  return (
    <div className="flex gap-2 items-center">
      <QuitLessonModal />
      <div className="w-full h-[12px] bg-zinc-100 rounded-full overflow-hidden">
        <motion.div
          animate={{
            width: (currentChallengeIndex / length) * 100 + "%",
          }}
          transition={{ duration: 0.8 }}
          className="w-0 bg-green-400 h-full rounded-full"
        />
      </div>
      <Button variant="ghost" size="sm" className="text-zinc-700">
        <Heart className="fill-red-500 mr-1" size={18} strokeWidth={0} />
        {user.hearts}
      </Button>
    </div>
  );
};
