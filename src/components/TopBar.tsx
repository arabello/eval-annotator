import { Upload, Download, Trash2 } from "lucide-react";

interface TopBarProps {
  datasetLength: number;
  annotatedCount: number;
  onImportClick: () => void;
  onExport: () => void;
  onClear: () => void;
}

export function TopBar({
  datasetLength,
  annotatedCount,
  onImportClick,
  onExport,
  onClear,
}: TopBarProps) {
  const hasData = datasetLength > 0;
  const progressPercent = hasData ? (annotatedCount / datasetLength) * 100 : 0;

  return (
    <div className="border-b bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Import/Export/Clear */}
        <div className="flex gap-2">
          <button
            onClick={onClear}
            disabled={!hasData}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-red-300 rounded bg-white hover:bg-red-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear all data"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={onImportClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button
            onClick={onExport}
            disabled={!hasData}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Center: Empty space or title */}
        <div className="flex-1 mx-8">
          <div className="text-center">
            {!hasData && (
              <div className="text-gray-500">
                No dataset loaded - Please upload a JSON file to begin
              </div>
            )}
          </div>
        </div>

        {/* Right: Progress */}
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 min-w-[3rem]">
            {hasData ? `${annotatedCount}/${datasetLength}` : "0/0"}
          </span>
        </div>
      </div>
    </div>
  );
}
