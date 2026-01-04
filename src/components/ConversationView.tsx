import { useRef, useEffect } from "react";
import type { ExperimentEntry } from "@/model/experiment";
import { cn } from "@/lib/utils";

interface ConversationViewProps {
  currentEntry: ExperimentEntry | null;
  hasData: boolean;
  currentIndex: number;
}

export function ConversationView({
  currentEntry,
  hasData,
  currentIndex,
}: ConversationViewProps) {
  const conversationRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [currentIndex, currentEntry]);

  return (
    <div
      ref={conversationRef}
      className="h-full overflow-y-auto p-4 flex flex-col"
    >
      {!hasData ? (
        <p className="text-muted-foreground italic">
          No experiment loaded - Please upload a JSON file to begin
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {(currentEntry?.baseline || [])
            .slice(0, -1)
            .map((msg: any, idx: number) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={idx}
                  className={cn(
                    "max-w-[50%]",
                    isUser ? "self-end" : "self-start",
                  )}
                >
                  <div
                    className={cn("p-3 rounded-lg", {
                      "bg-green-100": isUser,
                      "bg-gray-100": !isUser,
                    })}
                  >
                    <div className="text-xs font-semibold mb-1 text-muted-foreground">
                      {isUser ? "User" : "Assistant"}
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })}
          {/* Last Message Split View */}
          {currentEntry?.baseline && currentEntry.baseline.length > 0 && (
            <div className="flex flex-row gap-3 mb-4">
              {/* Baseline Last Message */}
              <div className="flex-1 rounded-lg p-3 bg-gray-100">
                <div className="text-xs font-semibold mb-2 text-muted-foreground">
                  Baseline
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {
                    currentEntry.baseline[currentEntry.baseline.length - 1]
                      .content
                  }
                </p>
              </div>
              {/* Candidate Last Message */}
              <div className="flex-1 rounded-lg p-3 bg-purple-100">
                <div className="text-xs font-semibold mb-2 text-muted-foreground">
                  Candidate
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {currentEntry?.candidate_answer || ""}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
