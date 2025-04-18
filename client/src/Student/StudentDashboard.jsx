import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ClipboardList, BarChart } from 'lucide-react';

const StudentDashboard = () => {
  const stats = [
    { 
      icon: <BookOpen className="h-8 w-8 text-blue-500" />, 
      title: 'Active Courses', 
      value: '4' 
    },
    { 
      icon: <ClipboardList className="h-8 w-8 text-green-500" />, 
      title: 'Pending Assignments', 
      value: '3' 
    },
    { 
      icon: <BarChart className="h-8 w-8 text-purple-500" />, 
      title: 'Current GPA', 
      value: '3.75' 
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Student Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;