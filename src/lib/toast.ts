import { toast as _toast } from 'sonner';
import { CircleXIcon, CircleCheckIcon, InfoIcon, CircleAlertIcon } from 'lucide-react';
import React from 'react';


type Status = 'error' | 'info' | 'warning';


const icons: Record<Status, React.ReactNode> = {
  error: React.createElement(CircleXIcon, {
    stroke: "#F85149",
    size: 16
  }),
  info: React.createElement(InfoIcon, {
    stroke: "#0078D4",
    size: 16
  }),
  warning: React.createElement(CircleAlertIcon, {
    stroke: "#FFCC00",
    size: 16
  })
};


export const toast = (title: string, description: string = '', status: Status = 'info') => {  
  return _toast(title, {
    icon: icons[status], description: description
  });
};