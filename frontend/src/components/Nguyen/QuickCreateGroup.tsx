import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../services/auth';

interface QuickCreateProps {
  onSuccess?: () => void;
}

const QuickCreateGroup: React.FC<QuickCreateProps> = ({ onSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [partId, setPartId] = useState(1);
  const [groupType, setGroupType] = useState('PRACTICE');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        alert('No authentication token found. Please login again.');
        return;
      }

      console.log('🚀 Creating question group with data:', {
        groupName,
        description,
        partId,
        groupType
      });

      const response = await fetch('http://localhost:8080/api/question-group', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupName,
          description,
          partId,
          groupType,
        }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        console.error('❌ Error status:', response.status);
        console.error('❌ Error headers:', Object.fromEntries(response.headers.entries()));

        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(`Server error: ${errorJson.message || errorText}`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown server error'}`);
        }
      }

      const result = await response.json();
      console.log('✅ Group created successfully:', result);
      alert('Question group created successfully!');
      setShowForm(false);
      setGroupName('');
      setDescription('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('❌ Error creating group:', error);

      // Enhanced error logging
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Network error: Cannot connect to backend');
        alert('Network error: Cannot connect to server. Please check if backend is running.');
      } else if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        alert('Failed to create group: ' + error.message);
      } else {
        console.error('❌ Unknown error type:', typeof error, error);
        alert('Failed to create group: Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Quick Create Group
        </button>
        <button
          onClick={() => navigate('/add/toeic-group')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          🎯 TOEIC Format
        </button>
        <button
          onClick={() => navigate('/add/add-group-questions')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Advanced Create
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Enter group name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            rows={2}
            placeholder="Optional description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Part</label>
            <select
              value={partId}
              onChange={(e) => setPartId(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7].map(part => (
                <option key={part} value={part}>Part {part}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="PRACTICE">Practice</option>
              <option value="TEST">Test</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickCreateGroup;
