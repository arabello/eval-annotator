import sampleExperiment from "@/assets/sample-experiment.json";
import {
  Controls,
  ConversationView,
  DropOverlay,
  ErrorDialog,
  TopBar,
} from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Experiment } from "@/model/experiment";
import JsonView from "@uiw/react-json-view";
import { useCallback, useEffect, useRef, useState } from "react";
import { safeParse } from "valibot";

const STORAGE_KEY = "evaluation_harness_data";

export default function Home() {
  const [experiment, setExperiment] = useState<Experiment | undefined>(
    sampleExperiment as Experiment,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  // Load data from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        // Validate the loaded data against the schema
        const result = safeParse(Experiment, parsed);
        if (result.success) {
          setExperiment(result.output);
        } else {
          console.warn("Invalid data in localStorage, using sample data");
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.error("Failed to load data from local storage", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save data to local storage whenever dataset changes
  useEffect(() => {
    if (experiment && experiment.entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(experiment));
    }
  }, [experiment]);

  const currentEntry = experiment?.entries[currentIndex] || null;

  // Debug: log current entry to see what data we have
  console.log("Current entry:", currentEntry);
  console.log("Expected tool calls:", currentEntry?.expected_tool_calls);
  console.log("Actual tool calls:", currentEntry?.actual_tool_calls);

  const annotatedCount =
    experiment?.entries.filter((e) => e.annotation).length || 0;

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        // Validate with validbot
        const result = safeParse(Experiment, json);

        if (!result.success) {
          const errors = result.issues.map((issue) => {
            const path = issue.path?.map((p) => p.key).join(".") || "";
            return `${path ? path + ": " : ""}${issue.message}`;
          });
          setValidationErrors(errors);
          return;
        }

        setExperiment(result.output);
        setCurrentIndex(0);
      } catch (error) {
        setValidationErrors([
          "Failed to parse JSON file. Please ensure it is valid JSON.",
        ]);
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
    const dataStr = JSON.stringify(experiment, null, 2);
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
    if (experiment && currentIndex < experiment.entries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, experiment?.entries.length]);

  const setAnnotation = useCallback(
    (annotation: "pass" | "fail") => {
      setExperiment((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
        };
        const currentAnnotation = updated.entries[currentIndex].annotation;
        updated.entries[currentIndex] = {
          ...updated.entries[currentIndex],
          annotation: currentAnnotation === annotation ? undefined : annotation,
        };
        return updated;
      });
    },
    [currentIndex],
  );

  const updateNotes = useCallback(
    (notes: string) => {
      setExperiment((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
        };
        updated.entries[currentIndex] = {
          ...updated.entries[currentIndex],
          notes,
        };
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
      setExperiment(undefined);
      setCurrentIndex(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;
      if (!experiment || experiment.entries.length === 0) return; // Don't handle keys when no dataset

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

  const hasData = experiment ? experiment.entries.length > 0 : false;

  const handleCloseErrorDialog = () => {
    setValidationErrors([]);
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ErrorDialog
        open={validationErrors.length > 0}
        onClose={handleCloseErrorDialog}
        title="Validation Error"
        errors={validationErrors}
      />

      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImport}
      />

      <TopBar
        experimentName={experiment?.name || "No Dataset"}
        datasetLength={experiment?.entries.length || 0}
        annotatedCount={annotatedCount}
        onImportClick={() => fileInputRef.current?.click()}
        onExport={handleExport}
        onClear={handleClear}
      />

      {/* Main Content Area - 2:1 Split */}
      <div className="flex-1 overflow-hidden flex gap-4 p-4 h-full">
        <div className="flex-2 bg-white border rounded-lg overflow-hidden grow">
          <ConversationView
            currentEntry={currentEntry}
            hasData={hasData}
            currentIndex={currentIndex}
          />
        </div>

        {/* Right: Sidebar */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="h-full">
            <Tabs defaultValue="Context" className="flex-1">
              <CardHeader>
                <CardTitle>
                  <TabsList>
                    <TabsTrigger value="Context">Context</TabsTrigger>
                    <TabsTrigger value="Tool Calls">Tool Calls</TabsTrigger>
                    <TabsTrigger value="Notes">Notes</TabsTrigger>
                  </TabsList>
                </CardTitle>
              </CardHeader>

              <CardContent className="h-full">
                <TabsContent value="Context" className="h-full overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    {currentEntry?.context && (
                      <div className="overflow-auto">
                        <JsonView value={currentEntry.context} />
                      </div>
                    )}
                    {!currentEntry?.context && (
                      <p className="text-muted-foreground italic">
                        No context data available
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent
                  value="Tool Calls"
                  className="h-full overflow-hidden"
                >
                  <div className="h-full space-y-4 overflow-y-auto">
                    {currentEntry?.expected_tool_calls ||
                    currentEntry?.actual_tool_calls ? (
                      <>
                        {currentEntry?.expected_tool_calls && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2 text-green-700">
                              Expected Tool Calls
                            </h4>
                            <div className="overflow-auto max-h-64">
                              <JsonView
                                value={currentEntry.expected_tool_calls}
                              />
                            </div>
                          </div>
                        )}
                        {currentEntry?.actual_tool_calls && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2 text-blue-700">
                              Actual Tool Calls
                            </h4>
                            <div className="overflow-auto max-h-64">
                              <JsonView
                                value={currentEntry.actual_tool_calls}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No tool calls data available
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="Notes" className="h-full">
                  <Textarea
                    id="notes"
                    value={currentEntry?.notes || ""}
                    onChange={(e) => updateNotes(e.target.value)}
                    disabled={!hasData}
                    placeholder="Add optional notes here..."
                    className="h-full resize-none"
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <Controls
            annotation={currentEntry?.annotation}
            onSetAnnotation={setAnnotation}
            onPrevious={navigatePrevious}
            onNext={navigateNext}
            canGoPrevious={currentIndex > 0}
            canGoNext={currentIndex < (experiment?.entries.length || 0) - 1}
            disabled={!hasData}
          />
        </div>
      </div>

      <DropOverlay visible={isDragging} />
    </div>
  );
}
