import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TeacherTimeTable = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teachers/timetable', {
          withCredentials: true, // ✅ Ensures cookies are sent to the backend
        });
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    };
    fetchTimeTable();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Teacher Time Table
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Time Slot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.day || 'Not Specified'}</TableCell>
                <TableCell>{item.course.name}</TableCell>
                <TableCell>{item.subject.name}</TableCell>
                <TableCell>{item.timeSlot}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TeacherTimeTable;
