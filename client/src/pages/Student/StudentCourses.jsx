import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Timer,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getFullStudentCourseDetails } from '@/services/studentAPI';

const StudentCourses = () => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingFullCourse, setViewingFullCourse] = useState(false);

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-lg text-gray-600">Loading courses...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {courseDetails && (
        <>
          {/* Main Course Information */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Course Details</h3>
              <button
                onClick={handleViewFullCourse}
                className={`flex items-center px-4 py-2 ${viewingFullCourse ? 'bg-red-500' : 'bg-blue-500'} text-white rounded-lg ${viewingFullCourse ? 'hover:bg-red-700' : 'hover:bg-blue-700'} transition-colors`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {viewingFullCourse ? "Close Course Details" : "View Full Course Details"}
              </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-500">Course Name</p>
                  <p className="font-medium">{courseDetails.courseName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{courseDetails.duration} Years</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Current Semester</p>
                  <p className="font-medium">Semester {courseDetails.currentSemesterNumber}</p>
                </div>
              </div>
            </div>

            {/* Current Semester Subjects */}
            {courseDetails.currentSubjects?.length > 0 && (
              <div className="mt-10">
                <div className='flex'>
                  <Timer className="text-green-500" />
                  <h4 className="text-md font-medium text-gray-900 mb-3 ml-2">Current Semester Subjects</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {courseDetails.currentSubjects.map((subject, index) => (
                    <div key={subject._id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                      <p className="font-medium text-gray-900">{subject.name}</p>
                      <p className="text-sm text-gray-500">Code: {subject.code}</p>
                      {subject.teacher && <p className="text-sm text-gray-600">Instructor: {subject.teacher.name}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* All Semesters */}
          {viewingFullCourse && (
            <div className="mt-10 bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-5">All Semesters Subjects</h4>
              {courseDetails.allSemesters.map((semester, index) => (
                <div key={index} className="mb-6">
                  <h5 className="text-lg font-semibold text-blue-600 mb-3 border-b border-blue-200 pb-2">
                    Semester {semester.number}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {semester.subjectIds.map((subject, i) => (
                      <div key={subject._id || i} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                        <p className="font-medium text-gray-900">{subject.name}</p>
                        <p className="text-sm text-gray-600">Code: {subject.code}</p>
                        {subject.credits && <p className="text-sm text-gray-500">Credits: {subject.credits}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentCourses;
