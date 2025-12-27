import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "../lib/utils";

interface NotesProps {
  value: string;
  onChange: (notes: string) => void;
  disabled: boolean;
  className?: string;
}

export function Notes({ value, onChange, disabled, className }: NotesProps) {
  return (
    <Card className={cn("flex-1", className)}>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Add optional notes here..."
          className="flex-1 resize-none"
        />
      </CardContent>
    </Card>
  );
}
