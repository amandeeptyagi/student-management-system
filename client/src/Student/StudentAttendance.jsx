import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([
    { 
      course: 'Programming Fundamentals', 
      totalClasses: 30, 
      attendedClasses: 25 
    },
    { 
      course: 'Mathematics', 
      totalClasses: 28, 
      attendedClasses: 22 
    },
    { 
      course: 'Physics', 
      totalClasses: 32, 
      attendedClasses: 28 
    }
  ]);

  const calculateAttendancePercentage = (attended, total) => {
    return Math.round((attended / total) * 100);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Attendance Record
      </h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Attended Classes</TableHead>
            <TableHead>Total Classes</TableHead>
            <TableHead>Attendance Percentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.course}</TableCell>
              <TableCell>{record.attendedClasses}</TableCell>
              <TableCell>{record.totalClasses}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Progress 
                    value={calculateAttendancePercentage(record.attendedClasses, record.totalClasses)} 
                    className="w-full"
                  />
                  <span>
                    {calculateAttendancePercentage(record.attendedClasses, record.totalClasses)}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentAttendance;