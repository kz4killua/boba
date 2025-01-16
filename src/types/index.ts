export interface Notebook {
  cells: NotebookCell[];
  name: string;
}

export type NotebookCell = CodeCell | MarkdownCell;

export interface BaseNotebookCell {
  cell_type: "code" | "markdown";
  source: string;
}

export interface CodeCell extends BaseNotebookCell {
  cell_type: "code";
  executed: boolean;
  outputs: CodeCellOutput[];
}

export interface MarkdownCell extends BaseNotebookCell {
  cell_type: "markdown";
}

interface CodeCellOutput {
  output_type: "execute_result",
  data: {
    "text/plain": string;
  }
}