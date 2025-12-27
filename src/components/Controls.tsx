import { ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ControlsProps {
  annotation: "pass" | "fail" | undefined;
  onSetAnnotation: (annotation: "pass" | "fail") => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  disabled: boolean;
}

export function Controls({
  annotation,
  onSetAnnotation,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  disabled,
}: ControlsProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm">Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => onSetAnnotation("fail")}
            disabled={disabled}
            title="Mark as fail (N)"
            className={cn(
              annotation === "fail"
                ? "bg-red-100 border-red-300 text-foreground hover:bg-red-100"
                : "hover:bg-red-50",
            )}
          >
            <X className="text-red-600" />
            Fail
          </Button>
          <Button
            variant="outline"
            onClick={() => onSetAnnotation("pass")}
            disabled={disabled}
            title="Mark as pass (Y)"
            className={cn(
              annotation === "pass"
                ? "bg-green-100 border-green-300 text-foreground hover:bg-green-100"
                : "hover:bg-green-50",
            )}
          >
            <Check className="text-green-600" />
            Pass
          </Button>
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious || disabled}
            title="Previous entry (←)"
          >
            <ChevronLeft />
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!canGoNext || disabled}
            title="Next entry (→)"
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
