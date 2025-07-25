import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import { toast } from 'react-hot-toast';
import { User } from '../../types';
import { getMembershipStatus, formatRemainingTime, formatExpiryDate, MembershipStatus } from '../../services/membership';

interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  country?: string;
  gender?: string;
}

const UserProfile: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    gender: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        dateOfBirth: currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : '',
        country: currentUser.country || '',
        gender: currentUser.gender || ''
      });

      // Load membership status
      const loadMembershipStatus = async () => {
        try {
          const membershipData = await getMembershipStatus();
          setMembershipStatus(membershipData);
        } catch (error) {
          console.log('Membership status not available:', error);
        }
      };

      loadMembershipStatus();
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.put(`/api/users/${currentUser?.id}`, formData);

      if (response.data) {
        toast.success('Profile updated successfully!');
        updateCurrentUser(response.data);
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        dateOfBirth: currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : '',
        country: currentUser.country || '',
        gender: currentUser.gender || ''
      });
    }
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                    {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {currentUser.fullName || currentUser.username}
                </h2>
                <p className="text-gray-600 mb-4">{currentUser.email}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Role</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentUser.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {currentUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Score</span>
                    <span className="text-lg font-semibold text-indigo-600">
                      {currentUser.totalScore || 0}
                    </span>
                  </div>

                  {/* Membership Information */}
                  {membershipStatus && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Membership</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${membershipStatus.membershipType === 'PREMIUM'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}>
                          {membershipStatus.membershipType === 'PREMIUM' ? '⭐ Premium' : '🆓 Free'}
                        </span>
                      </div>

                      {membershipStatus.membershipType === 'PREMIUM' && (
                        <>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Status</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${membershipStatus.isExpired
                                ? 'bg-red-100 text-red-700'
                                : membershipStatus.daysRemaining !== null && membershipStatus.daysRemaining <= 7
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                              {membershipStatus.isExpired ? 'Expired' :
                                membershipStatus.daysRemaining !== null && membershipStatus.daysRemaining <= 7 ? 'Expiring Soon' : 'Active'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Time Remaining</span>
                            <span className={`text-sm font-semibold ${membershipStatus.isExpired
                                ? 'text-red-600'
                                : membershipStatus.daysRemaining !== null && membershipStatus.daysRemaining <= 7
                                  ? 'text-orange-600'
                                  : 'text-green-600'
                              }`}>
                              {formatRemainingTime(membershipStatus.daysRemaining)}
                            </span>
                          </div>

                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Expires On</div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatExpiryDate(membershipStatus.expiresAt)}
                            </div>
                          </div>
                        </>
                      )}

                      {membershipStatus.membershipType === 'FREE' && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-sm text-blue-800 font-medium mb-1">🚀 Upgrade to Premium</div>
                          <div className="text-xs text-blue-600">
                            Get unlimited access to all TOEIC materials
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={currentUser.username}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing
                          ? 'bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'bg-gray-50'
                        }`}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing
                          ? 'bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'bg-gray-50'
                        }`}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing
                          ? 'bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'bg-gray-50'
                        }`}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing
                          ? 'bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'bg-gray-50'
                        }`}
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing
                          ? 'bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'bg-gray-50'
                        }`}
                    />
                  </div>
                </div>

                {/* Account Info */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                      </label>
                      <input
                        type="text"
                        value={currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Updated
                      </label>
                      <input
                        type="text"
                        value={currentUser.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString() : 'N/A'}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 