import { type ReactNode } from 'react';
import { useFocusTrap, useReturnFocus } from '../utils/accessibility';
import { X } from 'lucide-react';

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   title?: string;
   children: ReactNode;
   size?: 'sm' | 'md' | 'lg' | 'xl';
   showCloseButton?: boolean;
}

export function Modal({
   isOpen,
   onClose,
   title,
   children,
   size = 'md',
   showCloseButton = true,
}: ModalProps) {
   const trapRef = useFocusTrap(isOpen);
   useReturnFocus(isOpen);

   if (!isOpen) return null;

   const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
   };

   const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
         onClose();
      }
   };

   const handleEscape = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
         onClose();
      }
   };

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
         onClick={handleBackdropClick}
         onKeyDown={handleEscape}
         role="dialog"
         aria-modal="true"
         aria-labelledby={title ? 'modal-title' : undefined}
      >
         <div
            ref={trapRef}
            className={`bg-(--color-background-card) rounded-lg shadow-xl border border-(--color-border) w-full ${sizeClasses[size]} max-h-[90vh] overflow-auto`}
         >
            {/* Header */}
            {(title || showCloseButton) && (
               <div className="flex items-center justify-between p-6 border-b border-(--color-border)">
                  {title && (
                     <h2
                        id="modal-title"
                        className="text-xl font-semibold text-(--color-text-primary)"
                     >
                        {title}
                     </h2>
                  )}
                  {showCloseButton && (
                     <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-(--color-text-secondary) hover:text-(--color-text-primary)"
                        aria-label="Close modal"
                     >
                        <X size={20} />
                     </button>
                  )}
               </div>
            )}

            {/* Content */}
            <div className="p-6">{children}</div>
         </div>
      </div>
   );
}

/**
 * Confirmation Modal
 */
interface ConfirmModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message: string;
   confirmText?: string;
   cancelText?: string;
   variant?: 'danger' | 'warning' | 'info';
   isLoading?: boolean;
}

export function ConfirmModal({
   isOpen,
   onClose,
   onConfirm,
   title,
   message,
   confirmText = 'Confirm',
   cancelText = 'Cancel',
   variant = 'info',
   isLoading = false,
}: ConfirmModalProps) {
   const variantClasses = {
      danger: 'bg-red-600 hover:bg-red-700',
      warning: 'bg-yellow-600 hover:bg-yellow-700',
      info: 'bg-primary hover:bg-primary/90',
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
         <div className="space-y-4">
            <p className="text-(--color-text-secondary)">{message}</p>
            <div className="flex gap-3 justify-end">
               <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 border border-(--color-border) rounded-lg text-(--color-text-primary) hover:bg-gray-800 transition-colors disabled:opacity-50"
               >
                  {cancelText}
               </button>
               <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 ${variantClasses[variant]}`}
               >
                  {isLoading ? 'Processing...' : confirmText}
               </button>
            </div>
         </div>
      </Modal>
   );
}
