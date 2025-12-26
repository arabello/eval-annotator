import { X } from "lucide-react";
import evalHarnessImg from "../assets/eval-harness.png";

type Props = {
  onClose: () => void;
};

export function InfoContent({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">About</h1>
          <p className="mb-4">
            This is a simple annotator tool for evaluating conversational-based
            projects.
          </p>
          <p className="mb-4">
            Within your{" "}
            <a
              href="https://www.buildo.com/blog-posts/evaluation-driven-development"
              target="_blank"
              className="font-medium text-blue-700 hover:underline"
            >
              evaluation harness feedback loop
            </a>
            , you can use this tool to annotate the candidate's responses
            (changes branch) against the baseline (main branch).
          </p>
          <p className="mb-4">
            The interface to use this tool is an Experiment JSON file. An
            experiment is a single eval suite run against a Ground Truth dataset
            which should produce an <strong>Experiment JSON file.</strong> This
            tool reads and overwrites the JSON file as its own application
            state.
          </p>
          <p className="mb-4">
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
      </div>
    </div>
  );
}
