"use client";

import { Logo } from "@/components/ui/logo";
import { useExplorer } from "@/providers/explorer-provider";
import { PanelLeftIcon, PanelLeftCloseIcon } from "lucide-react";
import { TooltipButton } from "@/components/ui/tooltip-button";


export function TitleBar() {
  return (
    <header className="bg-background flex items-center justify-between p-3">
      <div className="flex items-center gap-3 font-medium">
        <Logo size={16} /> Boba
      </div>
      <div>
        <ExplorerToggle />
      </div>
    </header>
  );
}

function ExplorerToggle() {
  const { toggle, open } = useExplorer();
  return (
    <TooltipButton
      icon={open ? <PanelLeftCloseIcon /> : <PanelLeftIcon />}
      help={"Toggle Explorer"}
      onClick={toggle}
    />
  );
}