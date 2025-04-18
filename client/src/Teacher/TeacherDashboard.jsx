import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Calendar, Bell, Newspaper } from 'lucide-react';

const TeacherDashboard = () => {
  // Stats for the top cards
  const stats = [
    { 
      icon: <FileText className="h-8 w-8 text-blue-500" />, 
      title: 'Pending Assignments', 
      value: '12' 
    },
    { 
      icon: <Users className="h-8 w-8 text-green-500" />, 
      title: 'Total Students', 
      value: '120' 
    },
    { 
      icon: <Calendar className="h-8 w-8 text-purple-500" />, 
      title: 'Upcoming Classes', 
      value: '5' 
    }
  ];

  // Sample data for the detailed section cards
  const eventsData = [
    { id: 1, title: 'Parent-Teacher Meeting', date: 'April 5, 2025', description: 'Annual meeting with parents to discuss student progress and curriculum.' },
    { id: 2, title: 'Science Fair', date: 'April 12, 2025', description: 'Students will present their science projects to judges and parents.' },
    { id: 3, title: 'End of Term Exam', date: 'May 20, 2025', description: 'Final examination for the spring semester.' }
  ];

  const newsData = [
    { id: 1, title: 'New Technology Lab Opening', date: 'March 31, 2025', description: 'The school is opening a new technology lab with advanced computers and equipment.' },
    { id: 2, title: 'School Wins District Award', date: 'March 25, 2025', description: 'Our school has been recognized for excellence in education by the district board.' }
  ];

  const noticesData = [
    { id: 1, title: 'Curriculum Update', date: 'March 30, 2025', description: 'New mathematics curriculum materials are available in the faculty resource center.' },
    { id: 2, title: 'Staff Meeting', date: 'April 2, 2025', description: 'Mandatory staff meeting to discuss end-of-year procedures and planning.' },
    { id: 3, title: 'Grade Submission Deadline', date: 'April 10, 2025', description: 'All mid-term grades must be submitted by 5:00 PM.' }
  ];

  const calendarEvents = [
    { id: 1, title: 'Math Class - Grade B', time: '9:00 AM - 10:30 AM', date: 'Monday, March 31' },
    { id: 2, title: 'Science Lab - Grade A', time: '11:00 AM - 12:30 PM', date: 'Monday, March 31' },
    { id: 3, title: 'English Literature - Grade C', time: '2:00 PM - 3:30 PM', date: 'Monday, March 31' },
    { id: 4, title: 'History Class - Grade B', time: '9:00 AM - 10:30 AM', date: 'Tuesday, April 1' },
    { id: 5, title: 'Staff Meeting', time: '4:00 PM - 5:00 PM', date: 'Wednesday, April 2' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Teacher Dashboard
        </h1>
        <div className="text-sm text-gray-500">
          Welcome back, Professor Smith
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

export default TeacherDashboard;