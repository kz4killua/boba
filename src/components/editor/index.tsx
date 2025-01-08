"use client";

import { useState, useEffect, useRef } from "react"
import type { NotebookCell } from "@/types"
import * as monaco from "monaco-editor"
import MonacoEditor, { Monaco } from "@monaco-editor/react"
import { tokensProvider, languageName, completionItemProvider, languageConfiguration } from "@/lib/language"


export function Editor() {

  const cell: NotebookCell = {
    cell_type: "code",
    source: "",
    outputs: [],
    execution_count: 1
  }

  return (
    <div>
      <CodeCell cell={cell} />
    </div>
  )
}

function CodeCell({
  cell
} : {
  cell: NotebookCell
}) {

  const [content, setContent] = useState(cell.source)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

  function calculateHeight(content: string) {
    const lines = Math.max(1, content.split('\n').length);
    return 20 + 20 * lines;
  }

  function handleChange(value: string | undefined) {
    if (value !== undefined) {
      setContent(value);
    }
  }

  function handleMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    monaco.languages.register({ id: languageName });
    monaco.languages.setMonarchTokensProvider(languageName, tokensProvider);
    monaco.languages.registerCompletionItemProvider(languageName, completionItemProvider);
    monaco.languages.setLanguageConfiguration(languageName, languageConfiguration);
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, [content])

  return (
    <div>
      <MonacoEditor
        defaultValue={cell.source}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          padding: { top: 10, bottom: 10 },
          lineHeight: 20,
          scrollBeyondLastLine: false,
          scrollbar: { vertical: 'hidden', horizontal: 'auto' },
          rulers: [],
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          lineNumbers: "off",
        }}
        height={calculateHeight(content)}
        onChange={handleChange}
        onMount={handleMount}
        defaultLanguage={languageName}
      />
    </div>
  )
}