/**
 * ================================================================
 * PROFILE PAGE COMPONENT
 * ================================================================
 */

import {
  CalendarIcon,
  CameraIcon,
  CheckIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  TrophyIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useAuth } from '../../contexts/AuthContext';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { getUserProfile, getUserStats, updateUserProfile, uploadProfilePicture } from '../../services/users';
import { User } from '../../types';

interface UserProfile extends User {
  totalLessonsCompleted?: number;
  totalExercisesCompleted?: number;
  averageScore?: number;
  totalTimeSpent?: number;
  currentStreak?: number;
  longestStreak?: number;
  registrationDate?: string;
  lastLoginDate?: string;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  targetScore: number;
}

const ProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const breadcrumbItems = useBreadcrumb();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    targetScore: 600
  });

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);

        // Load basic profile info
        const profileData = await getUserProfile(currentUser.id);

        // Load user statistics
        let statsData = null;
        try {
          statsData = await getUserStats(currentUser.id);
        } catch (error) {
          console.log('Stats not available:', error);
        }

        const combinedProfile: UserProfile = {
          ...profileData,
          ...statsData
        };

        setProfile(combinedProfile);

        // Initialize form data
        setFormData({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          phoneNumber: profileData.phoneNumber || '',
          address: profileData.address || '',
          targetScore: profileData.targetScore || 600
        });

      } catch (error: any) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetScore' ? parseInt(value) || 0 : value
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    try {
      setIsSaving(true);
      const imageUrl = await uploadProfilePicture(currentUser.id, file);

      // Update profile state
      setProfile(prev => prev ? { ...prev, profilePicture: imageUrl } : null);

      // Update auth context
      updateCurrentUser({ ...currentUser, profilePicture: imageUrl });

      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle profile update
  const handleSaveProfile = async () => {
    if (!currentUser) return;

    try {
      setIsSaving(true);

      const updatedProfile = await updateUserProfile(currentUser.id, {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        targetScore: formData.targetScore
      });

      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      updateCurrentUser({ ...currentUser, ...updatedProfile });

      setIsEditing(false);
      toast.success('Profile updated successfully!');

    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    if (!profile) return;

    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phoneNumber: profile.phoneNumber || '',
      address: profile.address || '',
      targetScore: profile.targetScore || 600
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile data</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account information and learning progress</p>
      </div>

      {/* Profile Picture Section */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="card-body text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100">
                  <UserIcon className="w-16 h-16 text-primary-600" />
                </div>
              )}
            </div>

            <label
              htmlFor="profile-picture-upload"
              className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full cursor-pointer transition-colors"
            >
              <CameraIcon className="w-5 h-5" />
            </label>

            <input
              id="profile-picture-upload"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              disabled={isSaving}
              aria-label="Upload profile picture"
              title="Upload a new profile picture"
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-gray-600">{profile.email}</p>
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${profile.membershipType === 'PREMIUM'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
              }`}>
              {profile.membershipType === 'PREMIUM' ? '⭐ Premium' : '🆓 Free'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-body text-center">
            <TrophyIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              {profile.totalLessonsCompleted || 0}
            </h3>
            <p className="text-gray-600">Lessons Completed</p>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-body text-center">
            <ClockIcon className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              {Math.round((profile.totalTimeSpent || 0) / 60)}h
            </h3>
            <p className="text-gray-600">Study Time</p>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-body text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {profile.currentStreak || 0}
            </h3>
            <p className="text-gray-600">Day Streak</p>
          </div>
        </motion.div>
      </div>

      {/* Profile Information */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="card-header flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="btn btn-primary btn-sm"
                >
                  <CheckIcon className="w-4 h-4 mr-1" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="btn btn-secondary btn-sm"
                >
                  <XMarkIcon className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary btn-sm"
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="form-label">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your first name"
                />
              ) : (
                <p className="text-gray-900">{profile.firstName || 'Not provided'}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="form-label">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your last name"
                />
              ) : (
                <p className="text-gray-900">{profile.lastName || 'Not provided'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="form-label flex items-center">
                <EnvelopeIcon className="w-4 h-4 mr-1 text-gray-500" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email"
                />
              ) : (
                <p className="text-gray-900">{profile.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="form-label flex items-center">
                <PhoneIcon className="w-4 h-4 mr-1 text-gray-500" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-gray-900">{profile.phoneNumber || 'Not provided'}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="form-label flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1 text-gray-500" />
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your address"
                />
              ) : (
                <p className="text-gray-900">{profile.address || 'Not provided'}</p>
              )}
            </div>

            {/* Target Score */}
            <div>
              <label htmlFor="targetScore" className="form-label">TOEIC Target Score</label>
              {isEditing ? (
                <select
                  id="targetScore"
                  name="targetScore"
                  value={formData.targetScore}
                  onChange={handleInputChange}
                  className="form-input"
                  aria-label="Select your TOEIC target score"
                >
                  <option value={450}>450 (Beginner)</option>
                  <option value={600}>600 (Intermediate)</option>
                  <option value={750}>750 (Advanced)</option>
                  <option value={850}>850 (Expert)</option>
                  <option value={990}>990 (Perfect)</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile.targetScore || 600}</p>
              )}
            </div>

            {/* Registration Date */}
            <div>
              <label className="form-label flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
                Member Since
              </label>
              <p className="text-gray-900">
                {profile.registrationDate
                  ? new Date(profile.registrationDate).toLocaleDateString()
                  : 'Recently joined'
                }
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
