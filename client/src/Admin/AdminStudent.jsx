import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Pencil, 
  Trash2, 
  UserCircle2,
  Plus
} from 'lucide-react';

const StudentManagement = () => {
  // Course data
  const courses = [
    'Bachelor of Computer Science',
    'Bachelor of Mathematics',
    'Bachelor of Physics'
  ];
  
  // Students data
  const [students, setStudents] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      department: 'Computer Science',
      userId: 'john_doe',
      password: 'securePass123',
      rollNumber: 'CS2021001',
      courseName: 'Bachelor of Computer Science',
      address: '123 Student Street, University Campus, City 12345'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      department: 'Mathematics',
      userId: 'jane_smith',
      password: 'mathStudent456',
      rollNumber: 'MATH2021002',
      courseName: 'Bachelor of Mathematics',
      address: '456 Academic Avenue, College Town, City 67890'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      department: 'Physics',
      userId: 'mike_johnson',
      password: 'physicsRocks789',
      rollNumber: 'PHY2021003',
      courseName: 'Bachelor of Physics',
      address: '789 Science Road, Research Park, City 54321'
    }
  ]);

  // State for student being edited/added
  const [currentStudent, setCurrentStudent] = useState({});

  // Handle adding a new student
  const handleAddStudent = () => {
    if (
      currentStudent.name && currentStudent.email && 
      currentStudent.department && currentStudent.userId && 
      currentStudent.password && currentStudent.rollNumber &&
      currentStudent.courseName
    ) {
      const newStudent = {
        ...currentStudent,
        id: students.length + 1
      };
      setStudents([...students, newStudent]);
      setCurrentStudent({});
    }
  };

  // Handle editing a student
  const handleEditStudent = () => {
    if (currentStudent.id) {
      setStudents(students.map(student => 
        student.id === currentStudent.id ? currentStudent : student
      ));
      setCurrentStudent({});
    }
  };

  // Handle deleting a student
  const handleDeleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Management
        </h1>

        <div className="flex space-x-4">
          {/* Add New Student Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentStudent({})}
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {currentStudent.id ? 'Edit Student' : 'Add New Student'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Student form fields */}
                {[
                  'name', 'email', 'department', 
                  'userId', 'password', 'rollNumber',
                  'address'
                ].map((field) => (
                  <div key={field} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={field} className="text-right capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <Input
                      id={field}
                      type={field === 'password' ? 'password' : 'text'}
                      value={currentStudent[field] || ''}
                      onChange={(e) => setCurrentStudent({
                        ...currentStudent, 
                        [field]: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                ))}
                {/* Course selection */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Course</Label>
                  <div className="col-span-3">
                    <Select 
                      value={currentStudent.courseName || ''} 
                      onValueChange={(value) => setCurrentStudent({
                        ...currentStudent,
                        courseName: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={currentStudent.id ? handleEditStudent : handleAddStudent}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentStudent.id ? 'Update' : 'Add'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <UserCircle2 className="h-10 w-10 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold">{student.name}</h3>
                  <p className="text-sm text-gray-500">
                    {student.courseName}
                    <span className="mx-1">•</span>
                    {student.department}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {[
                ['Email', student.email],
                ['Roll Number', student.rollNumber],
                ['User ID', student.userId],
                ['Address', student.address]
              ].map(([label, value]) => (
                <p key={label} className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">{label}:</span> {value}
                </p>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentStudent({...student})}
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Edit form fields */}
                    {[
                      'name', 'email', 'department', 
                      'userId', 'password', 'rollNumber',
                      'address'
                    ].map((field) => (
                      <div key={field} className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={field} className="text-right capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Input
                          id={field}
                          type={field === 'password' ? 'password' : 'text'}
                          value={currentStudent[field] || ''}
                          onChange={(e) => setCurrentStudent({
                            ...currentStudent,
                            [field]: e.target.value
                          })}
                          className="col-span-3"
                        />
                      </div>
                    ))}
                    {/* Course selection for editing */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Course</Label>
                      <div className="col-span-3">
                        <Select 
                          value={currentStudent.courseName || ''} 
                          onValueChange={(value) => setCurrentStudent({
                            ...currentStudent,
                            courseName: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course} value={course}>
                                {course}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleEditStudent}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Update
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDeleteStudent(student.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentManagement;