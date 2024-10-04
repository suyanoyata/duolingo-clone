import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { clientStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

export const NoHeartsLeftModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { lastLanguageCode } = clientStore();

  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Отакої!</DialogTitle>
        <div className="flex flex-col gap-3">
          <p className="text-zinc-600 font-semibold text-center">
            Схоже у вас закінчились серця. Ви можете потренувати минулі уроки
            для того, щоб отримати їх.
          </p>
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
