import { AlertTriangle, X } from 'lucide-react';

interface AlertBannerProps {
  message: string;
  severity: 'warning' | 'alert';
  onDismiss: () => void;
}

export default function AlertBanner({ message, severity, onDismiss }: AlertBannerProps) {
  const bgColor = severity === 'alert' ? 'bg-destructive' : 'bg-orange-500';
  const textColor = severity === 'alert' ? 'text-destructive-foreground' : 'text-white';

  return (
    <div className={`${bgColor} ${textColor} px-4 py-3 animate-in slide-in-from-top duration-300`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium" data-testid="alert-message">{message}</span>
        </div>
        <button 
          onClick={onDismiss}
          className={`${textColor} hover:opacity-80 transition-opacity`}
          data-testid="alert-dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
