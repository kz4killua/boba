"use client";

import { useState } from "react";
import { FilePlusIcon, FileCodeIcon, EllipsisIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Notebook } from "@/types";
import { useNotebooks } from "@/providers/notebooks-provider";
import { Loading } from "@/components/ui/loading";
import { toast } from "@/lib/toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import clsx from "clsx";


export function Explorer() {
  const [creating, setCreating] = useState(false);
  return (
    <div className="flex flex-col grow text-sm">
      <div className="p-3 text-muted-foreground flex justify-between items-center">
        <span>Explorer</span>
        <NewFileButton onClick={() => setCreating(true)} />
      </div>
      <FileList creating={creating} setCreating={setCreating} />
    </div>
  )
}


function NewFileButton({
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
            <File key={notebook.name} notebook={notebook} />
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

  const { dispatch } = useNotebooks();

  function onSuccess(name: string) {
    dispatch({ type: 'CREATE_NOTEBOOK', notebook: {
      name: name, cells: []
    }});
  }

  function onExit() {
    setCreating(false);
  }

  return (
    <div className="px-3 py-2 flex items-center gap-2 hover:bg-muted cursor-pointer">
      <FileCodeIcon size={16} className="shrink-0" />
      <FileNameInput onSuccess={onSuccess} onExit={onExit} />
    </div>
  )
}


function File({
  notebook
} : {
  notebook: Notebook
}) {

  const { dispatch } = useNotebooks();
  const [selected, setSelected] = useState(false);
  const [renaming, setRenaming] = useState(false);

  function handleDelete() {
    dispatch({ type: 'DELETE_NOTEBOOK', name: notebook.name });
  }

  function handleRename() {
    setRenaming(true);
  }

  function onRenameSuccess(name: string) {
    dispatch({ type: 'UPDATE_NOTEBOOK', name: notebook.name, notebook: {
      ...notebook, name: name
    }});
  }

  function onRenameExit() {
    setRenaming(false);
  }

  return (
    <div 
      className={clsx(
        "group px-3 py-2 flex justify-between items-center hover:bg-muted cursor-pointer",
        (selected || renaming) ? "bg-muted" : ""
      )}
    >
      <div className="flex items-center gap-2">
        <FileCodeIcon size={16} className="shrink-0" /> 
        {
          renaming ? (
            <FileNameInput
              initial={notebook.name}
              onSuccess={onRenameSuccess}
              onExit={onRenameExit}
            />
          ) : (
            <span>{notebook.name}</span>
          )
        }
      </div>

      {/* NOTE: Setting modal={false} prevents Radix from stealing focus from FileNameInput */}
      <DropdownMenu onOpenChange={(open) => setSelected(open)} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={clsx(
            "invisible group-hover:visible size-4 p-1", 
            (selected || renaming) ? "visible" : ""
          )}>
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem className="cursor-pointer" onClick={handleRename}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


function FileNameInput({
  initial = "", 
  onSuccess,
  onExit
} : {
  initial?: string,
  onSuccess: (name: string) => void,
  onExit: () => void
}) {

  const { notebooks } = useNotebooks();
  const [name, setName] = useState(initial);

  function handleBlur() {
    if (name && name !== initial) {
      if (!isValid(name)) {
        toast("Invalid file name", "File names must not be empty.", "error");
      } else if (!isUnique(name, notebooks)) {
        toast("Invalid file name", "File names must be unique.", "error");
      } else {
        onSuccess(name);
      }
    }
    onExit();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onExit();
    } else if (e.key === "Enter") {
      handleBlur();
    }
  }

  function isUnique(name: string, notebooks: Notebook[]) {
    return notebooks.every(notebook => notebook.name !== name);
  }
  
  function isValid(name: string) {
    return name.trim().length > 0;
  }

  return (
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
  )
}