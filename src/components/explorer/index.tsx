"use client";

import { useState } from "react";
import { FilePlusIcon, FileCodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Notebook } from "@/types";
import { useNotebooks } from "@/providers/notebooks-provider";
import { Loading } from "@/components/ui/loading";
import { toast } from "@/lib/toast";


export function Explorer() {
  const [creating, setCreating] = useState(false);
  return (
    <div className="flex flex-col grow text-sm">
      <div className="p-3 text-muted-foreground flex justify-between items-center">
        <span>Explorer</span>
        <CreateFile onClick={() => setCreating(true)} />
      </div>
      <FileList creating={creating} setCreating={setCreating} />
    </div>
  )
}


function CreateFile({
  onClick
} : {
  onClick?: () => void
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"ghost"} className="p-2 size-6" onClick={onClick}>
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


function FileList({
  creating,
  setCreating
} : {
  creating: boolean,
  setCreating: (creating: boolean) => void
}) {

  const { notebooks, loading } = useNotebooks();

  function sorted(notebooks: Notebook[]) {
    return notebooks.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="flex flex-col grow">
      {
        creating && (
          <NewFile setCreating={setCreating} />
        )
      }
      {
        loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>  
        ) : (
          sorted(notebooks).map(notebook => (
            <div 
              key={notebook.name} 
              className="px-3 py-2 flex items-center gap-2 hover:bg-muted cursor-pointer"
            >
              <FileCodeIcon size={16} /> {notebook.name}
            </div>
          ))
        ) 
      }
    </div>
  )
}

function NewFile({
  setCreating
}: {
  setCreating: (creating: boolean) => void
}) {

  const [name, setName] = useState("");
  const { notebooks, dispatch } = useNotebooks();

  function handleBlur() {
    if (name && isValid(name)) {
      dispatch({ type: 'CREATE_NOTEBOOK', notebook: {
        name: name, cells: []
      }});
    }
    if (name && !isValid(name)) {
      toast("Invalid file name", "File names must be unique and not empty.", "error");
    }
    setCreating(false);
  }

  function isUnique(name: string) {
    return notebooks.every(notebook => notebook.name !== name);
  }

  function isValid(name: string) {
    return isUnique(name) && name.trim().length > 0;
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === "Escape") {
      handleBlur();
    }
  }

  return (
    <div className="px-3 py-2 flex items-center gap-2 hover:bg-muted cursor-pointer">
      <FileCodeIcon size={16} />
      <input
        type="text"
        className="bg-transparent focus:outline-none w-full rounded"
        placeholder="New File..."
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}