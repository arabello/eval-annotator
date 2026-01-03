import { Download, InfoIcon, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { DocsDialog } from "./DocsDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";

interface TopBarProps {
  datasetLength: number;
  annotatedCount: number;
  onImportClick: () => void;
  onExport: () => void;
  onClear: () => void;
}

export function TopBar({
  datasetLength,
  annotatedCount,
  onImportClick,
  onExport,
  onClear,
}: TopBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasData = datasetLength > 0;
  const progressPercent = hasData ? (annotatedCount / datasetLength) * 100 : 0;

  return (
    <div className="border-b bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Import/Export/Clear */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={!hasData}
            title="Clear all data"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={onImportClick}>
            <Upload />
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={!hasData}
          >
            <Download />
            Export
          </Button>
        </div>

        {/* Right: Progress + Info */}
        <div className="flex items-center gap-3">
          <Progress value={progressPercent} className="w-32" />
          <span className="text-sm text-muted-foreground min-w-12">
            {hasData ? `${annotatedCount}/${datasetLength}` : "0/0"}
          </span>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                  >
                    <InfoIcon className="h-5 w-5" />
                    Docs
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {isOpen && <DocsDialog onClose={() => setIsOpen(false)} />}
        </div>
      </div>
    </div>
  );
}
