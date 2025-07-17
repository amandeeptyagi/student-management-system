import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  GraduationCap, 
  User,
  TrendingUp,
  Bell,
  ChevronRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { getTeacherProfile, getTeacherTimetable } from '@/services/teacherAPI';
import { toast } from 'react-hot-toast';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday'
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileResponse, timetableResponse] = await Promise.all([
        getTeacherProfile(),
        getTeacherTimetable()
      ]);
      
      setTeacher(profileResponse.data.teacher);
      setLectures(timetableResponse.data.lectures);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDashboardData();
      toast.success('Dashboard refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  const getCurrentDay = () => {
    const today = new Date();
    const dayIndex = today.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex];
  };

  const getTodayLectures = () => {
    const today = getCurrentDay();
    return lectures.filter(lecture => 
      lecture.day.toLowerCase() === today.toLowerCase()
    ).sort((a, b) => {
      const timeA = a.timeSlot.split(' - ')[0];
      const timeB = b.timeSlot.split(' - ')[0];
      return timeA.localeCompare(timeB);
    });
  };

  const getUpcomingLectures = () => {
  const today = getCurrentDay(); // e.g., 'monday'
  const now = new Date();

  // Filter today's lectures
  const todayLectures = lectures.filter(
    (lecture) => lecture.day.toLowerCase() === today.toLowerCase()
  );

  // Helper to convert timeSlot string to start time in 24hr Date
  const parseTimeSlotStart = (timeSlot) => {
    const [start] = timeSlot.split(" - ");
    const [time, meridian] = start.split(" ");
    let [hour, minute] = time.split(":").map(Number);

    if (meridian.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (meridian.toLowerCase() === "am" && hour === 12) hour = 0;

    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  // Filter lectures whose start time is after current time
  const upcomingLectures = todayLectures.filter((lecture) => {
    const startTime = parseTimeSlotStart(lecture.timeSlot);
    return startTime > now;
  });

  // Sort them by start time
  upcomingLectures.sort((a, b) => {
    const aTime = parseTimeSlotStart(a.timeSlot);
    const bTime = parseTimeSlotStart(b.timeSlot);
    return aTime - bTime;
  });

  return upcomingLectures;
};


  const getWeeklyStats = () => {
    const totalLectures = lectures.length;
    const uniqueCourses = new Set(lectures.map(lecture => lecture.course?.name)).size;
    const uniqueSubjects = new Set(lectures.map(lecture => lecture.subject?.name)).size;
    
    // Calculate lectures per day
    const lecturesPerDay = {};
    daysOfWeek.forEach(day => {
      lecturesPerDay[day] = lectures.filter(lecture => 
        lecture.day.toLowerCase() === day.toLowerCase()
      ).length;
    });
    
    const avgLecturesPerDay = totalLectures / daysOfWeek.length;
    
    return {
      totalLectures,
      uniqueCourses,
      uniqueSubjects,
      lecturesPerDay,
      avgLecturesPerDay: Math.round(avgLecturesPerDay * 10) / 10
    };
  };

  const getTimeSlotColor = (timeSlot) => {
    const hour = parseInt(timeSlot.split(':')[0]);
    if (hour < 10) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (hour < 12) return 'bg-green-100 text-green-800 border-green-200';
    if (hour < 14) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (hour < 16) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-pink-100 text-pink-800 border-pink-200';
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-lg text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  const todayLectures = getTodayLectures();
  const upcomingLectures = getUpcomingLectures();
  const weeklyStats = getWeeklyStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {teacher?.name || 'Teacher'}!
              </h1>
              <p className="mt-2 text-gray-600">
                {new Date().toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lectures</p>
                <p className="text-2xl font-bold text-gray-900">{weeklyStats.totalLectures}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-gray-900">{weeklyStats.uniqueCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-900">{weeklyStats.uniqueSubjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg/Day</p>
                <p className="text-2xl font-bold text-gray-900">{weeklyStats.avgLecturesPerDay}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Today's Schedule
                  <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {todayLectures.length} {todayLectures.length === 1 ? 'lecture' : 'lectures'}
                  </span>
                </h2>
              </div>
              
              <div className="p-6">
                {todayLectures.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No lectures today</h3>
                    <p className="text-gray-600">Enjoy your free day!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayLectures.map((lecture) => (
                      <div
                        key={lecture._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTimeSlotColor(lecture.timeSlot)}`}>
                            <Clock className="h-4 w-4 inline mr-1" />
                            {lecture.timeSlot}
                          </span>
                          <span className="text-m font-bold text-gray-700">
                            Semester: {lecture.semester} Year: {(lecture.semester+1)/2}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-bold text-gray-600">Course</p>
                            <p className="text-gray-900">{lecture.course?.name || 'N/A'}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-bold text-gray-600">Subject</p>
                            <p className="text-gray-900">
                              {lecture.subject?.name || 'N/A'}
                              {lecture.subject?.code && (
                                <span className="ml-2 text-sm text-gray-500">
                                  ({lecture.subject.code})
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </h2>
              </div>
              
              <div className="p-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{teacher?.name}</h3>
                  <p className="text-sm text-gray-600">{teacher?.department}</p>
                  <p className="text-sm text-gray-600 mt-1">{teacher?.specialization}</p>
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="text-sm text-gray-900">{teacher?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mobile</span>
                    <span className="text-sm text-gray-900">{teacher?.mobile}</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Upcoming Lectures */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Upcoming Lectures
                </h2>
              </div>
              
              <div className="p-6">
                {upcomingLectures.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming lectures</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingLectures.map((lecture) => (
                      <div key={lecture._id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {lecture.subject?.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {lecture.timeSlot}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Weekly Overview</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{day}</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(weeklyStats.lecturesPerDay[day] / Math.max(...Object.values(weeklyStats.lecturesPerDay))) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-6 text-right">
                          {weeklyStats.lecturesPerDay[day]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;