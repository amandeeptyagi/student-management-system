import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Lock, Eye, EyeOff, GraduationCap, Hash, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getStudentProfile, updateStudentPassword, getFullStudentCourseDetails } from '@/services/studentAPI';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch student profile
  const fetchStudentProfile = async () => {
    try {
      const response = await getStudentProfile();
      setStudent(response.data.student);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    }
  };

  // Fetch course details
  const fetchCourseDetails = async () => {
    try {
      const response = await getFullStudentCourseDetails();
      setCourseDetails(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to fetch course details');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStudentProfile(), fetchCourseDetails()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Handle password change
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

    try {
      await updateStudentPassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Password changed successfully');
      setChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    }
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-lg text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student?.name}</h1>
              <p className="text-gray-600">Roll No: {student?.rollNo}</p>
              <p className="text-sm text-gray-500">
                Joined: {student?.createdAt ? new Date(student.createdAt).toLocaleDateString('en-GB') : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setChangingPassword(!changingPassword)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{student?.name || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Hash className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Roll Number</p>
              <p className="font-medium">{student?.rollNo || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{student?.email || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Mobile</p>
              <p className="font-medium">{student?.mobile || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 md:col-span-2">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{student?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Branch</p>
              <p className="font-medium">{student?.branch || 'Not provided'}</p>
            </div>
          </div>
          {/* Course Details */}
          {courseDetails && (
            <>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-500">Course Name</p>
                  <p className="font-medium">{courseDetails.courseName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{courseDetails.duration} Years</p>
                </div>
              </div>
            </>)
          }
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Current Year</p>
              <p className="font-medium">Year {student?.year || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Current Semester</p>
              <p className="font-medium">Semester {student?.semester || 'N/A'}</p>
            </div>
          </div>
        </div>


      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium capitalize">{student?.role || 'Student'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">
                {student?.updatedAt
                  ? new Date(student.updatedAt).toLocaleDateString('en-GB')
                  : 'Not available'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog open={changingPassword} onOpenChange={setChangingPassword}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <Card className="shadow-none border-none">
            <CardContent className="space-y-4 px-0">
              <form onSubmit={handlePasswordChange} className="space-y-4">

                {/* Old Password */}
                <div className="space-y-1">
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      name="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={handlePasswordInputChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    required
                    minLength={6}
                  />
                </div>

                {/* Actions */}
                <div className="flex-col gap-2 pt-2">
                  <Button type="submit" className="w-full">
                    Change Password
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full bg-gray-200 mt-2"
                    onClick={() => {
                      setChangingPassword(false);
                      setPasswordData({
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default StudentProfile;