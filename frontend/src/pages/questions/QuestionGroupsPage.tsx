import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionGroupList from '../../components/Nguyen/QuestionGroupList';

const QuestionGroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectGroup = (groupId: number) => {
    navigate(`/questions/groups/${groupId}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Question Groups</h1>
        <p className="mt-2 text-gray-600">
          Browse and manage available question groups for TOEIC practice.
        </p>
      </div>
      
      <QuestionGroupList 
        onSelectGroup={handleSelectGroup}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default QuestionGroupsPage;
