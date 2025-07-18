import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Calendar,
  Users,
  ChevronRight,
  ChevronDown,
  Save,
  X,
  GraduationCap,
  Clock,
  User,
  Hash,
  FileText,
  Loader2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getSemesters,
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject
} from '@/services/courseAPI';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [semesterLoading, setSemesterLoading] = useState(false);
  const [subjectLoading, setSubjectLoading] = useState({});
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedSemester, setExpandedSemester] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState({});

  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);

  // Form states
  const [courseForm, setCourseForm] = useState({ name: '', duration: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', description: '' });

  //button loading
  const [courseSubmitting, setCourseSubmitting] = useState(false);
  const [subjectSubmitting, setSubjectSubmitting] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [deletingSubjectId, setDeletingSubjectId] = useState(null);


  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getAllCourses();
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (courseId) => {
    try {
      setSemesterLoading(true);
      const response = await getSemesters(courseId);
      setSemesters(response.data);
    } catch (error) {
      toast.error('Failed to fetch semesters');
    } finally {
      setSemesterLoading(false);
    }
  };

  const fetchSubjects = async (courseId, semesterNumber) => {
    try {
      const key = `${courseId}-${semesterNumber}`;
      setSubjectLoading(prev => ({ ...prev, [key]: true }));

      const response = await getSubjects(courseId, semesterNumber);
      setSubjects(prev => ({
        ...prev,
        [key]: response.data
      }));
    } catch (error) {
      toast.error('Failed to fetch subjects');
    } finally {
      const key = `${courseId}-${semesterNumber}`;
      setSubjectLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCourseSubmitting(true);
    try {
      const response = await createCourse({
        name: courseForm.name,
        duration: parseInt(courseForm.duration)

      });

      setCourses(prev => [...prev, response.data]);
      // setCourseForm({ name: '', duration: '' });
      setShowCourseModal(false);
      toast.success('Course created successfully');
    } catch (error) {
      toast.error('Failed to create course');
      console.log(error);
    } finally {
      setCourseForm({ name: '', duration: '' });
      setCourseSubmitting(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setCourseSubmitting(true);
    try {
      const response = await updateCourse(editingCourse._id, {
        name: courseForm.name,
        duration: parseInt(courseForm.duration)
      });

      setCourses(prev => prev.map(course =>
        course._id === editingCourse._id ? response.data.course : course
      ));

      // setCourseForm({ name: '', duration: '' });
      // setEditingCourse(null);
      setShowCourseModal(false);
      toast.success('Course updated successfully');
    } catch (error) {
      toast.error('Failed to update course');
    } finally {
      fetchSemesters(editingCourse._id);
      setCourseForm({ name: '', duration: '' });
      setEditingCourse(null);
      setCourseSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This will also delete all associated subjects.')) {
      return;
    }
    setDeletingCourseId(courseId);

    try {
      await deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course._id !== courseId));
      toast.success('Course deleted successfully');
    } catch (error) {
      toast.error('Failed to delete course');
    } finally {
      setDeletingCourseId(null);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setSubjectSubmitting(true);
    try {
      const response = await addSubject(currentCourseId, currentSemester, subjectForm);

      const key = `${currentCourseId}-${currentSemester}`;
      setSubjects(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), response.data.subject]
      }));

      // setSubjectForm({ name: '', code: '', description: '' });
      setShowSubjectModal(false);
      toast.success('Subject added successfully');
    } catch (error) {
      toast.error('Failed to add subject');
    } finally {
      setSubjectForm({ name: '', code: '', description: '' });
      setSubjectSubmitting(false);
    }
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    setSubjectSubmitting(true);
    try {

      const response = await updateSubject(editingSubject._id, subjectForm);

      const key = `${currentCourseId}-${currentSemester}`;
      setSubjects(prev => ({
        ...prev,
        [key]: prev[key].map(subject =>
          subject._id === editingSubject._id ? response.data.subject : subject
        )
      }));

      // setSubjectForm({ name: '', code: '', description: '' });
      // setEditingSubject(null);
      setShowSubjectModal(false);
      toast.success('Subject updated successfully');
    } catch (error) {
      toast.error('Failed to update subject');
    } finally {
      setSubjectForm({ name: '', code: '', description: '' });
      setEditingSubject(null);
      setSubjectSubmitting(false);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }
    setDeletingSubjectId(subjectId);
    try {
      await deleteSubject(currentCourseId, currentSemester, subjectId);

      const key = `${currentCourseId}-${currentSemester}`;
      setSubjects(prev => ({
        ...prev,
        [key]: prev[key].filter(subject => subject._id !== subjectId)
      }));

      toast.success('Subject deleted successfully');
    } catch (error) {
      toast.error('Failed to delete subject');
    } finally {
      setDeletingSubjectId(null);
    }
  };

  const openCourseModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({ name: course.name, duration: course.duration.toString() });
    } else {
      setEditingCourse(null);
      setCourseForm({ name: '', duration: '' });
    }
    setShowCourseModal(true);
  };

  const openSubjectModal = (courseId, semesterNumber, subject = null) => {
    setCurrentCourseId(courseId);
    setCurrentSemester(semesterNumber);

    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({
        name: subject.name,
        code: subject.code,
        description: subject.description || ''
      });
    } else {
      setEditingSubject(null);
      setSubjectForm({ name: '', code: '', description: '' });
    }
    setShowSubjectModal(true);
  };

  const toggleCourse = async (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      setSemesters([]);
      setExpandedSemester(null);
    } else {
      setExpandedCourse(courseId);
      await fetchSemesters(courseId);
      setExpandedSemester(null);
    }
  };

  const toggleSemester = async (courseId, semesterNumber) => {
    const key = `${courseId}-${semesterNumber}`;

    if (expandedSemester === key) {
      setExpandedSemester(null);
    } else {
      setExpandedSemester(key);
      setCurrentCourseId(courseId);
      setCurrentSemester(semesterNumber);
      await fetchSubjects(courseId, semesterNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            </div>
            <Button
              onClick={() => openCourseModal()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>
          <p className="text-gray-600 mt-2">Manage your courses, semesters, and subjects</p>
        </div>

        {/* Courses List */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-4 flex items-center justify-center min-h-64">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <span className="text-lg text-gray-600">Loading courses...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No courses found</p>
              <p className="text-gray-400">Create your first course to get started</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Course Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleCourse(course._id)}
                        className="flex items-center gap-3 text-left cursor-pointer"
                      >
                        {expandedCourse === course._id ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{course.name}</h2>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.duration} years
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {course.duration * 2} semesters
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openCourseModal(course)}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingCourseId === course._id}
                        onClick={() => handleDeleteCourse(course._id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        {deletingCourseId === course._id ? 'Deleting...' : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Semesters */}
                {expandedCourse === course._id && (
                  <div className="p-6">
                    {semesterLoading ? (
                      <div className="p-4 flex items-center justify-center min-h-34">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                        <span className="text-lg text-gray-600">Loading semesters...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {semesters.map((semester) => (
                          <div key={semester.number} className="border border-gray-200 rounded-lg">
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                              <button
                                onClick={() => toggleSemester(course._id, semester.number)}
                                className="flex items-center justify-between w-full cursor-pointer"
                              >
                                <h3 className="font-medium text-gray-900">
                                  Semester {semester.number}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">
                                    {subjects[`${course._id}-${semester.number}`]?.length || 0} subjects
                                  </span>
                                  {expandedSemester === `${course._id}-${semester.number}` ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  )}
                                </div>
                              </button>
                            </div>

                            {/* Subjects */}
                            {expandedSemester === `${course._id}-${semester.number}` && (
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-medium text-gray-700">Subjects</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openSubjectModal(course._id, semester.number)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Subject
                                  </Button>
                                </div>

                                {subjectLoading[`${course._id}-${semester.number}`] ? (
                                  <div className="p-4 flex items-center justify-center min-h-34">
                                    <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                                    <span className="text-lg text-gray-600">Loading subjects...</span>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {subjects[`${course._id}-${semester.number}`]?.map((subject) => (
                                      <div key={subject._id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                        <div>
                                          <h5 className="font-medium text-gray-900">{subject.name}</h5>
                                          <p className="text-sm text-gray-600">{subject.code}</p>
                                          {subject.description && (
                                            <p className="text-sm text-gray-500 mt-1">{subject.description}</p>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openSubjectModal(course._id, semester.number, subject)}
                                            className="text-gray-500 hover:text-blue-600 p-1"
                                          >
                                            <Edit className="w-3 h-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={deletingSubjectId === subject._id}
                                            onClick={() => handleDeleteSubject(subject._id)}
                                            className="text-gray-500 hover:text-red-600 p-1"
                                          >
                                            {deletingSubjectId === subject._id ? 'Deleting...' : <Trash2 className="w-3 h-3" />}
                                          </Button>
                                        </div>
                                      </div>
                                    ))}

                                    {subjects[`${course._id}-${semester.number}`]?.length === 0 && (
                                      <p className="text-gray-500 text-sm text-center py-4">
                                        No subjects added yet
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Course Modal */}
        <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>Course Name</span>
                  </div>
                  <input
                    type="text"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter course name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Duration (Years)</span>
                  </div>
                  <input
                    type="number"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter duration in years"
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={courseSubmitting}
                >
                  {courseSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">🔄</span>
                      {editingCourse ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingCourse ? 'Update' : 'Create'}
                    </>
                  )}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Subject Modal */}
        <Dialog open={showSubjectModal} onOpenChange={setShowSubjectModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={editingSubject ? handleUpdateSubject : handleCreateSubject}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>Subject Name</span>
                  </div>
                  <input
                    type="text"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subject name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hash className="w-4 h-4" />
                    <span>Subject Code</span>
                  </div>
                  <input
                    type="text"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subject code"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Description (Optional)</span>
                  </div>
                  <textarea
                    value={subjectForm.description}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subject description"
                    rows="3"
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={subjectSubmitting}
                >
                  {subjectSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">🔄</span>
                      {editingSubject ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingSubject ? 'Update' : 'Add'}
                    </>
                  )}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Toast Container */}
      {/* div not jaroori */}
      {/* <div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div> */}
    </div>
  );
};

export default CourseManagement;