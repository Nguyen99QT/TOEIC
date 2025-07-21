import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestToast = () => {
  const showSuccess = () => {
    toast.success('Toast test successful! 🎉');
  };

  const showError = () => {
    toast.error('This is an error toast');
  };

  const showInfo = () => {
    toast.info('This is an info toast');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Toast Test Page</h2>
      <div className="space-x-4">
        <button 
          onClick={showSuccess} 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Success Toast
        </button>
        <button 
          onClick={showError} 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Error Toast
        </button>
        <button 
          onClick={showInfo} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Info Toast
        </button>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default TestToast;
