import { FilePlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export function Explorer() {
  return (
    <div>
      <div className="p-3 text-muted-foreground flex justify-between items-center">
        <span className="text-sm">Explorer</span>
        <NewFileButton />
      </div>
    </div>
  )
}


function NewFileButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"ghost"} className="p-2 size-6">
            <FilePlusIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>New File...</p>
        </TooltipContent>
      </Tooltip>
      </TooltipProvider>
  )
}
