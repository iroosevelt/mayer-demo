import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../components/Auth/AuthProvider';
import ApiService from '../../services/api';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import PageHeader from '../../components/PageHeader';

const Profile: React.FC = () => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        street: user.street || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await ApiService.updateUserProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to current user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        street: user.street || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
      });
    }
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Profile Settings"
        description="Manage your account information"
        action={
          !isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          ) : undefined
        }
      />

      {/* Success Message */}
      {message.text && (
        <div className={`px-4 py-3 rounded-xl text-sm ${
          message.type === 'success'
            ? 'bg-success-50 border border-success-200 text-success-700'
            : 'bg-danger-50 border border-danger-200 text-danger-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="card p-5 md:p-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-6 md:pb-8 border-b border-dark-100 mb-6 md:mb-8">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-700 font-bold text-2xl md:text-3xl">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-dark-900 mb-1">{user?.name || 'User'}</h2>
            <p className="text-sm md:text-base text-dark-600 mb-2 md:mb-3">{user?.email || ''}</p>
            <span className="badge badge-info">Customer Account</span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 md:space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-base md:text-lg font-semibold text-dark-900 mb-3 md:mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-dark-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="input"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-dark-700 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    id="company"
                    type="text"
                    className="input"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="pt-5 md:pt-6 border-t border-dark-100">
              <h3 className="text-base md:text-lg font-semibold text-dark-900 mb-3 md:mb-4">Address</h3>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-dark-700 mb-2">
                    Street Address
                  </label>
                  <input
                    id="street"
                    type="text"
                    className="input"
                    placeholder="123 Main St"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-dark-700 mb-2">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      className="input"
                      placeholder="Dallas"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-dark-700 mb-2">
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      className="input"
                      placeholder="TX"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-dark-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      id="zip"
                      type="text"
                      className="input"
                      placeholder="75001"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-5 md:pt-6 border-t border-dark-100">
                <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary w-full sm:w-auto"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Security Section */}
      <div className="card p-5 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-dark-900 mb-5 md:mb-6">Security</h2>
        <div className="space-y-3 md:space-y-4">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center justify-between w-full p-3 md:p-4 rounded-xl border border-dark-100 hover:border-primary-500 hover:bg-primary-50 transition-colors text-left group"
          >
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-dark-100 group-hover:bg-primary-100 rounded-xl flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-dark-600 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm md:text-base font-semibold text-dark-900">Change Password</h3>
                <p className="text-xs md:text-sm text-dark-600">Update your password regularly</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-dark-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
