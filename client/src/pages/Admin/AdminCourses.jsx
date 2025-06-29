import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, BookOpen, Plus, Book } from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);


  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/course', { withCredentials: true });
      setCourses(res.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAddCourse = async () => {
    try {
      await axios.post('http://localhost:5000/api/course/add', { name: newCourse }, { withCredentials: true });
      setNewCourse('');
      setIsCourseDialogOpen(false); // Close the dialog after successful course addition
      fetchCourses();
      alert('Successfully added course');
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };
  

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/course/${id}`, { withCredentials: true });
      fetchCourses();
      alert('Successfully deleted course');
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div>

   {/* Main view - Course Cards */}
   {!selectedCourse && (
<>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
        <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
  <DialogTrigger asChild>
    <Button className="bg-blue-600 hover:bg-blue-700">
      <Plus className="h-4 w-4 mr-2" /> Add New Course
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Course</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Label htmlFor="courseName">Course Name</Label>
      <Input id="courseName" value={newCourse} onChange={(e) => setNewCourse(e.target.value)} />
    </div>
    <div className="flex justify-end">
      <Button onClick={handleAddCourse} className="bg-blue-600 hover:bg-blue-700">Add Course</Button>
    </div>
  </DialogContent>
</Dialog>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course._id}>
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-10 w-10 text-blue-500" />
                <h3 className="text-lg font-semibold">{course.name}</h3>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => setSelectedCourse(course)}>View Subjects</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
        </>
  )}


      {selectedCourse && <CourseSubjects course={selectedCourse} onBack={() => setSelectedCourse(null)} />}
    </div>
  );
};

const CourseSubjects = ({ course, onBack }) => {
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);


  useEffect(() => {
    fetchSubjects();
  }, [course]);

  const fetchSubjects = async () => {
    try {
      setSubjects(course.semesters || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleAddSubject = async () => {
    try {
      await axios.post('http://localhost:5000/api/course/subject/add', { courseId: course._id, subjectName: newSubjectName }, { withCredentials: true });
      setNewSubjectName('');
      setIsSubjectDialogOpen(false); // Close the dialog after adding the subject
      fetchSubjects();

      alert('Successfully added subject');
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };
  

  const handleDeleteSubject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/course/subject/${id}`, { withCredentials: true });
      fetchSubjects();
      alert('Successfully deleted subject');
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <div>
      <Button variant="outline" onClick={onBack}>← Back to Courses</Button>
      <h1 className="text-3xl font-bold text-gray-800 mt-5">Semesters in {course.name}</h1>
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
  <DialogTrigger asChild>
    <Button className="bg-blue-600 hover:bg-blue-700 mt-5 mb-5"><Plus className="h-4 w-4 mr-2" /> Add Subject</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Subject</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Label htmlFor="subjectName">Subject Name</Label>
      <Input id="subjectName" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} />
    </div>
    <div className="flex justify-end">
      <Button onClick={handleAddSubject} className="bg-blue-600 hover:bg-blue-700">Add Subject</Button>
    </div>
  </DialogContent>
</Dialog>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject._id}>
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Book className="h-10 w-10 text-blue-500" />
                <h3 className="text-lg font-semibold">{subject.number}</h3>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteSubject(subject._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;
