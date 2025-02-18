import { toast } from 'react-hot-toast';

type SuccessToastProps = {
    message: string;
};

export default function showErrorToast({ message }: SuccessToastProps) {
    toast.error(message, {
        style: {
            border: '2px solid #1E293B', //GRAY-800
            padding: '16px',
            color: '#FFFFFF',
            background: '#0F172A',//GRAY-900
        },
        iconTheme: {
            primary: 'red',
            secondary: '#FFFAEE',
        },
    });
}
