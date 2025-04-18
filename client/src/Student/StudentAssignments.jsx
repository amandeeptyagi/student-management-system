import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

const StudentAssignments = () => {
  // Sample data for assignments
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: 'Programming Fundamentals',
      assignments: [
        {
          id: 101,
          title: 'Data Structures Assignment',
          dueDate: '2024-04-15',
          status: 'Pending'
        },
        {
          id: 102,
          title: 'Algorithm Analysis',
          dueDate: '2024-04-25',
          status: 'Not Started'
        }
      ]
    },
    {
      id: 2,
      name: 'Mathematics',
      assignments: [
        {
          id: 201,
          title: 'Calculus Problem Set',
          dueDate: '2024-04-10',
          status: 'Submitted'
        },
        {
          id: 202,
          title: 'Linear Algebra Exercises',
          dueDate: '2024-04-18',
          status: 'Pending'
        }
      ]
    },
    {
      id: 3,
      name: 'Physics',
      assignments: [
        {
          id: 301,
          title: 'Quantum Mechanics Report',
          dueDate: '2024-04-20',
          status: 'Not Started'
        }
      ]
    }
  ]);

  // State to track which subject is selected
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Function to get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Submitted':
        return <Badge className="bg-green-500">Submitted</Badge>;
      case 'Pending':
        return <Badge variant="outline" className="text-amber-500">Pending</Badge>;
      case 'Not Started':
        return <Badge variant="destructive">Not Started</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Handle subject click
  const handleSubjectClick = (subjectId) => {
    if (selectedSubject === subjectId) {
      setSelectedSubject(null); // Close the card if already open
    } else {
      setSelectedSubject(subjectId); // Open the selected subject
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">My Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card 
                key={subject.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedSubject === subject.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSubjectClick(subject.id)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {subject.assignments.length} assignment{subject.assignments.length !== 1 ? 's' : ''}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Assignment details card - shown when a subject is selected */}
          {selectedSubject && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  {subjects.find(s => s.id === selectedSubject)?.name} Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects
                    .find(s => s.id === selectedSubject)
                    ?.assignments.map((assignment) => (
                      <Card key={assignment.id} className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <div className="flex items-center mt-2 space-x-2">
                              <p className="text-sm text-gray-500">
                                Due: {formatDate(assignment.dueDate)}
                              </p>
                              {getStatusBadge(assignment.status)}
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-4 md:mt-0">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center"
                            >
                              <Download size={16} className="mr-2" /> Download
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              className="flex items-center"
                            >
                              <Upload size={16} className="mr-2" /> Upload
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAssignments;