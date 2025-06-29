import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StudentResults = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  const subjects = [
    { 
      id: 1,
      name: 'Programming Fundamentals',
      tests: [
        { name: 'Quiz 1', obtainedMarks: 18, totalMarks: 20, date: '15 Jan 2025' },
        { name: 'Assignment 1', obtainedMarks: 24, totalMarks: 25, date: '29 Jan 2025' },
        { name: 'Mid-term', obtainedMarks: 38, totalMarks: 50, date: '15 Feb 2025' },
        { name: 'Assignment 2', obtainedMarks: 28, totalMarks: 30, date: '1 Mar 2025' },
        { name: 'Final Exam', obtainedMarks: 95, totalMarks: 100, date: '15 Mar 2025' }
      ]
    },
    { 
      id: 2,
      name: 'Mathematics',
      tests: [
        { name: 'Quiz 1', obtainedMarks: 17, totalMarks: 20, date: '17 Jan 2025' },
        { name: 'Quiz 2', obtainedMarks: 16, totalMarks: 20, date: '31 Jan 2025' },
        { name: 'Mid-term', obtainedMarks: 42, totalMarks: 50, date: '18 Feb 2025' },
        { name: 'Assignment', obtainedMarks: 23, totalMarks: 30, date: '5 Mar 2025' },
        { name: 'Final Exam', obtainedMarks: 85, totalMarks: 100, date: '17 Mar 2025' }
      ]
    },
    { 
      id: 3,
      name: 'Physics',
      tests: [
        { name: 'Lab 1', obtainedMarks: 18, totalMarks: 20, date: '16 Jan 2025' },
        { name: 'Quiz 1', obtainedMarks: 9, totalMarks: 10, date: '30 Jan 2025' },
        { name: 'Mid-term', obtainedMarks: 43, totalMarks: 50, date: '16 Feb 2025' },
        { name: 'Lab 2', obtainedMarks: 27, totalMarks: 30, date: '3 Mar 2025' },
        { name: 'Final Exam', obtainedMarks: 90, totalMarks: 100, date: '16 Mar 2025' }
      ]
    }
  ];

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleBack = () => {
    setSelectedSubject(null);
  };

  // Calculate subject total
  const calculateTotal = (tests) => {
    const obtainedTotal = tests.reduce((sum, item) => sum + item.obtainedMarks, 0);
    const marksTotal = tests.reduce((sum, item) => sum + item.totalMarks, 0);
    return { obtainedTotal, marksTotal };
  };

  // Render subject detail view with test results
  const renderSubjectDetail = () => {
    const { obtainedTotal, marksTotal } = calculateTotal(selectedSubject.tests);
    const percentage = ((obtainedTotal / marksTotal) * 100).toFixed(1);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack}>Back to Subjects</Button>
          <div className="text-lg font-semibold">
            Overall: {obtainedTotal}/{marksTotal} ({percentage}%)
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedSubject.name} - Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Obtained Marks</TableHead>
                  <TableHead className="text-right">Total Marks</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSubject.tests.map((test, index) => {
                  const testPercentage = ((test.obtainedMarks / test.totalMarks) * 100).toFixed(1);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{test.date}</TableCell>
                      <TableCell className="text-right">{test.obtainedMarks}</TableCell>
                      <TableCell className="text-right">{test.totalMarks}</TableCell>
                      <TableCell className="text-right">{testPercentage}%</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="font-bold">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">{obtainedTotal}</TableCell>
                  <TableCell className="text-right">{marksTotal}</TableCell>
                  <TableCell className="text-right">{percentage}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render main subject cards view
  const renderSubjectsGrid = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Subject Results
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((subject) => {
            const { obtainedTotal, marksTotal } = calculateTotal(subject.tests);
            const testCount = subject.tests.length;
            
            return (
              <Card 
                key={subject.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSubjectClick(subject)}
              >
                <CardHeader>
                  <CardTitle>{subject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-gray-500">Total Tests: {testCount}</p>
                    <p className="text-lg font-semibold">
                      Score: {obtainedTotal}/{marksTotal}
                    </p>
                    <p className="text-sm text-gray-600">
                      Click to view all test results
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {selectedSubject ? renderSubjectDetail() : renderSubjectsGrid()}
    </div>
  );
};

export default StudentResults;