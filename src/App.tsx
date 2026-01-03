import { useState, useEffect, useCallback, useRef } from "react";
import {
  TopBar,
  ConversationView,
  MetaInfo,
  Notes,
  Controls,
  DropOverlay,
  type Dataset,
} from "./components";

const STORAGE_KEY = "evaluation_harness_data";

export default function App() {
  const [dataset, setDataset] = useState<Dataset>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
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

  const hasData = dataset.length > 0;

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

      <TopBar
        datasetLength={dataset.length}
        annotatedCount={annotatedCount}
        onImportClick={() => fileInputRef.current?.click()}
        onExport={handleExport}
        onClear={handleClear}
      />

      {/* Main Content Area - 2:1 Split */}
      <div className="flex-1 overflow-hidden flex gap-4 p-4">
        <div className="flex-2 bg-white border rounded-lg overflow-hidden">
          <ConversationView
            currentEntry={currentEntry}
            hasData={hasData}
            currentIndex={currentIndex}
          />
        </div>

        {/* Right: Sidebar */}
        <div className="flex-1 flex flex-col gap-4">
          <MetaInfo currentEntry={currentEntry} />

          <Notes
            value={currentEntry?.notes || ""}
            onChange={updateNotes}
            disabled={!hasData}
            className="flex-1"
          />

          <Controls
            annotation={currentEntry?.annotation}
            onSetAnnotation={setAnnotation}
            onPrevious={navigatePrevious}
            onNext={navigateNext}
            canGoPrevious={currentIndex > 0}
            canGoNext={currentIndex < dataset.length - 1}
            disabled={!hasData}
          />
        </div>
      </div>

      <DropOverlay visible={isDragging} />
    </div>
  );
}
