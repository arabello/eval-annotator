import { useRef, useEffect } from "react";
import clsx from "clsx";
import type { ExperimentEntry } from "./types";

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
    <div ref={conversationRef} className="h-full overflow-auto p-4">
      {!hasData ? (
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
                    currentEntry.baseline[currentEntry.baseline.length - 1]
                      .content
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
  );
}
