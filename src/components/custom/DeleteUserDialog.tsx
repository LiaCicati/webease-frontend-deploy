import { useRef, useState } from "react";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
interface DeleteUserDialogProps {
  userId: string;
  onDelete: (userId: string) => void;
}

function DeleteUserDialog({ userId, onDelete }: DeleteUserDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialogButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleDelete = () => {
    onDelete(userId);
    setIsDialogOpen(false);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Delete User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter style={{ paddingTop: "24px" }}>
          <DialogClose ref={closeDialogButtonRef}>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUserDialog;
