import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  return (
    <div className="fixed top-14 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <div
        id="app-toast-alert"
        className="pointer-events-auto bg-white/95 text-stone-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm max-w-md w-full border border-stone-200/80 backdrop-blur-md animate-in fade-in slide-in-from-top duration-200"
      >
        {icons[toast.type || 'success']}
        <span className="font-medium flex-1">{toast.message}</span>
      </div>
    </div>
  );
};
