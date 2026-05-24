import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  const iconMap = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
  };

  const bgMap = {
    success: 'bg-emerald-500/10 border-emerald-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    info: 'bg-blue-500/10 border-blue-500/30',
  };

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 border rounded-xl backdrop-blur-xl shadow-2xl ${bgMap[toast.type]}`}
          >
            {iconMap[toast.type]}
            <span className="text-sm font-medium text-white flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-white/10 rounded-lg cursor-pointer transition">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
