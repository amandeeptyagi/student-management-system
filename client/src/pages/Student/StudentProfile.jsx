import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, KeyRound, BookOpen, Lock } from 'lucide-react';
import axios from 'axios';

const StudentProfile = () => {
  // const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    rollNo: '',
    course: ''
  });

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
        if (!user) {
          alert("User not found. Please login again.");
          return;
        }
        
        const response = await axios.get(`http://localhost:5000/api/students/profile`, {
          withCredentials: true, // ✅ Yeh ensure karega ki cookies backend tak pahunch sakein
        });
        setProfileData({
          ...response.data,
          courseName: response.data.course?.name || "N/A" // 👈 Ensure `course.name` is used
        });
      } catch (error) {
        console.error("Failed to fetch student profile:", error);
        alert("Error fetching profile data.");
      }
    };

    fetchStudentProfile();

  }, []);

  // const handleEdit = () => {
  //   setIsEditing(!isEditing);
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setProfileData((prev) => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
  
    try {
      const response = await axios.put(
        "http://localhost:5000/api/students/change-password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { withCredentials: true }
      );
  
      alert(response.data.message || "Password changed successfully!");
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.response?.data?.message || "Failed to change password.");
    }
  };
  

  const profileFields = [
    { icon: <User className="mr-2 h-5 w-5 text-blue-500" />, label: 'Name', name: 'name' },
    { icon: <Mail className="mr-2 h-5 w-5 text-green-500" />, label: 'Email', name: 'email' },
    { icon: <KeyRound className="mr-2 h-5 w-5 text-purple-500" />, label: 'Roll Number', name: 'rollNo' },
    { icon: <BookOpen className="mr-2 h-5 w-5 text-orange-500" />, label: 'Course', name: 'courseName' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Student Profile</h1>
        <div className="flex space-x-4">
          {/* <Button 
            onClick={handleEdit}
            className={isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
          >
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </Button> */}
          <Button 
            onClick={() => setIsChangingPassword(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-3 h-6 w-6" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profileFields.map((field) => (
              <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                <div className="flex items-center col-span-1">
                  {field.icon}
                  <Label htmlFor={field.name} className="text-right">
                    {field.label}
                  </Label>
                </div>
                {/* {0 ? (
                  <Input
                    id={field.name}
                    name={field.name}
                    value={profileData[field.name]}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                ) : ( */}
                  <div className="col-span-3 text-gray-700">
                    {profileData[field.name]}
                  </div>
                {/* )} */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      {isChangingPassword && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-3 h-6 w-6" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="oldPassword" className="text-right col-span-1">
                  Old Password
                </Label>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right col-span-1">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right col-span-1">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="col-span-3"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleChangePassword}
                  className="bg-green-600 hover:bg-green-700"
                >
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
