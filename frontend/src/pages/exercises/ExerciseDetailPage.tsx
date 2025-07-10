/**
 * ================================================================
 * EXERCISE DETAIL PAGE COMPONENT
 * ================================================================
 */

import React from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';

const ExerciseDetailPage: React.FC = () => {
  const breadcrumbItems = useBreadcrumb();

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
    </div>
  );
};

export default ExerciseDetailPage;
