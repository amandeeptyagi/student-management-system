import React, { useState, useEffect } from 'react';
import {
  User,
  BookOpen,
  Calendar,
  GraduationCap,
  FileText,
  Bell,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Target,
  BarChart3,
  Download,
  Eye,
  Search,
  Filter,
  Play,
  Book,
  Users,
  Timer,
  ChevronRight,
  Plus,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getStudentProfile, getFullStudentCourseDetails, getStudentTodaySchedule } from '@/services/studentAPI';


const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Assignment Due', message: 'Mathematics assignment due tomorrow', type: 'warning', time: '2 hours ago' },
    { id: 2, title: 'Grade Published', message: 'Physics exam grade is now available', type: 'success', time: '1 day ago' },
    { id: 3, title: 'New Announcement', message: 'Holiday notice from administration', type: 'info', time: '3 days ago' }
  ]);

  // Sample Data
  // const studentData = {
  //   name: 'Rahul Sharma',
  //   rollNo: '21BCS001',
  //   course: 'B.Tech Computer Science',
  //   semester: '6th Semester',
  //   cgpa: '8.5',
  //   avatar: '/api/placeholder/100/100'
  // };

  // Fetch student profile
  const fetchStudentProfile = async () => {
    try {
      const response = await getStudentProfile();
      setStudentData(response.data.student);
      console.log(response);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to fetch student data');
    }
  };

  const fetchStudentCourse = async () => {
    try {
      const response = await getFullStudentCourseDetails();
      setCourseDetails(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  // fetch today's schedule
  const fetchSchedule = async () => {
    try {
      const res = await getStudentTodaySchedule();
      const lectures = res.data.lectures;

      const formatted = lectures.map((lec) => ({
        id: lec._id,
        subject: lec.subject?.name || "N/A",
        time: lec.timeSlot,
        teacher: lec.teacher?.name || "Unknown",
        type: "lecture",
      }));

      setTodaySchedule(formatted);
    } catch (err) {
      console.error("Error fetching schedule", err);
      toast.error("Failed to load today's schedule");
    }
  };

  // Fetch course details
  const handleViewFullCourse = async () => {
    if (!courseDetails) {
      fetchData();
    }
    if (viewingFullCourse) {
      setViewingFullCourse(false);
    }
    else {
      setViewingFullCourse(true);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStudentProfile(), fetchStudentCourse(), fetchSchedule()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const currentSubjects = [
    { id: 1, name: 'Data Structures', code: 'CS301', credits: 4, attendance: 85, grade: 'A', instructor: 'Dr. Sharma' },
    { id: 2, name: 'Database Management', code: 'CS302', credits: 3, attendance: 92, grade: 'A+', instructor: 'Prof. Kumar' },
    { id: 3, name: 'Operating Systems', code: 'CS303', credits: 4, attendance: 78, grade: 'B+', instructor: 'Dr. Patel' },
    { id: 4, name: 'Computer Networks', code: 'CS304', credits: 3, attendance: 88, grade: 'A', instructor: 'Prof. Singh' },
    { id: 5, name: 'Software Engineering', code: 'CS305', credits: 4, attendance: 95, grade: 'A+', instructor: 'Dr. Gupta' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Mid-term Exam', subject: 'Database Management', date: '2025-07-10', time: '10:00 AM', type: 'exam' },
    { id: 2, title: 'Assignment Submission', subject: 'Data Structures', date: '2025-07-12', time: '11:59 PM', type: 'assignment' },
    { id: 3, title: 'Project Presentation', subject: 'Software Engineering', date: '2025-07-15', time: '2:00 PM', type: 'presentation' },
    { id: 4, title: 'Lab Session', subject: 'Computer Networks', date: '2025-07-08', time: '3:00 PM', type: 'lab' }
  ];

  const recentActivities = [
    { id: 1, type: 'grade', title: 'Grade received for Quiz 1', subject: 'Computer Networks', grade: 'A', time: '2 hours ago' },
    { id: 2, type: 'attendance', title: 'Attendance marked', subject: 'Database Management', time: '1 day ago' },
    { id: 3, type: 'assignment', title: 'Assignment submitted', subject: 'Data Structures', time: '2 days ago' },
    { id: 4, type: 'announcement', title: 'New announcement posted', subject: 'Software Engineering', time: '3 days ago' }
  ];

  // const todaySchedule = [
  //   { id: 1, subject: 'Data Structures', time: '09:00 AM - 10:30 AM', room: 'Room 101', type: 'lecture' },
  //   { id: 2, subject: 'Database Management', time: '11:00 AM - 12:30 PM', room: 'Room 205', type: 'lecture' },
  //   { id: 3, subject: 'Computer Networks Lab', time: '02:00 PM - 04:00 PM', room: 'Lab 3', type: 'lab' },
  //   { id: 4, subject: 'Software Engineering', time: '04:30 PM - 06:00 PM', room: 'Room 301', type: 'lecture' }
  // ];



  const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null, subtitle = null }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg bg-${color}-100 mr-3`}>
              <Icon className={`h-5 w-5 text-${color}-600`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const SubjectCard = ({ subject }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{subject.name}</h3>
          <p className="text-sm text-gray-600">{subject.code} • {subject.credits} Credits</p>
          <p className="text-xs text-gray-500 mt-1">Instructor: {subject.teacher.name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${subject.grade === 'A+' ? 'bg-green-100 text-green-800' :
          subject.grade === 'A' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
          {subject.grade}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Attendance</span>
          <span className="text-sm font-medium">{subject.attendance}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${subject.attendance >= 85 ? 'bg-green-500' :
              subject.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            style={{ width: `${subject.attendance}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Details
          </button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${event.type === 'exam' ? 'bg-red-100' :
            event.type === 'assignment' ? 'bg-yellow-100' :
              event.type === 'presentation' ? 'bg-blue-100' :
                'bg-green-100'
            }`}>
            {event.type === 'exam' ? <AlertCircle className="h-4 w-4 text-red-600" /> :
              event.type === 'assignment' ? <FileText className="h-4 w-4 text-yellow-600" /> :
                event.type === 'presentation' ? <Play className="h-4 w-4 text-blue-600" /> :
                  <Book className="h-4 w-4 text-green-600" />}
          </div>
          <div>
            <p className="font-medium text-gray-900">{event.title}</p>
            <p className="text-sm text-gray-600">{event.subject}</p>
            <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View
        </button>
      </div>
    </div>
  );

  const ScheduleCard = ({ schedule }) => (
    <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className={`p-2 rounded-lg mr-4 ${schedule.type === 'lecture' ? 'bg-blue-100' : 'bg-green-100'
        }`}>
        {schedule.type === 'lecture' ?
          <BookOpen className="h-5 w-5 text-blue-600" /> :
          <Users className="h-5 w-5 text-green-600" />
        }
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{schedule.subject}</p>
        <p className="text-sm text-gray-600">{schedule.time}</p>
        <p className="text-xs text-gray-500">{schedule.teacher}</p>
      </div>
      <Timer className="h-5 w-5 text-gray-400" />
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-lg text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {studentData.name}! 👋</h1>
            <p className="text-gray-600 mt-1">{studentData.course.name} • Semester {studentData.semester}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-gray-500 hover:text-gray-900 relative bg-white rounded-full shadow-md">
                <Bell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center space-x-3 bg-white rounded-full p-0 shadow-md">
              {/* <img
                src={'/api/placeholder/100/100'}
                alt={studentData.name}
                className="h-20 w-20 rounded-full"
              /> */}
              {/* <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{studentData.rollNo}</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Current CGPA"
          // value={studentData.cgpa}
          value={7.5}
          icon={Star}
          color="green"
          trend="+0.2 from last sem"
          subtitle="Excellent Performance"
        />
        <StatCard
          title="Enrolled Subjects"
          value={courseDetails.currentSubjects.length}
          icon={BookOpen}
          color="blue"
          subtitle="This Semester"
        />
        <StatCard
          title="Average Attendance"
          value="87%"
          icon={Clock}
          color="yellow"
          subtitle="Good Standing"
        />
        <StatCard
          title="Pending Tasks"
          value="4"
          icon={Target}
          color="red"
          subtitle="Due Soon"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => toast.success('Opening assignments...')}
                className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <FileText className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Assignments</span>
              </button>
              <button
                onClick={() => toast.success('Opening grades...')}
                className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
              >
                <Award className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Grades</span>
              </button>
              <button
                onClick={() => toast.success('Opening attendance...')}
                className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group"
              >
                <Clock className="h-8 w-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Attendance</span>
              </button>
              <button
                onClick={() => toast.success('Downloading reports...')}
                className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
              >
                <Download className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Reports</span>
              </button>
            </div>
          </div>

          {/* Current Subjects */}
          {/* <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Current Subjects</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseDetails.currentSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </div> */}

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full mr-3 ${activity.type === 'grade' ? 'bg-green-100' :
                    activity.type === 'attendance' ? 'bg-blue-100' :
                      activity.type === 'assignment' ? 'bg-yellow-100' :
                        'bg-purple-100'
                    }`}>
                    {activity.type === 'grade' ? <Award className="h-4 w-4 text-green-600" /> :
                      activity.type === 'attendance' ? <CheckCircle className="h-4 w-4 text-blue-600" /> :
                        activity.type === 'assignment' ? <FileText className="h-4 w-4 text-yellow-600" /> :
                          <Bell className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.subject}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  {activity.grade && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {activity.grade}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {todaySchedule.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} />
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Semester Progress</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Course Completion</span>
                <span className="text-sm font-medium">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;