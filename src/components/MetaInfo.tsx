import type { ExperimentEntry } from "./types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MetaInfoProps {
  currentEntry: ExperimentEntry | null;
}

export function MetaInfo({ currentEntry }: MetaInfoProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm">Meta Info</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-xs">
        <div>
          <span className="text-muted-foreground">ID: </span>
          <span className="text-foreground">{currentEntry?.id || "N/A"}</span>
        </div>
        {currentEntry?.span_link && (
          <div>
            <span className="text-muted-foreground">Span Link: </span>
            <a
              href={currentEntry.span_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            >
              {currentEntry.span_link}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
