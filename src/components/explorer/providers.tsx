"use client"

import { createContext, useContext, useState } from 'react';

interface ExplorerContextType {
  toggle: () => void;
  open: boolean;
}

const ExplorerContext = createContext<ExplorerContextType | undefined>(undefined);

export const useExplorer = () => {
  const context = useContext(ExplorerContext);
  if (!context) {
    throw new Error('useExplorer must be used within a ExplorerProvider');
  }
  return context;
};

export const ExplorerProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);

  const toggle = () => {
    setOpen(!open);
  }

  return (
    <ExplorerContext.Provider value={{ toggle, open }}>
      {children}
    </ExplorerContext.Provider>
  );
}