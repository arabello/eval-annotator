import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface NotesProps {
  value: string;
  onChange: (notes: string) => void;
  disabled: boolean;
}

export function Notes({ value, onChange, disabled }: NotesProps) {
  return (
    <Card className="flex-1 flex flex-col bg-white">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm">Notes</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
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
