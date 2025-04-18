import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Bell, 
  Newspaper, 
  Calendar, 
  FileText, 
  BarChart2, 
  Settings 
} from 'lucide-react';

const AdminDashboard = () => {
  // Stats for the top cards
  const stats = [
    { 
      icon: <Users className="h-8 w-8 text-blue-500" />, 
      title: 'Total Students', 
      value: '1,234' 
    },
    { 
      icon: <GraduationCap className="h-8 w-8 text-green-500" />, 
      title: 'Total Teachers', 
      value: '87' 
    },
    { 
      icon: <BookOpen className="h-8 w-8 text-purple-500" />, 
      title: 'Total Courses', 
      value: '42' 
    }
  ];

  // Sample data for the detailed section cards
  const eventsData = [
    { id: 1, title: 'Annual School Conference', date: 'April 15, 2025', description: 'Annual conference for all staff members to discuss school improvement strategies.' },
    { id: 2, title: 'Board Meeting', date: 'April 5, 2025', description: 'Quarterly meeting with the school board to review budget and performance metrics.' },
    { id: 3, title: 'Teacher Evaluation Day', date: 'April 20, 2025', description: 'Scheduled teacher evaluations for the spring semester.' }
  ];

  const newsData = [
    { id: 1, title: 'School Budget Approved', date: 'March 28, 2025', description: 'The district has approved our proposed budget for the upcoming academic year.' },
    { id: 2, title: 'New Computer Lab Completed', date: 'March 25, 2025', description: 'The renovation of our computer lab is now complete with 30 new workstations.' },
    { id: 3, title: 'District Recognition', date: 'March 20, 2025', description: 'Our school received recognition for outstanding academic improvement.' }
  ];

  const noticesData = [
    { id: 1, title: 'End of Year Procedures', date: 'March 30, 2025', description: 'All staff members must complete end-of-year inventory by May 15.' },
    { id: 2, title: 'Budget Requests Due', date: 'April 10, 2025', description: 'Department heads should submit budget requests for the next academic year.' },
    { id: 3, title: 'Summer Maintenance Schedule', date: 'April 5, 2025', description: 'Facility maintenance schedule has been posted. Please coordinate with maintenance staff for classroom access.' }
  ];

  const calendarEvents = [
    { id: 1, title: 'Administrative Staff Meeting', time: '9:00 AM - 10:30 AM', date: 'Monday, March 31' },
    { id: 2, title: 'Budget Review', time: '1:00 PM - 3:00 PM', date: 'Tuesday, April 1' },
    { id: 3, title: 'Department Chair Meeting', time: '3:30 PM - 5:00 PM', date: 'Wednesday, April 2' },
    { id: 4, title: 'Student Council Presentation', time: '10:00 AM - 11:00 AM', date: 'Thursday, April 3' },
    { id: 5, title: 'Parent Committee Meeting', time: '6:00 PM - 7:30 PM', date: 'Thursday, April 3' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <div className="text-sm text-gray-500">
          Welcome back, Administrator
        </div>
      </div>

      {/* Stats Section */}
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

      {/* Detailed Information Cards */}
      <div className="space-y-6">
        {/* Events Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-xl font-bold">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-orange-500 mr-2" />
                Events
              </div>
            </CardTitle>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {eventsData.map(event => (
                <div key={event.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{event.title}</h3>
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* News Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-xl font-bold">
              <div className="flex items-center">
                <Newspaper className="h-6 w-6 text-blue-500 mr-2" />
                News
              </div>
            </CardTitle>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {newsData.map(item => (
                <div key={item.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notices Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-xl font-bold">
              <div className="flex items-center">
                <Bell className="h-6 w-6 text-red-500 mr-2" />
                Notices
              </div>
            </CardTitle>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {noticesData.map(notice => (
                <div key={notice.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{notice.title}</h3>
                    <span className="text-sm text-gray-500">{notice.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notice.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-xl font-bold">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-purple-500 mr-2" />
                Calendar
              </div>
            </CardTitle>
            <button className="text-sm text-blue-600 hover:underline">Full Calendar</button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {calendarEvents.map(event => (
                <div key={event.id} className="flex border-l-4 border-purple-500 pl-3 py-2 bg-gray-50">
                  <div className="w-32 flex-shrink-0">
                    <div className="text-sm font-medium">{event.date}</div>
                    <div className="text-xs text-gray-500">{event.time}</div>
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium">{event.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;