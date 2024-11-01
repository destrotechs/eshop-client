import React, { useEffect } from 'react';

const Toast = ({ message, show, onClose, type='success' }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 6000); // Auto-hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    // Determine styles and icons based on the type
    const isSuccess = type === 'success';
    const toastClasses = isSuccess
        ? 'bg-white text-gray-800'
        : 'bg-red-100 text-red-800';
    const iconClasses = isSuccess
        ? 'text-green-500 bg-green-100'
        : 'text-red-500 bg-red-100';
    const iconPath = isSuccess
        ? "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" // Success icon path
        : "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"; // Error icon path

    return (
        <div
            className={`fixed bottom-8 right-4 flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow ${toastClasses}`}
            role="alert"
        >
            <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${iconClasses} rounded-lg`}>
                <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d={iconPath} />
                </svg>
                <span className="sr-only">{isSuccess ? 'Success icon' : 'Error icon'}</span>
            </div>
            <div className="ms-3 text-sm font-normal">{message}</div>
            <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={onClose}
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Toast;
