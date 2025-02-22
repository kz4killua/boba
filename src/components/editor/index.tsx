"use client";

import React from "react";
import clsx from "clsx";
import * as monaco from "monaco-editor";
import MonacoEditor from "@monaco-editor/react";
import { useMonaco } from "@/hooks/use-monaco";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, PlayIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { tokensProvider, languageId, completionItemProvider, languageConfiguration } from "@/lib/editor";
import { useState, useEffect, useRef } from "react";
import type { CodeCell, ExecutionResult, Notebook, NotebookCell } from "@/types";
import { Loading } from "@/components/ui/loading";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { useNotebooks } from "@/providers/notebooks-provider";
import { Runtime } from "@/lib/runtime";
import { ScrollArea } from "@/components/ui/scroll-area";
import parser from "@/lib/compiler/parser";
import escodegen from "escodegen";
import './editor.modules.css';


export function Editor() {

  const { open, active, notebooks } = useNotebooks();
  const runtimes = useRef<Map<Notebook["id"], Runtime>>(new Map());
  const monaco = useMonaco();

  function createRuntime(notebook: Notebook) {
    runtimes.current.set(notebook.id, new Runtime());
  }

  function deleteRuntime(notebook: Notebook) {
    // Terminate the worker and remove the runtime
    runtimes.current.get(notebook.id)?.worker.terminate();
    runtimes.current.delete(notebook.id);
  }

  useEffect(() => {
    if (monaco && !monaco.languages.getLanguages().find(language => language.id === languageId)) {
      monaco.languages.register({ id: languageId });
      monaco.languages.setMonarchTokensProvider(languageId, tokensProvider);
      monaco.languages.registerCompletionItemProvider(languageId, completionItemProvider);
      monaco.languages.setLanguageConfiguration(languageId, languageConfiguration);
    }
  }, [monaco]);

  // Initialize runtimes for each open notebook before rendering
  notebooks.forEach(notebook => {
    if (open.includes(notebook.id)) {
      if (!runtimes.current.has(notebook.id)) {
        createRuntime(notebook);
      }
    } else {
      if (runtimes.current.has(notebook.id)) {
        deleteRuntime(notebook);
      }
    }
  });

  const notebook = notebooks.find(n => n.id === active);
  if (!notebook) {
    return null;
  }
  const runtime = runtimes.current.get(notebook.id);
  if (!runtime) {
    return null;
  }

  return (
    <ScrollArea>
      <div className="px-3 pt-2 pb-12">
        <CellInsertion index={0} />
        {
          notebook.cells.map((cell, index) => (
            // Forcing re-rendering on reorders (index changes) fixes disposal conflicts
            <React.Fragment key={`${cell.id}-${index}`}>
              {cell.cell_type === "code" ? (
                <CodeCellView 
                  notebook={notebook} 
                  cell={cell} 
                  index={index} 
                  runtime={runtime}
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
  const [running, setRunning] = useState(false);

  function handleChange(value: string | undefined) {
    if (value !== undefined) {
      dispatch({ type: 'UPDATE_CELL', notebookId: notebook.id, cellId: cell.id, cell: { 
        ...cell, source: value, status: null 
      }});
    }
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

  function updateResult(result: ExecutionResult) {

    // Build the output text
    let text = "";
    if (result.logs !== undefined && result.logs.length > 0) {
      text += result.logs.join("\n") + "\n";
    }
    if (result.result !== undefined) {
      text += result.result.toString() + "\n";
    }
    if (result.error !== undefined) {
      text += result.error + "\n";
    }

    // Update the cell
    dispatch({ 
      type: 'UPDATE_CELL', 
      notebookId: notebook.id, 
      cellId: cell.id, 
      cell: { 
        ...cell, 
        status: result.error ? "failure" : "success", 
        outputs: [{ 
          output_type: "execute_result", 
          data: { "text/plain": text } 
        }]
      }
    });

  }

  function handleRun() {
    
    setRunning(true);

    let source = cell.source;

    // Normalize line endings to LF
    source = source.replace(/\r\n/g, "\n");

    // Parse the code
    console.log("Parsing:", JSON.stringify(source));
    try {
      parser.reset();
      parser.feed(source);
    } catch (error) {
      console.error(error);
      updateResult({ error: `ParserError: Please check your code for syntax errors.` });
      return;
    }

    // Get the AST
    if (parser.results.length === 0) {
      updateResult({ result: "" });
      return;
    }
    const ast = parser.results[0];
    console.log("AST:", ast);

    // Generate the code
    const code = escodegen.generate(ast);
    console.log("Code:", code);

    // Execute the code
    runtime.execute(code).then((result) => {
      updateResult(result as ExecutionResult);
    }).catch((error) => {
      updateResult(error as ExecutionResult);
    }).finally(() => {
      setRunning(false);
    });
  }

  return (
    <div className="flex flex-col gap-2">

      <div className="group relative flex flex-row gap-2">
        
        {/* Run button & cell status indicators */}
        <div className="flex flex-col justify-between items-center">
          {
            (running) ? (
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
            (cell.status === "success") ? (
              <div className="p-1">
                <CheckIcon className="stroke-emerald-500" size={14} />
              </div>
            ) : (cell.status === "failure") ? (
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
      <div className="flex pl-8 max-h-96">
        <ScrollArea className="grow">
          {cell.outputs.map((output, index) => (
            <div key={index} className="p-2 rounded-md my-2">
              <div className="text-sm whitespace-pre-wrap text-foreground">
                {output.data["text/plain"]}
              </div>
            </div>
          ))}
        </ScrollArea>
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
        id: crypto.randomUUID(), cell_type: "code", source: "", status: null, outputs: []
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  function calculateHeight(content: string) {
    const lines = Math.max(1, content.split('\n').length);
    return paddingTop + paddingBottom + lineHeight * lines;
  }

  function handleMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  useEffect(() => {

    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };

  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, [containerSize]);

  return (
    <div ref={containerRef}>
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
        defaultLanguage={type === "code" ? languageId : "markdown"}
        loading={
          <div className="w-full flex items-center justify-center">
            <Loading />
          </div>
        }
      />
    </div>
  )
}
