import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  BookOpen,
  Users,
  Lock 
} from 'lucide-react';

const TeacherProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teachers/profile', {
          withCredentials: true,
        });
        setProfileData(response.data);
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/teachers/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }, {
        withCredentials: true,
      });
      alert('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError(null);
    } catch (err) {
      setPasswordError('Failed to change password. Please check your old password.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Profile</h1>
        <Button onClick={() => setIsChangingPassword(true)} className="bg-purple-600 hover:bg-purple-700">
          Change Password
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-3 h-6 w-6" /> Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[ 
              { icon: <User className="mr-2 h-5 w-5 text-blue-500" />, label: 'Name', value: profileData.name },
              { icon: <Mail className="mr-2 h-5 w-5 text-green-500" />, label: 'Email', value: profileData.email },
              { icon: <BookOpen className="mr-2 h-5 w-5 text-orange-500" />, label: 'Specialization', value: profileData.specialization },
              { icon: <Users className="mr-2 h-5 w-5 text-purple-500" />, label: 'Role', value: profileData.role }
            ].map((field) => (
              <div key={field.label} className="grid grid-cols-4 items-center gap-4">
                <div className="flex items-center col-span-1">
                  {field.icon}
                  <Label className="text-right">{field.label}</Label>
                </div>
                <div className="col-span-3 text-gray-700">{field.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {isChangingPassword && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-3 h-6 w-6" /> Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['oldPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
                <div key={index} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field} className="text-right col-span-1">
                    {field === 'oldPassword' ? 'Old Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    type="password"
                    value={passwordData[field]}
                    onChange={handlePasswordChange}
                    className="col-span-3"
                  />
                </div>
              ))}
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              <div className="flex justify-end space-x-4">
                <Button onClick={() => setIsChangingPassword(false)} variant="outline">Cancel</Button>
                <Button onClick={handleChangePassword} className="bg-green-600 hover:bg-green-700">Change Password</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherProfile;
