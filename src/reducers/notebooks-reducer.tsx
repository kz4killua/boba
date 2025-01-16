import type { Notebook, CodeCell, NotebookCell } from "@/types";


export type NotebooksAction =
  | { type: 'CREATE_NOTEBOOK', notebook: Notebook }
  | { type: 'DELETE_NOTEBOOK', name: Notebook["name"] }
  | { type: 'UPDATE_NOTEBOOK', name: Notebook["name"], notebook: Notebook }
  | { type: 'LOAD_NOTEBOOKS', notebooks: Notebook[] }
  | { type: 'OPEN_NOTEBOOK', name: Notebook["name"] }
  | { type: 'CLOSE_NOTEBOOK', name: Notebook["name"] }
  | { type: 'SET_ACTIVE_NOTEBOOK', name: Notebook["name"] | null }
  | { type: 'CREATE_CODE_CELL', notebook: Notebook["name"], cell: CodeCell, index: number }
  | { type: 'DELETE_CELL', notebook: Notebook["name"], id: NotebookCell["id"] }


export type NotebooksState = {
  notebooks: Notebook[];
  open: Notebook["name"][];
  active: Notebook["name"] | null;
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
        notebooks: state.notebooks.filter(notebook => notebook.name !== action.name)
      }
    case 'UPDATE_NOTEBOOK':
      return {
        ...state,
        notebooks: state.notebooks.map(notebook => {
          if (notebook.name === action.name) {
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
      if (state.open.includes(action.name)) {
        return state;
      } else {
        return {
          ...state,
          open: [...state.open, action.name]
        }
      }
    case 'CLOSE_NOTEBOOK':
      return {
        ...state,
        open: state.open.filter(name => name !== action.name)
      }
    case 'SET_ACTIVE_NOTEBOOK':
      return {
        ...state,
        active: action.name
      }
    case 'CREATE_CODE_CELL':
      return {
        ...state,
        notebooks: state.notebooks.map(notebook => {
          if (notebook.name === action.notebook) {
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
    case 'DELETE_CELL':
      return {
        ...state,
        notebooks: state.notebooks.map(notebook => {
          if (notebook.name === action.notebook) {
            return {
              ...notebook,
              cells: notebook.cells.filter(cell => cell.id !== action.id)
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
