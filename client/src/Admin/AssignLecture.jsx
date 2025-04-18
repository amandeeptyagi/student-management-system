import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const AssignLecture = () => {
  // State for fetched data
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    teacher: '',
    course: '',
    subject: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00'
  });
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, coursesRes, subjectsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admins/teachers',{ withCredentials: true }),
          axios.get('http://localhost:5000/api/courses',{ withCredentials: true }),
          axios.get('http://localhost:5000/api/courses',{ withCredentials: true }),
        ]);
        setTeachers(teachersRes.data);
        setCourses(coursesRes.data);
        // Extracting subjects from coursesRes
      // const subjects = coursesRes.data.flatMap(course => course.subjects); 
        setSubjects(subjectsRes.data.flatMap(course => course.subjects));
        console.log(subjectsRes.data.flatMap(course => course.subjects));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  // Handle opening dialog
  const handleAddAssignment = () => {
    setNewAssignment({
      teacher: '',
      course: '',
      subject: '',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00'
    });
    setOpenDialog(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  // Handle select change
  const handleSelectChange = (name, value) => {
    if (name === 'course') {
      setNewAssignment({ 
        ...newAssignment, 
        course: value,
        subject: '' // Reset subject when course changes
      });
      setFilteredSubjects(subjects.filter(subject => subject.course === value));
    } else {
      setNewAssignment({ ...newAssignment, [name]: value });
    }
  };

  // Handle save assignment (POST to backend)
  const handleSaveAssignment = async () => {
    try {
      const formattedData = {
        teacherId: newAssignment.teacher,
        courseId: newAssignment.course,
        subjectId: newAssignment.subject,
        timeSlot: `${newAssignment.startTime} - ${newAssignment.endTime}`,
        day: newAssignment.day,
      };

      console.log(formattedData);
      await axios.post('http://localhost:5000/api/lectures/assign', formattedData, {
        withCredentials: true
      });
      console.log('Lecture assigned successfully:', formattedData);
      alert("Lecture assigned successfully")
      setOpenDialog(false);
    } catch (error) {
      console.error('Error assigning lecture:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Calendar className="mr-2 h-6 w-6" />
          Lecture Assignment
        </h1>
        <Button onClick={handleAddAssignment}>
          <Plus className="mr-2 h-4 w-4" />
          Assign New Lecture
        </Button>
      </div>

      {/* Add Assignment Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[525px]" aria-describedby="assign-lecture-description">
          <DialogHeader>
            <DialogTitle>Assign New Lecture</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Teacher Selection */}
            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select value={newAssignment.teacher} onValueChange={(value) => handleSelectChange('teacher', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course Selection */}
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={newAssignment.course} onValueChange={(value) => handleSelectChange('course', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject Selection */}
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select 
                value={newAssignment.subject} 
                onValueChange={(value) => handleSelectChange('subject', value)} 
                disabled={!newAssignment.course}
              >
                <SelectTrigger>
                  <SelectValue placeholder={newAssignment.course ? "Select a subject" : "Select a course first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map(subject => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Day and Time Slots */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={newAssignment.day} onValueChange={(value) => handleSelectChange('day', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input name="startTime" type="time" value={newAssignment.startTime} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input name="endTime" type="time" value={newAssignment.endTime} onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveAssignment}>Assign Lecture</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignLecture;
