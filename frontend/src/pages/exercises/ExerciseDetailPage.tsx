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
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Exercise Detail</h1>
        <p className="mt-2 text-gray-600">Take this exercise</p>
      </div>

      <div className="card">
        <div className="card-body">
          <p className="text-gray-600">Exercise detail content coming soon.</p>
        </div>
      </div>

      <div className="space-y-2">
        {questions.map(q => (
          <EnhancedButton key={q.id} onClick={() => navigate(`/lessons/${lessonId}/exercises/${exerciseId}/questions/${q.id}`)}>
            {q.title}
          </EnhancedButton>
        ))}
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
