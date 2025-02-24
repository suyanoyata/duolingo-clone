import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useEffect, useState } from "react";
import { clientStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

export const QuitLessonModal = () => {
  const [open, setOpen] = useState(false);
  const { lastLanguageCode } = clientStore();

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      setOpen(true);
      e.preventDefault();
    });

    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

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
        <div className="flex flex-col gap-3">
          <p className="text-zinc-600 font-semibold text-center">
            Ви справді хочете закінчити урок? Вам доведеться проходити його спочатку.
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
            }}
            variant="destructive_ghost"
          >
            Закінчити
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
