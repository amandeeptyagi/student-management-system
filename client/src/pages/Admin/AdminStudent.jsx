// components/admin/StudentManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent
} from '@/services/adminAPI';
import { getAllCourses } from '@/services/courseAPI';
import {
  Save,
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  Mail,
  Phone,
  BookOpen,
  X,
  Eye,
  EyeOff,
  Loader2,
  Home as HomeIcon,
  Calendar,
  GraduationCap as GraduationCapIcon,
  BookOpen as BookOpenIcon,
  BadgeCheck as IdBadgeIcon,
  ListOrdered as ListOrderedIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');


  const [isLoading, setIsLoading] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);


  // Form state
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    email: '',
    mobile: '',
    password: '',
    courseId: '',
    semester: '',
    branch: '',
    address: ''
  });

  const [formErrors, setFormErrors] = useState({});


  // Filter students based on search and filters
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCourse) {
      filtered = filtered.filter(student =>
        student.course && student.course._id === selectedCourse
      );
    }

    if (selectedSemester) {
      filtered = filtered.filter(student =>
        student.semester === parseInt(selectedSemester)
      );
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, selectedCourse, selectedSemester]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      setStudents(response.data); // response.data is a flat list of all students
    } catch (err) {
      toast.error('Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data);
    } catch (err) {
      toast.error('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStudents();
    fetchCourses();
    setSelectedSemester('');
  }, [selectedCourse]);
  const validateForm = () => {
    const errors = {};

    if (!formData.rollNo.trim()) errors.rollNo = 'Roll number is required';
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.mobile.trim()) errors.mobile = 'Mobile is required';
    // if (!formData.semester) errors.semester = 'Semester is required';
    // if (!formData.branch.trim()) errors.branch = 'Branch is required';
    if (!formData.address.trim()) errors.address = 'Address is required';

    if (modalType === 'add' && !formData.password.trim()) {
      errors.password = 'Password is required';
    }

    // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (formData.email && !emailRegex.test(formData.email)) {
    //   errors.email = 'Please enter a valid email';
    // }

    // Mobile validation
    // const mobileRegex = /^[0-9]{10}$/;
    // if (formData.mobile && !mobileRegex.test(formData.mobile)) {
    //   errors.mobile = 'Please enter a valid 10-digit mobile number';
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      rollNo: '',
      name: '',
      email: '',
      mobile: '',
      password: '',
      courseId: '',
      semester: '',
      branch: '',
      address: ''
    });
    setFormErrors({});
  };

  const openModal = (type, student = null) => {
    setModalType(type);
    setSelectedStudent(student);
    if (type === 'edit' && student) {
      setFormData({
        rollNo: student.rollNo,
        name: student.name,
        email: student.email,
        mobile: student.mobile,
        password: '',
        courseId: student.course ? student.course._id : '',
        semester: student.semester ? student.semester.toString() : '',
        branch: student.branch ? student.branch : '',
        address: student.address
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    resetForm();
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // loader start
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      setIsLoading(false); // loader stop
      return;
    }

    try {
      const submitData = {
        ...formData,
        branch: formData.branch || null,
        semester: formData.semester ? parseInt(formData.semester) : null,
        courseId: formData.courseId || null,
      };

      // Remove courseId if it's empty to avoid backend validation issues
      if (!submitData.courseId) {
        delete submitData.courseId;
      }
      if (!submitData.semester) {
        delete submitData.semester;
      }
      if (!submitData.branch) {
        delete submitData.branch;
      }

      if (modalType === 'add') {
        const response = await addStudent(submitData);
        const newStudent = response.data.saved
        console.log(newStudent);
        setStudents((prev) => [...prev, newStudent]);
        toast.success('Student added successfully!');
        setIsLoading(false); // loader stop
      } else {
        // For edit, only include password if it's provided
        if (!submitData.password) {
          delete submitData.password;
        }
        const response = await updateStudent(selectedStudent._id, submitData);
        const updated = response.data.updated
        // console.log("this test");
        // console.log(updated);
        setStudents(students.map(student =>
        student._id === selectedStudent._id ? { ...student, ...updated } : student
      ));
        toast.success('Student updated successfully!');
        setIsLoading(false); // loader stop
      }

      closeModal();
      fetchStudents();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Operation failed';
      toast.error(errorMessage);
      console.error('Error:', err);
      setIsLoading(false); // loader stop
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setDeletingStudentId(studentId);
        await deleteStudent(studentId);
        setStudents(students.filter(student => student._id !== studentId));
        toast.success('Student deleted successfully!');
        // fetchStudents();
      } catch (err) {
        setDeletingStudentId(null)
        toast.error('Failed to delete student');
        console.error('Error:', err);
      }
      finally {
        setDeletingStudentId(null);
      }
    }
  };

  const getAvailableSemesters = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    if (!course) return [];

    return course.semesters.map(sem => ({
      number: sem.number,
      label: `Semester ${sem.number}`
    }));
  };

  const openProfileModal = (student) => {
    setSelectedStudent(student);
    setShowStudentProfileModal(true);
  };


  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-lg text-gray-600">Loading students...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
              <p className="text-gray-600 mt-1">Manage all students in your institute</p>
            </div>
            <button
              onClick={() => openModal('add')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Student
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Course Filter */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>

            {/* Semester Filter */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Semesters</option>
              {selectedCourse ?
                getAvailableSemesters(selectedCourse).map((sem) => (
                  <option key={sem.number} value={sem.number}>
                    Semester {sem.number}
                  </option>
                )) : (
                  <option disabled>Please select a course</option>
                )}
            </select>

          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Course Details</th>
                  <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Semester</th>
                  <th className="px-6 py-3 text-right text-s font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className='flex items-center justify-center min-h-20'>
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                        <span className="text-lg text-gray-600">Loading students...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-m font-medium text-gray-900">{student.name}</div>
                            <div className="text-s text-gray-500">Roll No: {student.rollNo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-m text-gray-900">{student.email}</div>
                        <div className="text-s text-gray-500">{student.mobile}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-m text-gray-900">{student.course ? student.course.name : 'No Course'}</div>
                        <div className="text-s text-gray-500">{student.branch || 'No Branch'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Semester {student.semester || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openProfileModal(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal('edit', student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={deletingStudentId === student._id}
                            onClick={() => handleDelete(student._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {deletingStudentId === student._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* student add and update model  */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {modalType === "add" ? "Add New Student" : "Edit Student"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              {[
                { name: "rollNo", label: "Roll Number", type: "text", required: true },
                { name: "name", label: "Name", type: "text", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "mobile", label: "Mobile", type: "tel", required: true },
                {
                  name: "password",
                  label:
                    modalType === "add"
                      ? "Password"
                      : "Password (Leave blank to keep current)",
                  type: showPassword ? "text" : "password",
                  isPassword: true,
                  required: true
                },
                { name: "branch", label: "Branch", type: "text" },
                { name: "address", label: "Address", type: "textarea", required: true },
              ].map(({ name, label, type, required, isPassword }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && "*"}
                  </label>

                  {type === "textarea" ? (
                    <textarea
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors[name] ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                  ) : (
                    <div className="relative">
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 ${isPassword ? "pr-10" : ""
                          } border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors[name] ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {isPassword && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      )}
                    </div>
                  )}

                  {formErrors[name] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>
                  )}
                </div>
              ))}

              {/* Course Dropdown (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.semester ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value="">Select Semester</option>
                  {formData.courseId ? (
                    getAvailableSemesters(formData.courseId).map((sem) => (
                      <option key={sem.number} value={sem.number}>
                        {sem.label}
                      </option>
                    ))
                  ) : (
                    <option disabled>Please select a course</option>
                  )}
                </select>
                {formErrors.semester && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.semester}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isLoading ? "Wait..." : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {modalType === "add" ? "Add Student" : "Update Student"}
                    </>
                  )}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>


        {/* student profile model  */}
        {showStudentProfileModal && selectedStudent && (
          <Dialog open={showStudentProfileModal} onOpenChange={setShowStudentProfileModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Student Profile</DialogTitle>
              </DialogHeader>

              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-green-700">
                    {selectedStudent.name[0]}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                {[
                  { icon: <User />, label: "Name", value: selectedStudent.name },
                  { icon: <Mail />, label: "Email", value: selectedStudent.email },
                  { icon: <Phone />, label: "Mobile", value: selectedStudent.mobile },
                  { icon: <IdBadgeIcon />, label: "Roll No", value: selectedStudent.rollNo },
                  { icon: <BookOpenIcon />, label: "Course", value: selectedStudent.course?.name || "N/A" },
                  { icon: <ListOrderedIcon />, label: "Semester", value: selectedStudent.semester || "N/A" },
                  { icon: <GraduationCapIcon />, label: "Branch", value: selectedStudent.branch || "N/A" },
                  { icon: <HomeIcon />, label: "Address", value: selectedStudent.address },
                  {
                    icon: <Calendar />,
                    label: "Created",
                    value: new Date(selectedStudent.createdAt).toLocaleDateString("en-GB"),
                  },
                ].map(({ icon, label, value }) => (
                  <div className="flex items-center gap-2" key={label}>
                    <div className="text-gray-400">{icon}</div>
                    <div>
                      <div className="text-xs text-gray-500">{label}</div>
                      <div className="font-medium text-black">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter className="pt-6">
                <Button
                  onClick={() => {
                    setShowStudentProfileModal(false);
                    openModal('edit', selectedStudent);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Student
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}


      </div>
    </div>
  );
};

export default StudentManagement;