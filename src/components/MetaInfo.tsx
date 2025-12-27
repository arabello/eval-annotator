import type { ExperimentEntry } from "./types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MetaInfoProps {
  currentEntry: ExperimentEntry | null;
  className?: string;
}

export function MetaInfo({ currentEntry, className }: MetaInfoProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Meta Info</CardTitle>
      </CardHeader>
      <CardContent>
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
