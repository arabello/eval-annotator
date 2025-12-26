import { Upload } from "lucide-react";

interface DropOverlayProps {
  visible: boolean;
}

export function DropOverlay({ visible }: DropOverlayProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(37, 99, 235, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: "1.5rem",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        <Upload style={{ width: 64, height: 64, margin: "0 auto 1rem" }} />
        Drop JSON file to import
      </div>
    </div>
  );
}
