/**
 * ================================================================
 * EXERCISE DETAIL PAGE COMPONENT
 * ================================================================
 */

import React from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import EnhancedButton from '../../components/ui/EnhancedButton';

const ExerciseDetailPage: React.FC = () => {
  const breadcrumbItems = useBreadcrumb();
  const navigate = useNavigate();
  const { lessonId, exerciseId } = useParams<{ lessonId: string; exerciseId: string }>();

  // Mock data - replace with your actual data fetching logic
  const questions = [
    { id: '1', title: 'Question 1' },
    { id: '2', title: 'Question 2' },
    { id: '3', title: 'Question 3' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
          <span className="inline-block bg-blue-100 text-blue-600 rounded-full p-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5V3m-8 9v6a2 2 0 002 2h4a2 2 0 002-2v-6" /></svg>
          </span>
          Exercise Detail
        </h1>
        <p className="mt-2 text-lg text-gray-600">Take this exercise</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6 flex items-center gap-4 animate-fade-in-up">
        <div className="flex-shrink-0">
          <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2m-6 0h6" /></svg>
        </div>
        <div>
          <p className="text-gray-700 text-base">Exercise detail content <span className="font-semibold text-blue-600">coming soon</span>.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up">
        {questions.map((q, idx) => (
          <EnhancedButton
            key={q.id}
            className="px-6 py-2 text-base font-semibold rounded-lg shadow bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition animate-fade-in-up"
            style={{ animationDelay: `${idx * 80}ms` }}
            onClick={() => navigate(`/lessons/${lessonId}/exercises/${exerciseId}/questions/${q.id}`)}
          >
            <span className="inline-block align-middle mr-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V5a4 4 0 00-8 0v2m8 0a4 4 0 01-8 0" /></svg>
            </span>
            {q.title}
          </EnhancedButton>
        ))}
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
