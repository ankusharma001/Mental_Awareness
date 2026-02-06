import toast from 'react-hot-toast';

export const notifySuccess = (msg) => toast.success(msg, { position: 'top-right', duration: 4000 });
export const notifyError = (msg) => toast.error(msg, { position: 'top-right', duration: 5000 });
