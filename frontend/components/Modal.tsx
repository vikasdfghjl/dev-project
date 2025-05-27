
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // For modal body content
  footerContent?: React.ReactNode; // For modal action buttons
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footerContent, size = 'md' }) => {
  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title-id"
    >
      <div
        className={`bg-card dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title-id" className="text-2xl font-semibold text-foreground dark:text-slate-100 flex items-center">
            {/* Icon could be passed as a prop if needed */}
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div>{children}</div>

        {footerContent && (
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-border dark:border-slate-700">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};
export const Modal = React.memo(ModalComponent);
