import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, UserCircle2 } from 'lucide-react';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admins/teachers', { withCredentials: true });
      setTeachers(res.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleAddOrEditTeacher = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/admins/teacher/${currentTeacher._id}`, currentTeacher, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/admins/teacher/add', currentTeacher, { withCredentials: true });
      }
      alert('Successfully saved!');
      setCurrentTeacher({});
      setIsEditing(false);
      setDialogOpen(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admins/teacher/${id}`, { withCredentials: true });
      alert('Successfully deleted!');
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setCurrentTeacher({}); setIsEditing(false); setDialogOpen(true); }}>
              Add New Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {['name', 'email', 'specialization', 'password'].map((field) => (
                <div key={field} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input
                    id={field}
                    type={field === 'password' ? 'password' : 'text'}
                    value={currentTeacher[field] || ''}
                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, [field]: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddOrEditTeacher}>{isEditing ? 'Update' : 'Add'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <Card key={teacher._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <UserCircle2 className="h-10 w-10 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold">{teacher.name}</h3>
                  <p className="text-sm text-gray-500">{teacher.specialization}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {teacher.email}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => { setCurrentTeacher(teacher); setIsEditing(true); setDialogOpen(true); }}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteTeacher(teacher._id)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminTeachers;
