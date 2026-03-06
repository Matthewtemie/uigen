import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolCallLabelProps {
  toolInvocation: ToolInvocation;
}

function getLabel(toolInvocation: ToolInvocation): string {
  const { toolName } = toolInvocation;
  const args = toolInvocation.args as Record<string, string> | undefined;
  const path = args?.path ?? "";
  const command = args?.command ?? "";

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return `Created ${path}`;
      case "str_replace":
        return `Edited ${path}`;
      case "insert":
        return `Edited ${path}`;
      case "view":
        return `Viewed ${path}`;
      default:
        return `Modified ${path}`;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        return `Renamed ${path} → ${args?.new_path ?? ""}`;
      case "delete":
        return `Deleted ${path}`;
      default:
        return `Modified ${path}`;
    }
  }

  return toolName;
}

export function ToolCallLabel({ toolInvocation }: ToolCallLabelProps) {
  const label = getLabel(toolInvocation);
  const isComplete = toolInvocation.state === "result" && "result" in toolInvocation && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-muted/50 rounded-lg text-xs font-mono border border-border">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
      )}
      <span className="text-foreground">{label}</span>
    </div>
  );
}
