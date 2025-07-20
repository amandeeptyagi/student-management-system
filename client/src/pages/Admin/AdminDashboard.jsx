import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  UserCheck,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import your API functions
import {
  getAdminProfile,
  getAllStudents,
  getAllTeachers,
} from '@/services/adminAPI';

import {
  getAllCourses
} from '@/services/courseAPI';

import {
  getLecturesByCourseAndSemester
} from '@/services/lectureAPI';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalLectures: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch admin profile
      const adminResponse = await getAdminProfile();
      setAdminData(adminResponse.data);

      // Fetch all data for stats
      const [studentsRes, teachersRes, coursesRes] = await Promise.all([
        getAllStudents(),
        getAllTeachers(),
        getAllCourses()
      ]);

      const students = studentsRes.data;
      const teachers = teachersRes.data;
      const courses = coursesRes.data;

      // Calculate total lectures (approximate)
      let totalLectures = 0;
      for (const course of courses) {
        for (const semester of course.semesters) {
          if (semester.subjectIds?.length) {
            totalLectures += semester.subjectIds.length;
          }
        }
      }

      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalCourses: courses.length,
        totalLectures
      });

      // Set recent data (last 5)
      setRecentStudents(students.slice(0, 5));
      setRecentTeachers(teachers.slice(0, 5));

    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color }) => (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 border hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {adminData?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminData?.instituteName}</p>
                <p className="text-sm text-gray-600">{adminData?.email}</p>
              </div>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Students"
            value={stats.totalStudents}
            color="#3B82F6"
          />
          <StatCard
            icon={UserCheck}
            title="Total Teachers"
            value={stats.totalTeachers}
            color="#10B981"
          />
          <StatCard
            icon={BookOpen}
            title="Total Courses"
            value={stats.totalCourses}
            color="#F59E0B"
          />
          <StatCard
            icon={Calendar}
            title="Total Subjects"
            value={stats.totalLectures}
            color="#8B5CF6"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              icon={Plus}
              title="Add Student"
              description="Register new student"
              onClick={() => { toast.success('Navigate to Add Student'); navigate('/admin/students'); }}
              color="#3B82F6"
            />
            <QuickActionCard
              icon={Plus}
              title="Add Teacher"
              description="Register new teacher"
              onClick={() => { toast.success('Navigate to Add Teacher'); navigate('/admin/teachers') }}
              color="#10B981"
            />
            <QuickActionCard
              icon={Plus}
              title="Create Course"
              description="Add new course"
              onClick={() => { toast.success('Navigate to Create Course'); navigate('/admin/courses') }}
              color="#F59E0B"
            />
            <QuickActionCard
              icon={Calendar}
              title="Assign Lecture"
              description="Schedule new lecture"
              onClick={() => { toast.success('Navigate to Assign Lecture'); navigate('/admin/assign-lecture') }}
              color="#8B5CF6"
            />
          </div>
        </div>

        {/* Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Students */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentStudents.length > 0 ? (
                recentStudents.map((student) => (
                  <div key={student._id} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">Roll: {student.rollNo}</p>
                      <p className="text-sm text-gray-600">
                        {student.course?.name} - Sem {student.semester}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-700">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  No students found
                </div>
              )}
            </div>
          </div>

          {/* Recent Teachers */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Teachers</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentTeachers.length > 0 ? (
                recentTeachers.map((teacher) => (
                  <div key={teacher._id} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{teacher.name}</p>
                      <p className="text-sm text-gray-600">{teacher.department}</p>
                      <p className="text-sm text-gray-600">{teacher.specialization}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-700">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  No teachers found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;