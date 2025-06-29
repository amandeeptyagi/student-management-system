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
  KeyRound, 
  Lock 
} from 'lucide-react';

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/profile', { withCredentials: true })
      .then(response => {
        setProfileData({ name: response.data.name, email: response.data.email });
      })
      .catch(error => console.error('Error fetching profile:', error));
  }, []);

  const handleEdit = () => {
    if (isEditing) {
      axios.put('http://localhost:5000/api/admin/profile/update', profileData, { withCredentials:true })
        .then(response => {
          setProfileData(response.data);
          alert('Profile updated successfully!');
        })
        .catch(error => alert('Error updating profile:', error));
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    axios.put('http://localhost:5000/api/admin/profile/change-password', {
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    }, { withCredentials:true })
      .then(() => {
        alert('Password changed successfully!');
        setIsChangingPassword(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      })
      .catch(error => alert('Error changing password:', error));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
        <div className="flex space-x-4">
          <Button onClick={handleEdit} className={isEditing ? 'bg-green-600' : 'bg-blue-600'}>
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </Button>
          <Button onClick={() => setIsChangingPassword(true)} className="bg-purple-600">
            Change Password
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-3 h-6 w-6" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['name', 'email'].map((field) => (
              <div key={field} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field} className="text-right">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                {isEditing ? (
                  <Input
                    id={field}
                    name={field}
                    value={profileData[field]}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                ) : (
                  <div className="col-span-3 text-gray-700">{profileData[field]}</div>
                )}
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
              {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
                <div key={field} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field} className="text-right">{field.replace(/([A-Z])/g, ' $1').trim()}</Label>
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
              <div className="flex justify-end">
                <Button onClick={handleChangePassword} className="bg-green-600">
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentProfile;