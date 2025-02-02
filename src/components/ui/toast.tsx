import { toast as _toast } from 'sonner';
import { CircleXIcon, InfoIcon, CircleAlertIcon, XIcon } from 'lucide-react';
import { TooltipButton } from '@/components/ui/tooltip-button';


type Status = 'error' | 'info' | 'warning';


export function toast(status: Status, text: string) {
  return _toast.custom((t) => (
    <Toast 
      status={status} 
      text={text} 
      onClose={() => _toast.dismiss(t)}
    />
  ));
}


function Toast({
  status,
  text, 
  onClose
} : {
  status: Status,
  text: string,
  onClose: () => void
}) {
  return (
    <div className='bg-secondary rounded-md shadow-md px-2 py-4 text-sm'>
      <div className='flex items-start gap-2'>
        <div className='p-1 h-auto'>
          {
            status === 'error' ? (
              <CircleXIcon stroke="#F85149" size={16} />
            ) : status === 'info' ? (
              <InfoIcon stroke="#0078D4" size={16} />
            ) : (
              <CircleAlertIcon stroke="#FFCC00" size={16} />
            )
          }
        </div>
        <p>
          {text}
        </p>
        <TooltipButton
          icon={<XIcon />} 
          help="Close" 
          onClick={onClose} 
          className='shrink'
        />
      </div>
    </div>
  )
}