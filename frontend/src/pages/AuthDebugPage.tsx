import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { debugAuthState } from '../utils/debugAuth';

const AuthDebugPage: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('🔍 AuthDebugPage mounted');
    debugAuthState();
  }, []);

  const handleDebug = () => {
    debugAuthState();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>

      <div className="grid gap-6">
        {/* Auth Context Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-3">Auth Context</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Current User:</strong> {currentUser ? '✅ Present' : '❌ Null'}</p>
          </div>
        </div>

        {/* User Details */}
        {currentUser && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-3">User Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {currentUser.id}</p>
              <p><strong>Username:</strong> {currentUser.username}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
              <p><strong>Roles:</strong> {JSON.stringify((currentUser as any).roles)}</p>
              <p><strong>Membership Type:</strong> {currentUser.membershipType}</p>
              <p><strong>Is Premium:</strong> {currentUser.isPremium ? '✅' : '❌'}</p>
            </div>
          </div>
        )}

        {/* Test Permission Logic */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-3">Permission Test</h2>
          <div className="space-y-2 text-sm">
            {currentUser ? (
              <>
                <p><strong>Role (lowercase):</strong> {currentUser.role?.toLowerCase()}</p>
                <p><strong>Is Admin:</strong> {currentUser.role?.toLowerCase() === 'admin' ? '✅' : '❌'}</p>
                <p><strong>Is Collaborator:</strong> {currentUser.role?.toLowerCase() === 'collaborator' ? '✅' : '❌'}</p>
                <p><strong>Membership (lowercase):</strong> {currentUser.membershipType?.toLowerCase()}</p>
                <p><strong>Is Premium:</strong> {currentUser.membershipType?.toLowerCase() === 'premium' ? '✅' : '❌'}</p>
                <p><strong>Is VIP:</strong> {currentUser.membershipType?.toLowerCase() === 'vip' ? '✅' : '❌'}</p>

                <div className="mt-4 p-3 bg-white rounded border">
                  <strong>Can Create Quick Test:</strong>{' '}
                  {(() => {
                    const role = currentUser.role?.toLowerCase();
                    const membershipType = currentUser.membershipType?.toLowerCase();
                    const canCreate = (
                      role === 'admin' ||
                      role === 'collaborator' ||
                      membershipType === 'vip' ||
                      membershipType === 'premium'
                    );
                    return canCreate ? '✅ YES' : '❌ NO';
                  })()}
                </div>
              </>
            ) : (
              <p>❌ No user logged in</p>
            )}
          </div>
        </div>

        {/* Debug Button */}
        <button
          onClick={handleDebug}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔍 Run Debug in Console
        </button>
      </div>
    </div>
  );
};

export default AuthDebugPage;
