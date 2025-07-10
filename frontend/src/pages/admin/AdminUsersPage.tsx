/**
 * ================================================================
 * ADMIN USERS PAGE COMPONENT
 * ================================================================
 */

import React from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';

const AdminUsersPage: React.FC = () => {
  const breadcrumbItems = useBreadcrumb();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">Manage platform users</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
        </div>
        <div className="card-body">
          <p className="text-gray-600">User management interface coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
