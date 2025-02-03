"use client";

import { useState } from "react";
import { FilePlusIcon, FileCodeIcon, EllipsisIcon, PenLineIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Notebook } from "@/types";
import { useNotebooks } from "@/providers/notebooks-provider";
import { Loading } from "@/components/ui/loading";
import { toast } from "@/components/ui/toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipButton } from "@/components/ui/tooltip-button";


export function Explorer() {
  const [creating, setCreating] = useState(false);
  return (
    <div className="flex flex-col grow text-sm pt-1 pb-5">
      <div className="pl-5 pr-4 py-3 text-muted-foreground flex justify-between items-center">
        <span>Explorer</span>

        <TooltipButton
          icon={<FilePlusIcon />}
          help="New File"
          onClick={() => setCreating(true)}
        />
      </div>
      <FileList creating={creating} setCreating={setCreating} />
    </div>
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
    return notebooks.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }

  return (
    <ScrollArea>
      <div className="flex flex-col px-2">
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
              <File key={notebook.id} notebook={notebook} />
            ))
          ) 
        }
      </div>
    </ScrollArea>
  )
}

function NewFile({
  setCreating
}: {
  setCreating: (creating: boolean) => void
}) {

  const { dispatch } = useNotebooks();

  function onSuccess(name: string) {
    const notebookId = crypto.randomUUID();
    dispatch({ type: 'CREATE_NOTEBOOK', notebook: {
      id: notebookId, name: name, cells: []
    }});
    dispatch({ type: 'CREATE_CODE_CELL', notebookId: notebookId, index: 0, cell: {
      id: crypto.randomUUID(), cell_type: "code", source: "", status: null, outputs: []
    }});
  }

  function onExit() {
    setCreating(false);
  }

  return (
    <div className="px-3 py-2 rounded-md flex items-center gap-2 hover:bg-muted cursor-pointer">
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

  const { dispatch, active } = useNotebooks();
  const [selected, setSelected] = useState(false);
  const [renaming, setRenaming] = useState(false);

  function handleDelete(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    dispatch({ type: 'DELETE_NOTEBOOK', notebookId: notebook.id });
  }

  function handleRename(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    setRenaming(true);
  }

  function handleOpen() {
    dispatch({ type: 'OPEN_NOTEBOOK', notebookId: notebook.id });
    if (active !== notebook.id) {
      dispatch({ type: 'SET_ACTIVE_NOTEBOOK', notebookId: notebook.id });
    }
  }

  function onRenameSuccess(name: string) {
    dispatch({ type: 'UPDATE_NOTEBOOK', notebookId: notebook.id, notebook: {
      ...notebook, name: name
    }});
  }

  function onRenameExit() {
    setRenaming(false);
  }

  return (
    <div 
      className={clsx(
        "group px-3 py-2 rounded-md flex justify-between items-center hover:bg-muted cursor-pointer",
        (selected || renaming) ? "bg-muted" : ""
      )}
      onClick={handleOpen}
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
            <span className="whitespace-nowrap">{notebook.name}</span>
          )
        }
      </div>

      {/* NOTE: Setting modal={false} prevents Radix from stealing focus from FileNameInput */}
      <DropdownMenu onOpenChange={(open) => setSelected(open)} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={clsx(
            "invisible group-hover:visible size-4 p-1", 
            (selected || renaming) ? "visible" : ""
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem className="cursor-pointer" onClick={handleRename}>
            <PenLineIcon /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
            <TrashIcon /> Delete
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
        toast("error", "Invalid file name. File names must not be empty.");
      } else if (!isUnique(name, notebooks)) {
        toast("error", "Invalid file name. File names must be unique.");
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
      className="bg-transparent focus:outline-none w-full rounded-md"
      placeholder="New File..."
      autoFocus
      value={name}
      onChange={(e) => setName(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  )
}