import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Lock, 
  Edit3, 
  Save, 
  X, 
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Calendar,
  Clock,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  getAdminProfile, 
  updateAdminProfile, 
  changeAdminPassword, 
  deleteAdminProfile 
} from '@/services/adminAPI';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    instituteName: '',
    address: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await getAdminProfile();
      setAdmin(response.data);
      setProfileData({
        name: response.data.name || '',
        email: response.data.email || '',
        mobile: response.data.mobile || '',
        instituteName: response.data.instituteName || '',
        address: response.data.address || ''
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!profileData.name || !profileData.email || !profileData.mobile) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(profileData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!/^\d{10}$/.test(profileData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await updateAdminProfile(profileData);
      setAdmin(response.data);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    try {
      await changeAdminPassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password updated successfully');
      setIsEditingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    try {
      await deleteAdminProfile();
      toast.success('Account deleted successfully');
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  const handleProfileInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const cancelProfileEdit = () => {
    setIsEditingProfile(false);
    setProfileData({
      name: admin?.name || '',
      email: admin?.email || '',
      mobile: admin?.mobile || '',
      instituteName: admin?.instituteName || '',
      address: admin?.address || ''
    });
  };

  const cancelPasswordEdit = () => {
    setIsEditingPassword(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-lg text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600">Unable to load admin profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-600" />
            Admin Profile
          </h1>
          <p className="mt-2 text-gray-600">Manage your administrative profile and settings</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-gray-900">{admin.name}</h2>
                <p className="text-gray-600">{admin.instituteName}</p>
                <p className="text-sm text-gray-500 mt-1">System Administrator</p>
                <div className="mt-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Administrator
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </h2>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {!isEditingProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Full Name</p>
                          <p className="text-gray-900 font-medium">{admin.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Mail className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Email</p>
                          <p className="text-gray-900 font-medium">{admin.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Phone className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Mobile</p>
                          <p className="text-gray-900 font-medium">{admin.mobile}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <Building className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Institute</p>
                          <p className="text-gray-900 font-medium">{admin.instituteName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="bg-pink-100 p-2 rounded-lg">
                          <MapPin className="h-5 w-5 text-pink-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Address</p>
                          <p className="text-gray-900 font-medium">{admin.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={profileData.mobile}
                          onChange={handleProfileInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Institute Name
                        </label>
                        <input
                          type="text"
                          name="instituteName"
                          value={profileData.instituteName}
                          onChange={handleProfileInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {profileLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Update Profile
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={cancelProfileEdit}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Password Change Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Security
                </h2>
              </div>
              
              <div className="p-6">
                {!isEditingPassword ? (
                  <div className="text-center">
                    <div className="bg-red-100 p-4 rounded-lg mb-4">
                      <Lock className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Keep your account secure by updating your password regularly.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditingPassword(true)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Change Password
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.old ? 'text' : 'password'}
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('old')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.old ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {passwordLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Update
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={cancelPasswordEdit}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Account Info
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-600">Member since</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(admin.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Clock className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-600">Last updated</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(admin.updatedAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200">
              <div className="px-6 py-4 border-b border-red-200">
                <h2 className="text-lg font-semibold text-red-900 flex items-center">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Danger Zone
                </h2>
              </div>
              
              <div className="p-6">
                {!showDeleteConfirm ? (
                  <div className="text-center">
                    <div className="bg-red-100 p-4 rounded-lg mb-4">
                      <Trash2 className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-red-600">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-2">
                        Type "DELETE" to confirm
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="DELETE"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                        }}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;