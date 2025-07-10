import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Users, GraduationCap, RefreshCw, Loader2 } from 'lucide-react';
import { getTeacherTimetable } from '@/services/teacherAPI';
import { toast } from 'react-hot-toast';

const TeacherTimetable = () => {
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
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await getTeacherTimetable();
      setLectures(response.data.lectures);
    } catch (error) {
      toast.error('Failed to fetch timetable');
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getTeacherTimetable();
      setLectures(response.data.lectures);
      toast.success('Timetable refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh timetable');
    } finally {
      setRefreshing(false);
    }
  };

  const getLecturesForDay = (day) => {
    return lectures.filter(lecture => 
      lecture.day.toLowerCase() === day.toLowerCase()
    ).sort((a, b) => {
      // Sort by time slot
      const timeA = a.timeSlot.split(' - ')[0];
      const timeB = b.timeSlot.split(' - ')[0];
      return timeA.localeCompare(timeB);
    });
  };

  const getTimeSlotColor = (timeSlot) => {
    const hour = parseInt(timeSlot.split(':')[0]);
    if (hour < 10) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (hour < 12) return 'bg-green-100 text-green-800 border-green-200';
    if (hour < 14) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (hour < 16) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-pink-100 text-pink-800 border-pink-200';
  };

  const getTotalLectures = () => {
    return lectures.length;
  };

  const getUniqueCourses = () => {
    const uniqueCourses = new Set(lectures.map(lecture => lecture.course?.name));
    return uniqueCourses.size;
  };

  const getUniqueSubjects = () => {
    const uniqueSubjects = new Set(lectures.map(lecture => lecture.subject?.name));
    return uniqueSubjects.size;
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-lg text-gray-600">Loading time table...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-8 w-8 mr-3 text-blue-600" />
                My Timetable
              </h1>
              <p className="mt-2 text-gray-600">View your weekly lecture schedule</p>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lectures</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalLectures()}</p>
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
                <p className="text-2xl font-bold text-gray-900">{getUniqueCourses()}</p>
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
                <p className="text-2xl font-bold text-gray-900">{getUniqueSubjects()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timetable */}
        {lectures.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lectures scheduled</h3>
            <p className="text-gray-600">Your timetable is empty. Contact admin to schedule lectures.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Weekly Schedule</h2>
            </div>
            
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {daysOfWeek.map((day) => {
                  const dayLectures = getLecturesForDay(day);
                  
                  return (
                    <div key={day} className="border-b border-gray-200 last:border-b-0">
                      <div className="px-6 py-4 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-gray-600" />
                          {dayNames[day]}
                          <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                            {dayLectures.length} {dayLectures.length === 1 ? 'lecture' : 'lectures'}
                          </span>
                        </h3>
                      </div>
                      
                      <div className="px-6 py-4">
                        {dayLectures.length === 0 ? (
                          <p className="text-gray-500 italic">No lectures scheduled</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dayLectures.map((lecture) => (
                              <div
                                key={lecture._id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTimeSlotColor(lecture.timeSlot)}`}>
                                    {lecture.timeSlot}
                                  </span>
                                  <span className="text-m font-bold text-gray-700">
                                    Sem: {lecture.semester} Year: {(lecture.semester+1)/2}
                                  </span>
                                </div>
                                
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Course</p>
                                    <p className="text-gray-900">{lecture.course?.name || 'N/A'}</p>
                                  </div>
                                  
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Subject</p>
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
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherTimetable;