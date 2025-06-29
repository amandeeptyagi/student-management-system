import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const TeacherAttendance = () => {
  const [attendance] = useState([
    { class: 'Computer Science', present: 45, total: 50 },
    { class: 'Mathematics', present: 38, total: 42 }
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Class Attendance
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Present Students</TableHead>
            <TableHead>Total Students</TableHead>
            <TableHead>Attendance %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.class}</TableCell>
              <TableCell>{item.present}</TableCell>
              <TableCell>{item.total}</TableCell>
              <TableCell>
                {((item.present / item.total) * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeacherAttendance;