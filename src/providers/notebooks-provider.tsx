"use client";

import { createContext, useEffect, useContext, useState, useReducer } from 'react';
import { loadNotebooks, saveNotebooks } from '@/lib/storage';
import { notebooksReducer, NotebooksState, NotebooksAction } from '@/reducers/notebooks-reducer';

interface NotebooksContextType extends NotebooksState {
  loading: boolean;
  dispatch: React.Dispatch<NotebooksAction>;
}

const NotebooksContext = createContext<NotebooksContextType | undefined>(undefined);

export const useNotebooks = () => {
  const context = useContext(NotebooksContext);
  if (!context) {
    throw new Error('useNotebooks must be used within a NotebooksProvider');
  }
  return context;
};

export const NotebooksProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(notebooksReducer, { 
    notebooks: [],  open: [], active: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      dispatch({ 
        type: 'LOAD_NOTEBOOKS', notebooks: loadNotebooks() 
      });
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    saveNotebooks(state.notebooks);
  }, [state.notebooks]);

  return (
    <NotebooksContext.Provider value={{ ...state, loading, dispatch }}>
      {children}
    </NotebooksContext.Provider>
  );
}