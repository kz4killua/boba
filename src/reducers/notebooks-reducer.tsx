import type { Notebook } from "@/types";


export type NotebooksAction =
  | { type: 'CREATE_NOTEBOOK', notebook: Notebook }
  | { type: 'DELETE_NOTEBOOK', notebook: Notebook }
  | { type: 'UPDATE_NOTEBOOK', notebook: Notebook }
  | { type: 'LOAD_NOTEBOOKS', notebooks: Notebook[] }


export type NotebooksState = {
  notebooks: Notebook[];
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
        notebooks: state.notebooks.filter(notebook => notebook !== action.notebook)
      }
    case 'UPDATE_NOTEBOOK':
      return {
        ...state,
        notebooks: state.notebooks.map(notebook => {
          if (notebook === action.notebook) {
            return action.notebook;
          }
          return notebook;
        })
      }
    case 'LOAD_NOTEBOOKS':
      return {
        ...state,
        notebooks: action.notebooks
      }
    default:
      return state;
  }
}
