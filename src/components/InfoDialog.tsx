import evalHarnessImg from "../assets/eval-harness.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  onClose: () => void;
};

export function InfoDialog({ onClose }: Props) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">About</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            This is a simple annotator tool for evaluating conversational-based
            projects.
          </p>
          <p>
            Within your{" "}
            <a
              href="https://www.buildo.com/blog-posts/evaluation-driven-development"
              target="_blank"
              className="font-medium text-primary hover:underline"
            >
              evaluation harness feedback loop
            </a>
            , you can use this tool to annotate the candidate's responses
            (changes branch) against the baseline (main branch).
          </p>
          <p>
            The interface to use this tool is an Experiment JSON file. An
            experiment is a single eval suite run against a Ground Truth dataset
            which should produce an <strong>Experiment JSON file.</strong> This
            tool reads and overwrites the JSON file as its own application
            state.
          </p>
          <p>
            The goal is to have an overview on how the changes affected the
            conversational software and to be able to make{" "}
            <strong>informed decisions</strong> on whether to merge the changes
            or not. Because the application state leverages the JSON file, you
            can export the file and share it with others to get their feedback.
          </p>
          <img
            src={evalHarnessImg}
            alt="Eval Harness"
            className="max-w-full h-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
