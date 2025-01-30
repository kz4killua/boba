"use client";

import React from "react";
import clsx from "clsx";
import * as monaco from "monaco-editor";
import MonacoEditor, { Monaco } from "@monaco-editor/react";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, PlayIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { tokensProvider, languageName, completionItemProvider, languageConfiguration } from "@/lib/language";
import { useState, useEffect, useRef } from "react";
import type { CodeCell, Notebook, NotebookCell } from "@/types";
import { Loading } from "@/components/ui/loading";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { useNotebooks } from "@/providers/notebooks-provider";
import { Runtime } from "@/runtime";
import { ScrollArea } from "@/components/ui/scroll-area";
import parser from "@/compiler/parser";
import escodegen from "escodegen";
import './editor.modules.css';


export function Editor() {

  const { open, active, notebooks } = useNotebooks();
  const runtimes = useRef<Map<Notebook["id"], Runtime>>(new Map());
  const notebook = notebooks.find(n => n.id === active);

  if (!notebook) {
    return null;
  }

  // Initialize runtimes for each open notebook
  notebooks.forEach(notebook => {
    if (open.includes(notebook.id) && !runtimes.current.has(notebook.id)) {
      runtimes.current.set(notebook.id, new Runtime());
    } else if (!open.includes(notebook.id) && runtimes.current.has(notebook.id)) {
      runtimes.current.get(notebook.id)!.worker.terminate();
      runtimes.current.delete(notebook.id);
    }
  });

  return (
    <ScrollArea>
      <div className="px-3 pt-2 pb-12">
        <CellInsertion index={0} />
        {
          notebook.cells.map((cell, index) => (
            <React.Fragment key={cell.id}>
              {cell.cell_type === "code" ? (
                <CodeCellView 
                  notebook={notebook} 
                  cell={cell} 
                  index={index} 
                  runtime={runtimes.current.get(notebook.id)!}
                />
              ) : (
                <MarkdownCellView />
              )}
              <CellInsertion index={index + 1} />
            </React.Fragment>
          ))
        }
      </div>
    </ScrollArea>
  )
}

function CodeCellView({
  notebook,
  cell,
  index,
  runtime
}: {
  notebook: Notebook,
  cell: CodeCell,
  index: number,
  runtime: Runtime
}) {

  const { dispatch } = useNotebooks();
  const [status, setStatus] = useState<"failed" | "succeeded" | "pending" | null>(null)

  function handleChange(value: string | undefined) {
    if (value !== undefined) {
      dispatch({ type: 'UPDATE_CELL', notebookId: notebook.id, cellId: cell.id, cell: { ...cell, source: value } });
    }
    setStatus(null);
  }

  function handleMoveUp() {
    dispatch({ type: 'MOVE_CELL', notebookId: notebook.id, cellId: cell.id, index: index - 1 });
  }

  function handleMoveDown() {
    dispatch({ type: 'MOVE_CELL', notebookId: notebook.id, cellId: cell.id, index: index + 1 });
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_CELL', notebookId: notebook.id, cellId: cell.id });
  }

  function updateResult(result: { logs?: string[], result?: string, error?: string }) {
    
    // Build the output text
    let text = "";
    if (result.logs && result.logs.length > 0) {
      text += result.logs.join("\n") + "\n";
    }
    if (result.result) {
      text += result.result + "\n";
    }
    if (result.error) {
      text += result.error + "\n";
    }

    // Update the cell
    dispatch({ 
      type: 'UPDATE_CELL', 
      notebookId: notebook.id, 
      cellId: cell.id, 
      cell: { 
        ...cell, 
        executed: true, 
        outputs: [{ 
          output_type: "execute_result", 
          data: { "text/plain": text } 
        }]
      }
    });

  }

  function handleRun() {
    
    setStatus("pending");

    let source = cell.source;

    // Normalize line endings to LF
    source = source.replace(/\r\n/g, "\n");
    
    console.log("Parsing:", JSON.stringify(source));

    // Parse the code
    try {
      parser.reset();
      parser.feed(source);
    } catch (error) {
      updateResult({ error: `ParserError: Please check your code for syntax errors.` });
      setStatus("failed");
      return;
    }

    // Get the AST
    if (parser.results.length === 0) {
      updateResult({ result: "" });
      setStatus("succeeded");
      return;
    }
    const ast = parser.results[0];
    console.log("AST:", ast);

    // Generate the code
    const code = escodegen.generate(ast);
    console.log("Code:", code);

    // Execute the code
    runtime.execute(code).then((result) => {
      updateResult(result as any);
      setStatus("succeeded");
    }).catch((error) => {
      updateResult(error as any);
      setStatus("failed");
    });
  }

  return (
    <div className="flex flex-col gap-2">

      <div className="group relative flex flex-row gap-2">
        
        {/* Run button & cell status indicators */}
        <div className="flex flex-col justify-between items-center">
          {
            (status === "pending") ? (
              <div className="p-2 size-6">
                <Loading />
              </div>
            ) : (
              <div className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
                <TooltipButton
                  icon={<PlayIcon className="stroke-emerald-500" />}
                  help="Run"
                  onClick={handleRun}
                />
              </div>
            )
          }
          {
            (status === "succeeded") ? (
              <div className="p-1">
                <CheckIcon className="stroke-emerald-500" size={14} />
              </div>
            ) : (status === "failed") ? (
              <div className="p-1">
                <XIcon className="stroke-red-500" size={14} />
              </div>
            ) : null
          }
        </div>

        {/* Cell editor */}
        <div className="grow flex flex-col gap-2 rounded-md border border-transparent focus-within:border-primary">
          <BaseEditor
            source={cell.source}
            type={"code"}
            onChange={handleChange}
          />
        </div>

        {/* Cell action buttons */}
        <div className="absolute -top-4 right-4 px-2 py-1 space-x-2 rounded-md border bg-secondary opacity-0 group-hover:opacity-100">
          <TooltipButton
            icon={<ArrowUpIcon />}
            help="Move up"
            onClick={handleMoveUp}
          />
          <TooltipButton
            icon={<ArrowDownIcon />}
            help="Move down"
            onClick={handleMoveDown}
          />
          <TooltipButton
            icon={<TrashIcon />}
            help="Delete"
            onClick={handleDelete}
          />
        </div>

      </div>

      {/* Cell outputs */}
      <div className="pl-8">
        {cell.outputs.map((output, index) => (
          <div key={index} className="p-2 rounded-md my-2">
            <div className="text-sm whitespace-pre-wrap text-foreground">
              {output.data["text/plain"]}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}


function MarkdownCellView() {
  // TODO
  return null;
}

function CellInsertion({
  index
} : {
  index: number
}) {

  const { active, notebooks, dispatch } = useNotebooks();
  const notebook = notebooks.find(n => n.id === active);
  const empty = notebook?.cells.length === 0;

  function handleClick() {
    if (active) {
      dispatch({ type: 'CREATE_CODE_CELL', notebookId: active, index: index, cell: {
        id: crypto.randomUUID(), cell_type: "code", source: "", executed: false, outputs: []
      }});
    }
  }

  return (
    <div className={clsx(
      "relative opacity-0 hover:opacity-100 py-2", 
      empty && "opacity-100"
    )}>
      <div className="border"/>

      <div className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2">
        <TooltipButton
          icon={<PlusIcon />}
          help="Add code cell"
          onClick={handleClick}
          text="Code"
          className="px-2 py-1 bg-secondary"
        />
      </div>
    </div>
  )
}


function BaseEditor({
  source,
  type,
  onChange
} : {
  source: string,
  type: NotebookCell["cell_type"],
  onChange: (value: string | undefined) => void
}) {

  const lineHeight = 20;
  const paddingTop = 15;
  const paddingBottom = 15;

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

  function calculateHeight(content: string) {
    const lines = Math.max(1, content.split('\n').length);
    return paddingTop + paddingBottom + lineHeight * lines;
  }

  function handleMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    if (type === "code") {
      monaco.languages.register({ id: languageName });
      monaco.languages.setMonarchTokensProvider(languageName, tokensProvider);
      monaco.languages.registerCompletionItemProvider(languageName, completionItemProvider);
      monaco.languages.setLanguageConfiguration(languageName, languageConfiguration);
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, [source])

  return (
    <MonacoEditor
      value={source}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        padding: { top: paddingTop, bottom: paddingBottom },
        lineHeight: lineHeight,
        scrollBeyondLastLine: false,
        scrollbar: { vertical: 'hidden', horizontal: 'auto', alwaysConsumeMouseWheel: false },
        rulers: [],
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        lineNumbers: "off",
      }}
      height={calculateHeight(source)}
      onChange={onChange}
      onMount={handleMount}
      defaultLanguage={type === "code" ? languageName : "markdown"}
      loading={
        <div className="w-full flex items-center justify-center">
          <Loading />
        </div>
      }
    />
  )
}
