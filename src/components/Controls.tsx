import { ChevronLeft, ChevronRight, X, Check } from "lucide-react";

interface ControlsProps {
  annotation: "pass" | "fail" | undefined;
  onSetAnnotation: (annotation: "pass" | "fail") => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  disabled: boolean;
}

export function Controls({
  annotation,
  onSetAnnotation,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  disabled,
}: ControlsProps) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Controls</h4>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onSetAnnotation("fail")}
          disabled={disabled}
          title="Mark as fail (N)"
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            annotation === "fail"
              ? "bg-red-100 border-red-300 text-gray-700"
              : "bg-white border-gray-300 text-gray-700 hover:bg-red-50"
          }`}
        >
          <X className="w-4 h-4 text-red-600" />
          Fail
        </button>
        <button
          onClick={() => onSetAnnotation("pass")}
          disabled={disabled}
          title="Mark as pass (Y)"
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            annotation === "pass"
              ? "bg-green-100 border-green-300 text-gray-700"
              : "bg-white border-gray-300 text-gray-700 hover:bg-green-50"
          }`}
        >
          <Check className="w-4 h-4 text-green-600" />
          Pass
        </button>
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious || disabled}
          title="Previous entry (←)"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext || disabled}
          title="Next entry (→)"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
