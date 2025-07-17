import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Building, Lock, Edit3, Save, X, Calendar, Clock, Loader2 } from 'lucide-react';
import { getTeacherProfile, updateTeacherPassword } from '@/services/teacherAPI';
import { toast } from 'react-hot-toast';

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      const response = await getTeacherProfile();
      setTeacher(response.data.teacher);
    } catch (error) {
      toast.error('Failed to fetch profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
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
      await updateTeacherPassword({
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

  const handlePasswordInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
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

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600">Unable to load teacher profile</p>
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
            <User className="h-8 w-8 mr-3 text-blue-600" />
            Teacher Profile
          </h1>
          <p className="mt-2 text-gray-600">Manage your profile information and settings</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-gray-900">{teacher.name}</h2>
                <p className="text-gray-600">{teacher.department}</p>
                <p className="text-sm text-gray-500 mt-1">{teacher.specialization}</p>
                <div className="mt-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {teacher.role}
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
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Full Name</p>
                        <p className="text-gray-900 font-medium">{teacher.name}</p>
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
                        <p className="text-gray-900 font-medium">{teacher.email}</p>
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
                        <p className="text-gray-900 font-medium">{teacher.mobile}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Building className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Department</p>
                        <p className="text-gray-900 font-medium">{teacher.department}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Specialization</p>
                        <p className="text-gray-900 font-medium">{teacher.specialization}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Role</p>
                        <p className="text-gray-900 font-medium">{teacher.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <p className="text-gray-900 font-medium">{teacher.address}</p>
                    </div>
                  </div>
                </div>
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
                      <input
                        type="password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        minLength={6}
                      />
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
                            {new Date(teacher.createdAt).toLocaleDateString('en-GB')}
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
                            {new Date(teacher.updatedAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{teacher.role}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="text-lg font-semibold text-gray-900">{teacher.department}</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;