import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CollaboratorDashboard from '../pages/collaborator/CollaboratorDashboard';
import CollaboratorContent from '../pages/collaborator/CollaboratorContent';
import CollaboratorAnalytics from '../pages/collaborator/CollaboratorAnalytics';

const CollaboratorRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<CollaboratorDashboard />} />
            <Route path="content" element={<CollaboratorContent />} />
            <Route path="analytics" element={<CollaboratorAnalytics />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
        </Routes>
    );
};

export default CollaboratorRoutes;
