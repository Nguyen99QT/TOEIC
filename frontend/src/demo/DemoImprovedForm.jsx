import React from 'react';
import ImprovedAddQuestionGroupForm from './components/admin/questions/ImprovedAddQuestionGroupForm';
import ToastConfig from './components/common/ToastConfig';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ImprovedAddQuestionGroupForm />
      <ToastConfig />
    </div>
  );
};

export default App;
