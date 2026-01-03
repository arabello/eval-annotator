import type { ExperimentEntry } from "./types";

interface MetaInfoProps {
  currentEntry: ExperimentEntry | null;
}

export function MetaInfo({ currentEntry }: MetaInfoProps) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Meta Info</h4>
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-gray-600">ID: </span>
          <span className="text-gray-800">{currentEntry?.id || "N/A"}</span>
        </div>
        {currentEntry?.span_link && (
          <div>
            <span className="text-gray-600">Span Link: </span>
            <a
              href={currentEntry.span_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {currentEntry.span_link}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
