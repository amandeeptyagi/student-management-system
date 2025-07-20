import React, { useEffect, useState } from "react";
import {
  assignLecture,
  getLecturesByCourseAndSemester,
  updateLecture,
  deleteLecture,
} from "@/services/lectureAPI";
import { getAllCourses } from "@/services/courseAPI";
import { getAllTeachers } from "@/services/adminAPI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  X, 
  BookOpen,
  Users,
  Calendar,
  Clock,
  GraduationCap,
  Building,
  Loader2,
  Eye,
  Edit,
  Save
} from "lucide-react";

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Lectures = () => {
  const [courses, setCourses] = useState([]);
  const [semestersByCourseId, setSemestersByCourseId] = useState({});
  const [subjectsBySemesterId, setSubjectsBySemesterId] = useState({});
  const [teachers, setTeachers] = useState([]);
  
  // Filter states
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [filterByTeacher, setFilterByTeacher] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form states
  const [formSelectedCourse, setFormSelectedCourse] = useState("");
  const [formSelectedSemester, setFormSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  
  const [lectures, setLectures] = useState([]);
  const [allLectures, setAllLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [deletingLectureId, setDeletingLectureId] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  // Handle course change for filters
  useEffect(() => {
    if (selectedCourse && selectedCourse !== "all") {
      setSelectedSemester("");
    }
  }, [selectedCourse]);

  // Handle semester change to fetch lectures
  useEffect(() => {
    if (selectedSemester && selectedSemester !== "all" && selectedCourse && selectedCourse !== "all") {
      fetchLectures();
    } else {
      setLectures([]);
      setAllLectures([]);
    }
  }, [selectedSemester, selectedCourse]);

  // Handle form course change
  useEffect(() => {
    if (formSelectedCourse) {
      setFormSelectedSemester("");
      setSelectedSubject("");
    }
  }, [formSelectedCourse]);

  // Handle form semester change
  useEffect(() => {
    if (formSelectedSemester) {
      setSelectedSubject("");
    }
  }, [formSelectedSemester]);

  // Filter lectures based on all criteria
  useEffect(() => {
    let filteredLectures = [...allLectures];

    // Filter by teacher
    if (filterByTeacher && filterByTeacher !== "all") {
      filteredLectures = filteredLectures.filter(
        (lecture) => lecture.teacher._id === filterByTeacher
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filteredLectures = filteredLectures.filter(
        (lecture) =>
          lecture.teacher.name.toLowerCase().includes(search) ||
          lecture.subject.name.toLowerCase().includes(search) ||
          lecture.course.name.toLowerCase().includes(search) ||
          lecture.day.toLowerCase().includes(search) ||
          lecture.timeSlot.toLowerCase().includes(search)
      );
    }

    setLectures(filteredLectures);
  }, [filterByTeacher, searchTerm, allLectures]);

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      const data = res.data;
      setCourses(data);
      const semMap = {};
      const subMap = {};

      data.forEach((course) => {
        semMap[course._id] = course.semesters || [];
        course.semesters.forEach((sem) => {
          sem.name = `Semester ${sem.number}`;
          const subjectKey = `${course._id}-${sem.number}`;
          subMap[subjectKey] = sem.subjectIds.map((sub) => ({
            _id: sub._id,
            name: sub.name,
          }));
        });
      });

      setSemestersByCourseId(semMap);
      setSubjectsBySemesterId(subMap);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await getAllTeachers();
      setTeachers(res.data);
    } catch (err) {
      toast.error("Failed to load teachers");
    }
  };

  const fetchLectures = async () => {
    if (!selectedCourse || selectedCourse === "all" || !selectedSemester || selectedSemester === "all") return;

    try {
      setLoading(true);
      const res = await getLecturesByCourseAndSemester(
        selectedCourse,
        selectedSemester
      );
      setAllLectures(res.data.lectures);
    } catch (err) {
      toast.error("Failed to load lectures");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (value) => {
    // Rule 4: If teacher is "all", course cannot be "all"
    if (filterByTeacher === "all" && value === "all") {
      toast.error("Cannot select 'All Courses' when 'All Teachers' is selected");
      return;
    }
    
    setSelectedCourse(value);
    setSelectedSemester("");
    setLectures([]);
    setAllLectures([]);
  };

  const handleTeacherChange = (value) => {
    // Rule 6: If course is "all", teacher cannot be "all"
    if (selectedCourse === "all" && value === "all") {
      toast.error("Cannot select 'All Teachers' when 'All Courses' is selected");
      return;
    }
    
    setFilterByTeacher(value);
  };

  const handleSemesterChange = (value) => {
    // Rule 1 & 3: Semester can only be selected if course is selected (not empty or "all")
    if (!selectedCourse || selectedCourse === "all") {
      toast.error("Please select a specific course first");
      return;
    }
    
    // Rule 3: Cannot select "all" for semester when course is selected
    if (value === "all" && selectedCourse && selectedCourse !== "all") {
      toast.error("Please select a specific semester for the selected course");
      return;
    }
    
    setSelectedSemester(value);
  };

  const handleFormCourseChange = (value) => {
    setFormSelectedCourse(value);
    setFormSelectedSemester("");
    setSelectedSubject("");
  };

  const handleFormSemesterChange = (value) => {
    if (!formSelectedCourse) {
      toast.error("Please select a course first");
      return;
    }
    setFormSelectedSemester(value);
    setSelectedSubject("");
  };

  const handleSubmit = async () => {
    setButtonLoading(true);
    try {
      const payload = {
        teacher: selectedTeacher,
        course: formSelectedCourse,
        semester: formSelectedSemester,
        subject: selectedSubject,
        day: selectedDay,
        timeSlot: selectedTimeSlot,
      };

      if (isEdit) {
        await updateLecture(editId, payload);
        toast.success("Lecture updated successfully");
      } else {
        await assignLecture(payload);
        toast.success("Lecture assigned successfully");
      }
      setFormOpen(false);
      resetForm();
      fetchLectures();
    } catch (err) {
      toast.error("Error submitting form");
      console.log(err);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    try {
      setDeletingLectureId(id);
      await deleteLecture(id);
      toast.success("Lecture deleted successfully");
      fetchLectures();
    } catch (err) {
      toast.error("Failed to delete lecture");
    } finally {
      setDeletingLectureId(null);
    }
  };

  const openEditForm = (lecture) => {
    setFormSelectedCourse(lecture.course._id);
    setFormSelectedSemester(typeof lecture.semester === "object" ? lecture.semester.number : lecture.semester);
    setSelectedSubject(lecture.subject._id);
    setSelectedTeacher(lecture.teacher._id);
    setSelectedDay(lecture.day);
    setSelectedTimeSlot(lecture.timeSlot);
    setEditId(lecture._id);
    setIsEdit(true);
    setFormOpen(true);
  };

  const openAddForm = () => {
    resetForm();
    setIsEdit(false);
    setFormOpen(true);
  };

  const resetForm = () => {
    setFormSelectedCourse("");
    setFormSelectedSemester("");
    setSelectedSubject("");
    setSelectedTeacher("");
    setSelectedDay("");
    setSelectedTimeSlot("");
  };

  const clearAllFilters = () => {
    setSelectedCourse("");
    setSelectedSemester("");
    setFilterByTeacher("");
    setSearchTerm("");
    setLectures([]);
    setAllLectures([]);
  };

  const hasActiveFilters = selectedCourse || selectedSemester || filterByTeacher || searchTerm;

  // Sort lectures by teacher name
  const sortedLectures = [...lectures].sort((a, b) =>
    a.teacher.name.localeCompare(b.teacher.name)
  );

  // Check if we can show the "All" option based on rules
  const canSelectAllCourses = filterByTeacher !== "all";
  const canSelectAllTeachers = selectedCourse !== "all";

  // Get subjects for the form based on selected course and semester
  const getFormSubjects = () => {
    if (!formSelectedCourse || !formSelectedSemester) return [];
    const subjectKey = `${formSelectedCourse}-${formSelectedSemester}`;
    return subjectsBySemesterId[subjectKey] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lecture Management</h1>
          <p className="text-gray-600">Manage academic lectures and schedules</p>
        </div>
        <Button
          onClick={openAddForm}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Lecture
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lectures by teacher, subject, course, day, or time slot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-400" />
            <Select value={selectedCourse} onValueChange={handleCourseChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {canSelectAllCourses && (
                  <SelectItem value="all">All Courses</SelectItem>
                )}
                {courses.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <Select
              value={selectedSemester}
              onValueChange={handleSemesterChange}
              disabled={!selectedCourse || selectedCourse === "all"}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {(semestersByCourseId[selectedCourse] || [])
                  .filter((sem) => sem.number)
                  .map((s) => (
                    <SelectItem key={s._id} value={s.number}>
                      {s.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teacher Filter */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <Select value={filterByTeacher} onValueChange={handleTeacherChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Teacher" />
              </SelectTrigger>
              <SelectContent>
                {canSelectAllTeachers && (
                  <SelectItem value="all">All Teachers</SelectItem>
                )}
                {teachers.map((t) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              onClick={clearAllFilters} 
              variant="outline" 
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Filter Rules Info */}
        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {selectedCourse && selectedCourse !== "all" && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Course: {courses.find(c => c._id === selectedCourse)?.name}
                  </span>
                )}
                {selectedSemester && selectedSemester !== "all" && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Semester: {selectedSemester}
                  </span>
                )}
                {filterByTeacher && filterByTeacher !== "all" && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                    Teacher: {teachers.find(t => t._id === filterByTeacher)?.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lectures Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lectures</p>
              <p className="text-2xl font-bold text-gray-900">{sortedLectures.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Teachers</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(sortedLectures.map(l => l.teacher._id)).size}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subjects</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(sortedLectures.map(l => l.subject._id)).size}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!hasActiveFilters && (
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Filters Applied</h3>
          <p className="text-gray-600">Select course and semester or use filters to view lectures</p>
        </div>
      )}

      {/* Lectures Table */}
      {(selectedCourse && selectedSemester && selectedCourse !== "all" && selectedSemester !== "all") || filterByTeacher || searchTerm ? (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className='flex items-center justify-center min-h-20'>
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                        <span className="text-lg text-gray-600">Loading lectures...</span>
                      </div>
                    </td>
                  </tr>
                ) : sortedLectures.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No lectures found
                    </td>
                  </tr>
                ) : (
                  sortedLectures.map((lec) => (
                    <tr key={lec._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{lec.course.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Semester {lec.semester}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{lec.subject.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-green-700">
                              {lec.teacher.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{lec.teacher.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{lec.day}</div>
                        <div className="text-sm text-gray-500">{lec.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditForm(lec)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={deletingLectureId === lec._id}
                            onClick={() => handleDelete(lec._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {deletingLectureId === lec._id ? (
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
      ) : null}

      {/* Add/Edit Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Lecture" : "Create New Lecture"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <Select value={formSelectedCourse} onValueChange={handleFormCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Semester</label>
              <Select
                value={formSelectedSemester}
                onValueChange={handleFormSemesterChange}
                disabled={!formSelectedCourse}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {(semestersByCourseId[formSelectedCourse] || [])
                    .filter((sem) => sem.number)
                    .map((sem) => (
                      <SelectItem key={sem.number} value={sem.number}>
                        {sem.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                disabled={!formSelectedSemester}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {getFormSubjects()
                    .filter((sub) => sub && sub._id)
                    .map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teacher</label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Day</label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time Slot</label>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={buttonLoading || !formSelectedCourse || !formSelectedSemester || !selectedSubject || !selectedTeacher || !selectedDay || !selectedTimeSlot}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {buttonLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? "Update Lecture" : "Create Lecture"}
                </>
              )}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Lectures;