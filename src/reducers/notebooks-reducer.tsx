import type { Notebook } from "@/types";


export type NotebooksAction =
  | { type: 'CREATE_NOTEBOOK', notebook: Notebook }
  | { type: 'DELETE_NOTEBOOK', name: Notebook["name"] }
  | { type: 'UPDATE_NOTEBOOK', name: Notebook["name"], notebook: Notebook }
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
    default:
      return state;
  }
}
