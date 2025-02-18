// utils/toasts/toastUtils.ts
import { toast } from 'react-hot-toast';

type ToastPromiseOptions = {
    loading: string;
    success: string;
    error: string;
};

export const showPromiseToast = (promise: Promise<unknown>, options: ToastPromiseOptions) => {
    toast.promise(
        promise,
        {
            loading: options.loading,
            success: options.success,
            error: options.error,
        },
        {
            style: {
                border: '2px solid #1E293B', // GRAY-800
                padding: '16px',
                color: '#FFFFFF',
                background: '#0F172A', // GRAY-900

            },
            iconTheme: {
                primary: '#0F172A',
                secondary: '#FFFAEE',
            },
            success: {
                duration: 3000,
                className: 'bg-gray-900 border-gray-800', // Success specific styles
                iconTheme: { primary: 'green', secondary: 'white' }, // Success icon color
            },
            error: {
                duration: 3000,
                className: 'bg-gray-900 border-gray-800', // Error specific styles
                iconTheme: { primary: 'red', secondary: 'white' }, // Error icon color
            },
        }
    );
};