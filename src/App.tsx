import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Trash2,
} from "lucide-react";
import clsx from "clsx";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ExperimentEntry {
  id: string;
  baseline: Message[];
  candidate_answer?: string;
  span_link?: string;
  notes?: string;
  annotation?: "pass" | "fail";
}

type Dataset = ExperimentEntry[];

const STORAGE_KEY = "evaluation_harness_data";

export default function App() {
  const [dataset, setDataset] = useState<Dataset>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const conversationRef = useRef<HTMLDivElement>(null);

  // Load data from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDataset(parsed);
      } catch (e) {
        console.error("Failed to load data from local storage", e);
      }
    }
  }, []);

  // Save data to local storage whenever dataset changes
  useEffect(() => {
    if (dataset.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
    }
  }, [dataset]);

  const currentEntry = dataset[currentIndex] || null;

  const annotatedCount = dataset.filter((e) => e.annotation).length;

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setDataset(Array.isArray(json) ? json : []);
        setCurrentIndex(0);
      } catch (error) {
        alert("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
    event.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items?.[0]?.kind === "file") {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/json") processFile(file);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(dataset, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `experiment_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const navigatePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const navigateNext = useCallback(() => {
    if (currentIndex < dataset.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, dataset.length]);

  const setAnnotation = useCallback(
    (annotation: "pass" | "fail") => {
      setDataset((prev) => {
        const updated = [...prev];
        const currentAnnotation = updated[currentIndex].annotation;
        updated[currentIndex] = {
          ...updated[currentIndex],
          annotation: currentAnnotation === annotation ? undefined : annotation,
        };
        return updated;
      });
    },
    [currentIndex],
  );

  const updateNotes = useCallback(
    (notes: string) => {
      setDataset((prev) => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], notes };
        return updated;
      });
    },
    [currentIndex],
  );

  const handleClear = () => {
    if (
      confirm("Are you sure you want to clear all data? This cannot be undone.")
    ) {
      localStorage.removeItem(STORAGE_KEY);
      setDataset([]);
      setCurrentIndex(0);
    }
  };

  // Scroll to bottom when conversation changes
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [currentIndex, dataset]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;
      if (dataset.length === 0) return; // Don't handle keys when no dataset

      switch (e.key) {
        case "ArrowLeft":
          navigatePrevious();
          break;
        case "ArrowRight":
          navigateNext();
          break;
        case "y":
        case "Y":
          setAnnotation("pass");
          break;
        case "n":
        case "N":
          setAnnotation("fail");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigatePrevious, navigateNext, setAnnotation]);

  return (
    <div
      className="h-screen w-full flex flex-col bg-gray-50 relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      {/* Top Bar */}
      <div className="border-b bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Import/Export/Clear */}
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              disabled={dataset.length === 0}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-red-300 rounded bg-white hover:bg-red-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear all data"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <button
              onClick={handleExport}
              disabled={dataset.length === 0}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Center: Empty space or title */}
          <div className="flex-1 mx-8">
            <div className="text-center">
              {dataset.length === 0 && (
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
                style={{
                  width: `${dataset.length > 0 ? (annotatedCount / dataset.length) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-600 min-w-[3rem]">
              {dataset.length > 0
                ? `${annotatedCount}/${dataset.length}`
                : "0/0"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area - 65:35 Split */}
      <div className="flex-1 overflow-hidden flex gap-4 p-4">
        {/* Left: Bubble View (65%) */}
        <div className="flex-2 bg-white border rounded-lg overflow-hidden">
          <div ref={conversationRef} className="h-full overflow-auto p-4">
            {dataset.length === 0 ? (
              <p className="text-gray-400 italic">No data loaded</p>
            ) : (
              <div className="flex flex-col gap-8">
                {(currentEntry?.baseline || []).slice(0, -1).map((msg, idx) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={idx}
                      className={clsx(
                        "max-w-[50%]",
                        isUser ? "self-end" : "self-start",
                      )}
                    >
                      <div
                        className={clsx(`p-3 rounded-lg`, {
                          "bg-green-100": isUser,
                          "bg-gray-100": !isUser,
                        })}
                      >
                        <div className="text-xs font-semibold mb-1 text-gray-600">
                          {isUser ? "User" : "Assistant"}
                        </div>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {/* Last Message Split View */}
                {currentEntry?.baseline && currentEntry.baseline.length > 0 && (
                  <div className="flex flex-row gap-3 pb-64">
                    {/* Baseline Last Message */}
                    <div className="flex-1 rounded-lg p-3 bg-gray-100">
                      <div className="text-xs font-semibold mb-2 text-gray-700">
                        Baseline
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {
                          currentEntry.baseline[
                            currentEntry.baseline.length - 1
                          ].content
                        }
                      </p>
                    </div>
                    {/* Candidate Last Message */}
                    <div className="flex-1 rounded-lg p-3 bg-purple-100">
                      <div className="text-xs font-semibold mb-2 text-gray-700">
                        Candidate
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {currentEntry?.candidate_answer || ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar (35%) */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Meta Info */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Meta Info
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-600">ID: </span>
                <span className="text-gray-800">
                  {currentEntry?.id || "N/A"}
                </span>
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

          {/* Notes */}
          <div className="bg-white border rounded-lg p-4 flex-1 flex flex-col">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Notes</h4>
            <textarea
              value={currentEntry?.notes || ""}
              onChange={(e) => updateNotes(e.target.value)}
              disabled={dataset.length === 0}
              placeholder="Add optional notes here..."
              className="flex-1 w-full px-3 py-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          {/* Controls */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Controls
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAnnotation("fail")}
                disabled={dataset.length === 0}
                title="Mark as fail (N)"
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentEntry?.annotation === "fail"
                    ? "bg-red-100 border-red-300 text-gray-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-red-50"
                }`}
              >
                <X className="w-4 h-4 text-red-600" />
                Fail
              </button>
              <button
                onClick={() => setAnnotation("pass")}
                disabled={dataset.length === 0}
                title="Mark as pass (Y)"
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentEntry?.annotation === "pass"
                    ? "bg-green-100 border-green-300 text-gray-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-green-50"
                }`}
              >
                <Check className="w-4 h-4 text-green-600" />
                Pass
              </button>
              <button
                onClick={navigatePrevious}
                disabled={currentIndex === 0 || dataset.length === 0}
                title="Previous entry (←)"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={navigateNext}
                disabled={
                  currentIndex === dataset.length - 1 || dataset.length === 0
                }
                title="Next entry (→)"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDragging && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(37, 99, 235, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            <Upload style={{ width: 64, height: 64, margin: "0 auto 1rem" }} />
            Drop JSON file to import
          </div>
        </div>
      )}
    </div>
  );
}
