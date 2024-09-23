import { X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { clientStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

export const QuitLessonModal = () => {
  const [open, setOpen] = useState(false);
  const { lastLanguageCode } = clientStore();

  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <X className="stroke-zinc-600" size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Зачекайте!</DialogTitle>
        <p className="text-zinc-600 font-medium">
          Ви справді хочете закінчити урок? Ви не зможете повернутися до нього.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setOpen(false);
          }}
        >
          Продовжити урок
        </Button>
        <Button
          onClick={() => {
            router.push(`/learn/${lastLanguageCode}`);
            // setLessonId(0);
            setOpen(false);
          }}
          variant="destructive_ghost"
        >
          Закінчити
        </Button>
      </DialogContent>
    </Dialog>
  );
};
