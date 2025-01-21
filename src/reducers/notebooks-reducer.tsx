import type { Notebook, CodeCell, NotebookCell } from "@/types";


export type NotebooksAction =
  | { type: 'CREATE_NOTEBOOK', notebook: Notebook }
  | { type: 'DELETE_NOTEBOOK', notebookId: Notebook["id"] }
  | { type: 'UPDATE_NOTEBOOK', notebookId: Notebook["id"], notebook: Notebook }
  | { type: 'LOAD_NOTEBOOKS', notebooks: Notebook[] }
  | { type: 'OPEN_NOTEBOOK', notebookId: Notebook["id"] }
  | { type: 'CLOSE_NOTEBOOK', notebookId: Notebook["id"] }
  | { type: 'SET_ACTIVE_NOTEBOOK', notebookId: Notebook["id"] | null }
  | { type: 'CREATE_CODE_CELL', notebookId: Notebook["id"], cell: CodeCell, index: number }
  | { type: 'UPDATE_CELL', notebookId: Notebook["id"], cellId: NotebookCell["id"], cell: NotebookCell }
  | { type: 'DELETE_CELL', notebookId: Notebook["id"], cellId: NotebookCell["id"] }
  | { type: 'MOVE_CELL', notebookId: Notebook["id"], cellId: NotebookCell["id"], index: number }


export type NotebooksState = {
  notebooks: Notebook[];
  open: Notebook["id"][];
  active: Notebook["id"] | null;
}

export const notebooksReducer = (state: NotebooksState, action: NotebooksAction): NotebooksState => {
  switch (action.type) {
    case 'CREATE_NOTEBOOK':
      return {
        ...state,
        notebooks: [...state.notebooks, action.notebook]
      }
    case 'DELETE_NOTEBOOK':
      return {
        ...state,
        notebooks: state.notebooks.filter(notebook => notebook.id !== action.notebookId)
      }
    case 'UPDATE_NOTEBOOK':
      return {
        ...state,
        notebooks: state.notebooks.map(notebook => {
          if (notebook.id === action.notebookId) {
            return action.notebook;
          } else {
            return notebook;
          }
        })
      }
    case 'LOAD_NOTEBOOKS':
      return {
        ...state,
        notebooks: action.notebooks
      }
    case 'OPEN_NOTEBOOK':
      if (state.open.includes(action.notebookId)) {
        return state;
      } else {
        return {
          ...state,
          open: [...state.open, action.notebookId]
        }
      }
    case 'CLOSE_NOTEBOOK':
      return {
        ...state,
        open: state.open.filter(id => id !== action.notebookId)
      }
    case 'SET_ACTIVE_NOTEBOOK':
      return {
        ...state,
        active: action.notebookId
      }
    case 'CREATE_CODE_CELL':
      return {
        ...state,
        notebooks: state.notebooks.map(notebook => {
          if (notebook.id === action.notebookId) {
            return {
              ...notebook,
              cells: [
                ...notebook.cells.slice(0, action.index),
                action.cell,
                ...notebook.cells.slice(action.index)
              ]
            }
          } else {
            return notebook;
          }
        })
      }
    case 'UPDATE_CELL':
      return {
        ...state,
        notebooks: state.notebooks.map(notebook => {
          if (notebook.id === action.notebookId) {
            return {
              ...notebook,
              cells: notebook.cells.map(cell => {
                if (cell.id === action.cellId) {
                  return action.cell;
                } else {
                  return cell;
                }
              })
            }
          } else {
            return notebook;
          }
        })
      }
    case 'DELETE_CELL':
      return {
        ...state,
        notebooks: state.notebooks.map(notebook => {
          if (notebook.id === action.notebookId) {
            return {
              ...notebook,
              cells: notebook.cells.filter(cell => cell.id !== action.cellId)
            }
          } else {
            return notebook;
          }
        })
      }
    case 'MOVE_CELL':
      return {
        ...state,
        notebooks: state.notebooks.map(notebook => {
          if (notebook.id === action.notebookId) {
            const cell = notebook.cells.find(cell => cell.id === action.cellId);
            if (!cell) {
              return notebook;
            }
            const oldIndex = notebook.cells.indexOf(cell);
            const newIndex = action.index;
            if (oldIndex === newIndex) {
              return notebook;
            }
            const cells = [...notebook.cells];
            cells.splice(oldIndex, 1);
            cells.splice(newIndex, 0, cell);
            return {
              ...notebook,
              cells: cells
            }
          } else {
            return notebook;
          }
        })
      }
    default:
      return state;
  }
}
