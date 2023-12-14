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
interface DeletePostDialogProps {
  postId: string;
  onDelete: (postId: string) => void;
}

function DeletePostDialog({ postId, onDelete }: DeletePostDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialogButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleDelete = () => {
    onDelete(postId);
    setIsDialogOpen(false);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
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
            Delete Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeletePostDialog;
