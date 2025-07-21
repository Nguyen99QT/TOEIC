import React from 'react';
import ModernAddQuestionForm from '../../components/Nguyen/ModernAddQuestionForm';

const ModernAddQuestionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Question</h1>
          <p className="text-gray-600 mt-2">Create individual TOEIC questions with audio and image support</p>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ModernAddQuestionForm />
        </div>
      </div>
    </div>
  );
};

export default ModernAddQuestionPage;
