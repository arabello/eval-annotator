import evalHarnessImg from "../assets/eval-harness.png";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

type Props = {
  onClose: () => void;
};

export function DocsDialog({ onClose }: Props) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Docs</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            This is a minimalistic annotator tool for conversational based
            projects to streamline the{" "}
            <a
              href="https://www.buildo.com/blog-posts/evaluation-driven-development"
              target="_blank"
              className="font-medium text-primary hover:underline"
            >
              Evaluation Driven Development
            </a>{" "}
            . You can mark candidate's responses (changes branch) against the
            baseline (main branch).
          </p>
          <p>
            It is designed to be plugged into your existing workflow via an
            Experiment JSON file. An experiment is a single eval suite run
            against a Ground Truth dataset which should produce an{" "}
            <strong>Experiment JSON file.</strong> This tool reads and
            overwrites the JSON file as its own application state.
          </p>
          <img
            src={evalHarnessImg}
            alt="Eval Harness"
            className="max-w-full h-auto"
          />
          <p>
            The goal is to have an overview on how the changes affected the
            conversational software and to be able to make{" "}
            <strong>informed decisions</strong> on whether to merge the changes
            or not. Because the application state leverages the JSON file, you
            can export the file and share it with others to get their feedback.
          </p>
          <p>
            For any feedback or help, please contact me at{" "}
            matteo.pelle.pellegrino (at) gmail (dot) com.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            <a href="mailto:matteo.pelle.pellegrino@gmail.com">Contact</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
