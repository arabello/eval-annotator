import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  errors: string[];
}

export function ErrorDialog({
  open,
  onClose,
  title,
  errors,
}: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto">
          <ul className="space-y-2 mt-2">
            {errors.map((error, index) => (
              <li
                key={index}
                className="text-sm border-l-2 border-destructive pl-3 py-1"
              >
                {error}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
