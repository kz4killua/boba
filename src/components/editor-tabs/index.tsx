"use client";

import { FileCodeIcon, XIcon } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNotebooks } from '@/providers/notebooks-provider';
import type { Notebook } from '@/types';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { TooltipButton } from '@/components/ui/tooltip-button';


export function EditorTabs() {
  const { notebooks, open } = useNotebooks();

  return (
    <ScrollArea>
      <div className="flex gap-2 py-2 px-3">
        {
          open.map(id => {
            const notebook = notebooks.find(notebook => notebook.id === id);
            if (!notebook) return null;
            return (
              <Tab key={id} notebook={notebook} />
            )
          })
        }
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  )
}


function Tab({
  notebook
} : {
  notebook: Notebook
}) {

  const { active, dispatch } = useNotebooks();
  const ref = useRef<HTMLDivElement>(null);

  function handleClose(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch({ type: 'CLOSE_NOTEBOOK', notebookId: notebook.id });
    if (active === notebook.id) {
      dispatch({ type: 'SET_ACTIVE_NOTEBOOK', notebookId: null });
    }
  }

  function handleClick() {
    dispatch({ type: 'SET_ACTIVE_NOTEBOOK', notebookId: notebook.id });
  }

  useEffect(() => {
    if (active === notebook.id) {
      ref.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }, [active, notebook.id]);

  return (
    <div 
      ref={ref}
      className={clsx(
        "group flex items-center justify-center gap-2 px-4 py-2 rounded bg-secondary cursor-pointer text-sm",
        active !== notebook.id && "brightness-50 hover:brightness-100"
      )}
      onClick={handleClick}
    >
      <FileCodeIcon size={16} className="shrink-0" />
      <span className='whitespace-nowrap'>{notebook.name}</span>
      <div className={clsx(
        active === notebook.id ? "visible" : "group-hover:visible invisible",
      )}>
        <TooltipButton
          icon={<XIcon />}
          help="Close"
          onClick={handleClose}
        />
      </div>
    </div>
  )
}