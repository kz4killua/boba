import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import clsx from "clsx";


export function TooltipButton({
  icon,
  text,
  help,
  onClick,
  className
}: {
  icon: React.ReactNode,
  text?: string,
  help: string,
  onClick: (e: React.MouseEvent) => void,
  className?: string
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            className={clsx("p-1 h-auto text-muted-foreground", className)}
            onClick={onClick}
          >
            {icon} {text}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-background text-foreground rounded border">
          <p>{help}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}