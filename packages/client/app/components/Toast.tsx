import toast, { Toaster as HotToaster } from 'react-hot-toast';

// Customized toast notifications
export const showToast = {
   success: (message: string) => {
      toast.success(message, {
         duration: 4000,
         position: 'top-right',
         style: {
            background: 'var(--color-background-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            padding: '16px',
            borderRadius: '8px',
         },
         iconTheme: {
            primary: '#00c4cc',
            secondary: '#FFFAEE',
         },
      });
   },

   error: (message: string) => {
      toast.error(message, {
         duration: 5000,
         position: 'top-right',
         style: {
            background: 'var(--color-background-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid #ef4444',
            padding: '16px',
            borderRadius: '8px',
         },
         iconTheme: {
            primary: '#ef4444',
            secondary: '#FFFAEE',
         },
      });
   },

   warning: (message: string) => {
      toast(message, {
         duration: 4500,
         position: 'top-right',
         icon: '⚠️',
         style: {
            background: 'var(--color-background-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid #f59e0b',
            padding: '16px',
            borderRadius: '8px',
         },
      });
   },

   info: (message: string) => {
      toast(message, {
         duration: 4000,
         position: 'top-right',
         icon: 'ℹ️',
         style: {
            background: 'var(--color-background-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid #3b82f6',
            padding: '16px',
            borderRadius: '8px',
         },
      });
   },

   loading: (message: string) => {
      return toast.loading(message, {
         position: 'top-right',
         style: {
            background: 'var(--color-background-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            padding: '16px',
            borderRadius: '8px',
         },
      });
   },

   promise: <T,>(
      promise: Promise<T>,
      messages: {
         loading: string;
         success: string | ((data: T) => string);
         error: string | ((error: any) => string);
      }
   ) => {
      return toast.promise(promise, messages, {
         style: {
            background: 'var(--color-background-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            padding: '16px',
            borderRadius: '8px',
         },
         success: {
            iconTheme: {
               primary: '#00c4cc',
               secondary: '#FFFAEE',
            },
         },
         error: {
            iconTheme: {
               primary: '#ef4444',
               secondary: '#FFFAEE',
            },
         },
      });
   },

   dismiss: (toastId?: string) => {
      toast.dismiss(toastId);
   },
};

// Toaster component to be added to root layout
export function Toaster() {
   return (
      <HotToaster
         position="top-right"
         reverseOrder={false}
         gutter={8}
         toastOptions={{
            duration: 4000,
            style: {
               background: 'var(--color-background-card)',
               color: 'var(--color-text-primary)',
               border: '1px solid var(--color-border)',
            },
         }}
      />
   );
}
