import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface SuccessMessageProps {
  title: string;
  message: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  onClose,
  showCloseButton = true
}) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-6 w-6 text-green-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
          <p className="mt-1 text-sm text-green-700">{message}</p>
        </div>
        {showCloseButton && onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage; 