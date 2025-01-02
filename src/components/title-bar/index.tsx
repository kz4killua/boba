"use client";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useExplorer } from "@/components/explorer/providers";
import { PanelLeftIcon, PanelLeftCloseIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"ghost"} className="p-2 size-6" onClick={toggle}>
            { open ? <PanelLeftCloseIcon /> : <PanelLeftIcon /> }
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Toggle Explorer</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}