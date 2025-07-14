/**
 * ================================================================
 * ADMIN CONTENT PAGE COMPONENT
 * ================================================================
 */

import React from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { useAuth } from '../../contexts/AuthContext';

const AdminContentPage: React.FC = () => {
  const breadcrumbItems = useBreadcrumb();
  const { currentUser } = useAuth();

  // Check if user is admin
  if (!currentUser || !currentUser.role?.includes('ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-2 text-gray-600">Manage lessons, exercises, and content</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">
            Content management functionality will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminContentPage;
