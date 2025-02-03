export interface Notebook {
  id: string;
  name: string;
  cells: NotebookCell[];
}

export type NotebookCell = CodeCell | MarkdownCell;

export interface BaseNotebookCell {
  id: string;
  cell_type: "code" | "markdown";
  source: string;
}

export interface CodeCell extends BaseNotebookCell {
  cell_type: "code";
  status: "success" | "failure" | null;
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