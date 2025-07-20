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
  DialogTrigger,
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
import { Pencil, Trash2, Plus, AlertCircle } from "lucide-react";

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
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [lectures, setLectures] = useState([]);
  const [allLectures, setAllLectures] = useState([]); // Store all lectures for filtering
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [filterByTeacher, setFilterByTeacher] = useState(""); // Teacher filter

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      setSelectedSemester("");
      setSelectedSubject("");
      setLectures([]); // Clear lectures when course changes
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedSemester) {
      setSelectedSubject("");
      fetchLectures(); // Fetch lectures when semester is selected
    }
  }, [selectedSemester]);

  // Filter lectures by teacher
  useEffect(() => {
    if (filterByTeacher && filterByTeacher !== "all") {
      const filteredLectures = allLectures.filter(
        (lecture) => lecture.teacher._id === filterByTeacher
      );
      setLectures(filteredLectures);
    } else {
      setLectures(allLectures);
    }
  }, [filterByTeacher, allLectures]);

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
          subMap[sem.number] = sem.subjectIds.map((sub) => ({
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
    if (!selectedCourse || !selectedSemester) return;

    try {
      setLoading(true);
      const res = await getLecturesByCourseAndSemester(
        selectedCourse?._id || selectedCourse,
        selectedSemester?.number || selectedSemester
      );
      setAllLectures(res.data.lectures);
      setLectures(res.data.lectures);
    } catch (err) {
      toast.error("Failed to load lectures");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setButtonLoading(true);
    try {
      const payload = {
        teacher: selectedTeacher,
        course: selectedCourse,
        semester: selectedSemester,
        subject: selectedSubject,
        day: selectedDay,
        timeSlot: selectedTimeSlot,
      };

      if (isEdit) {
        await updateLecture(editId, payload);
        toast.success("Lecture updated");
      } else {
        await assignLecture(payload);
        toast.success("Lecture assigned");
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
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteLecture(id);
      toast.success("Lecture deleted");
      fetchLectures();
    } catch (err) {
      toast.error("Failed to delete lecture");
    }
  };

  const openEditForm = (lecture) => {
    setSelectedCourse(lecture.course._id);
    setSelectedSemester(typeof lecture.semester === "object" ? lecture.semester.number : lecture.semester);
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
    setSelectedSubject("");
    setSelectedTeacher("");
    setSelectedDay("");
    setSelectedTimeSlot("");
  };

  const clearFilters = () => {
    setSelectedCourse("");
    setSelectedSemester("");
    setFilterByTeacher("");
    setLectures([]);
    setAllLectures([]);
  };

  // Sort lectures by teacher name
  const sortedLectures = [...lectures].sort((a, b) =>
    a.teacher.name.localeCompare(b.teacher.name)
  );

  return (
    <div className="p-6 space-y-4">
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Filter Lectures</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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

          <Select
            value={selectedSemester}
            onValueChange={setSelectedSemester}
            disabled={!selectedCourse}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {(semestersByCourseId[selectedCourse] || [])
                .filter((sem) => sem.number) // avoid undefined/empty
                .map((s) => (
                  <SelectItem key={s._id} value={s.number}>
                    {s.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={filterByTeacher} onValueChange={setFilterByTeacher}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teachers</SelectItem>
              {teachers.map((t) => (
                <SelectItem key={t._id} value={t._id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button onClick={openAddForm} className="flex-1">
              <Plus className="mr-2 h-4 w-4" /> Add Lecture
            </Button>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Display notification when no filters are selected */}
      {!selectedCourse && !selectedSemester && !filterByTeacher && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <p className="text-blue-800">
            Please select a course & semester or choose a teacher to view lectures
          </p>
        </div>
      )}

      {/* Display lectures table */}
      {(selectedCourse && selectedSemester) || filterByTeacher ? (
        <div className="bg-white rounded-xl border overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading lectures...</p>
            </div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Course</th>
                  <th className="p-3">Semester</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Teacher</th>
                  <th className="p-3">Day</th>
                  <th className="p-3">Time Slot</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLectures.map((lec) => (
                  <tr key={lec._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{lec.course.name}</td>
                    <td className="p-3">Semester {lec.semester}</td>
                    <td className="p-3">{lec.subject.name}</td>
                    <td className="p-3">
                      <div className="font-medium text-blue-700">{lec.teacher.name}</div>
                    </td>
                    <td className="p-3">{lec.day}</td>
                    <td className="p-3">{lec.timeSlot}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditForm(lec)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(lec._id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedLectures.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-gray-400" />
                        <p>No lectures found for the selected filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      ) : null}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Lecture" : "Assign Lecture"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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

            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
              disabled={!selectedCourse}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {(semestersByCourseId[selectedCourse] || [])
                .filter((sem) => sem.number) // avoid undefined/empty
                .map((sem) => (
                  <SelectItem key={sem.number} value={sem.number}>
                    {sem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={!selectedSemester}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {(subjectsBySemesterId[selectedSemester] || [])
                  .filter((sub) => sub && sub._id)
                  .map((sub) => (
                    <SelectItem key={sub._id} value={sub._id}>
                      {sub.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

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

            <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time Slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={buttonLoading}
                className="flex-1"
              >
                {buttonLoading ? "Saving..." : isEdit ? "Update Lecture" : "Assign Lecture"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Lectures;






































































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
  DialogTrigger,
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
  AlertCircle, 
  Search, 
  Filter, 
  X, 
  BookOpen,
  Users,
  Calendar,
  Clock,
  GraduationCap
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
      await deleteLecture(id);
      toast.success("Lecture deleted successfully");
      fetchLectures();
    } catch (err) {
      toast.error("Failed to delete lecture");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/50 shadow-lg">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Lecture Management System
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Efficiently organize and manage academic lectures</p>
        </div>

        {/* Enhanced Filters Card */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-white/60 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl text-white">
              <Filter className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">Smart Search & Filters</h2>
              <p className="text-gray-600 text-sm">Find lectures using advanced filtering options</p>
            </div>
            {hasActiveFilters && (
              <Button 
                onClick={clearAllFilters} 
                variant="outline" 
                size="sm"
                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="text-gray-400 h-5 w-5" />
            </div>
            <Input
              placeholder="Search lectures by teacher, subject, course, day, or time slot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          {/* Enhanced Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                Course
              </label>
              <Select value={selectedCourse} onValueChange={handleCourseChange}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {canSelectAllCourses && (
                    <SelectItem value="all" className="rounded-lg">All Courses</SelectItem>
                  )}
                  {courses.map((c) => (
                    <SelectItem key={c._id} value={c._id} className="rounded-lg">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-green-500" />
                Semester
              </label>
              <Select
                value={selectedSemester}
                onValueChange={handleSemesterChange}
                disabled={!selectedCourse || selectedCourse === "all"}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {(semestersByCourseId[selectedCourse] || [])
                    .filter((sem) => sem.number)
                    .map((s) => (
                      <SelectItem key={s._id} value={s.number} className="rounded-lg">
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Users className="h-4 w-4 text-purple-500" />
                Teacher
              </label>
              <Select value={filterByTeacher} onValueChange={handleTeacherChange}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200">
                  <SelectValue placeholder="Filter by Teacher" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {canSelectAllTeachers && (
                    <SelectItem value="all" className="rounded-lg">All Teachers</SelectItem>
                  )}
                  {teachers.map((t) => (
                    <SelectItem key={t._id} value={t._id} className="rounded-lg">
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Actions</label>
              <Button 
                onClick={openAddForm} 
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" /> 
                Add New Lecture
              </Button>
            </div>
          </div>

          {/* Enhanced Filter Rules Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-blue-800 mb-3">Smart Filter Rules:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Select specific course to enable semester</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Course required for specific semester</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Cannot combine "All Courses" + "All Teachers"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Teacher filters work independently</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Empty State */}
        {!hasActiveFilters && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-3xl p-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl text-white">
                <Search className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-800 mb-2">Ready to Search Lectures</h3>
                <p className="text-indigo-700">Use the filters above or search bar to discover and manage lectures efficiently</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Lectures Table */}
        {(selectedCourse && selectedSemester && selectedCourse !== "all" && selectedSemester !== "all") || filterByTeacher || searchTerm ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Lectures Overview</h3>
                    <p className="text-gray-600">
                      {loading ? "Loading lectures..." : `${sortedLectures.length} lecture(s) found`}
                    </p>
                  </div>
                </div>
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse && selectedCourse !== "all" && (
                      <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium border border-indigo-200">
                        Course: {courses.find(c => c._id === selectedCourse)?.name}
                      </span>
                    )}
                    {selectedSemester && selectedSemester !== "all" && (
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                        Semester: {selectedSemester}
                      </span>
                    )}
                    {filterByTeacher && filterByTeacher !== "all" && (
                      <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
                        Teacher: {teachers.find(t => t._id === filterByTeacher)?.name}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="p-16 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                <p className="text-gray-600 font-semibold text-lg">Loading lectures...</p>
                <p className="text-gray-500 text-sm">Please wait while we fetch the data</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="text-left p-6 font-bold text-gray-700 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Course
                        </div>
                      </th>
                      <th className="text-left p-6 font-bold text-gray-700 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Semester
                        </div>
                      </th>
                      <th className="text-left p-6 font-bold text-gray-700 border-b border-gray-200">Subject</th>
                      <th className="text-left p-6 font-bold text-gray-700 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Teacher
                        </div>
                      </th>
                      <th className="text-left p-6 font-bold text-gray-700 border-b border-gray-200">Day</th>
                      <th className="text-left p-6 font-bold text-gray-700 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Time
                        </div>
                      </th>
                      <th className="text-left p-6 font-bold text-gray-700 border-b border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLectures.map((lec, index) => (
                      <tr key={lec._id} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="p-6">
                          <div className="font-semibold text-gray-900 text-lg">{lec.course.name}</div>
                        </td>
                        <td className="p-6">
                          <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold border border-blue-200">
                            Semester {lec.semester}
                          </span>
                        </td>
                        <td className="p-6 text-gray-700 font-medium">{lec.subject.name}</td>
                        <td className="p-6">
                          <div className="font-semibold text-indigo-700 text-lg">{lec.teacher.name}</div>
                        </td>
                        <td className="p-6">
                          <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold border border-green-200">
                            {lec.day}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 px-4 py-2 rounded-full text-sm font-bold border border-orange-200">
                            {lec.timeSlot}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditForm(lec)}
                              className="h-10 w-10 p-0 rounded-xl border-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 hover:scale-110"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(lec._id)}
                              className="h-10 w-10 p-0 rounded-xl border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 hover:scale-110"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {sortedLectures.length === 0 && !loading && (
                      <tr>
                        <td colSpan="7" className="p-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl">
                              <AlertCircle className="h-16 w-16 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-600 font-bold text-xl mb-2">No lectures found</p>
                              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

        {/* Enhanced Add/Edit Form Dialog */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="max-w-lg bg-white/95 backdrop-blur-sm border-2 border-white/60 rounded-3xl shadow-2xl">
            <DialogHeader className="pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl text-white">
                  {isEdit ? <Pencil className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {isEdit ? "Edit Lecture" : "Create New Lecture"}
                    </DialogTitle>
                 <p className="text-gray-600 text-sm">
                   {isEdit ? "Update lecture information" : "Assign a new lecture to the schedule"}
                 </p>
               </div>
             </div>
           </DialogHeader>

           <div className="space-y-6 pt-6">
             <div className="space-y-3">
               <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                 <BookOpen className="h-4 w-4 text-indigo-500" />
                 Course
               </label>
               <Select value={formSelectedCourse} onValueChange={handleFormCourseChange}>
                 <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200">
                   <SelectValue placeholder="Select Course" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-2">
                   {courses.map((c) => (
                     <SelectItem key={c._id} value={c._id} className="rounded-lg">
                       {c.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>

             <div className="space-y-3">
               <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                 <Calendar className="h-4 w-4 text-green-500" />
                 Semester
               </label>
               <Select
                 value={formSelectedSemester}
                 onValueChange={handleFormSemesterChange}
                 disabled={!formSelectedCourse}
               >
                 <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                   <SelectValue placeholder="Select Semester" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-2">
                   {(semestersByCourseId[formSelectedCourse] || [])
                     .filter((sem) => sem.number)
                     .map((sem) => (
                       <SelectItem key={sem.number} value={sem.number} className="rounded-lg">
                         {sem.name}
                       </SelectItem>
                     ))}
                 </SelectContent>
               </Select>
             </div>

             <div className="space-y-3">
               <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                 <BookOpen className="h-4 w-4 text-blue-500" />
                 Subject
               </label>
               <Select
                 value={selectedSubject}
                 onValueChange={setSelectedSubject}
                 disabled={!formSelectedSemester}
               >
                 <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                   <SelectValue placeholder="Select Subject" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-2">
                   {getFormSubjects()
                     .filter((sub) => sub && sub._id)
                     .map((sub) => (
                       <SelectItem key={sub._id} value={sub._id} className="rounded-lg">
                         {sub.name}
                       </SelectItem>
                     ))}
                 </SelectContent>
               </Select>
             </div>

             <div className="space-y-3">
               <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                 <Users className="h-4 w-4 text-purple-500" />
                 Teacher
               </label>
               <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                 <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200">
                   <SelectValue placeholder="Select Teacher" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-2">
                   {teachers.map((t) => (
                     <SelectItem key={t._id} value={t._id} className="rounded-lg">
                       {t.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-3">
                 <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                   <Calendar className="h-4 w-4 text-emerald-500" />
                   Day
                 </label>
                 <Select value={selectedDay} onValueChange={setSelectedDay}>
                   <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-emerald-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200">
                     <SelectValue placeholder="Select Day" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl border-2">
                     {days.map((day) => (
                       <SelectItem key={day} value={day} className="rounded-lg">
                         {day}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               <div className="space-y-3">
                 <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                   <Clock className="h-4 w-4 text-orange-500" />
                   Time Slot
                 </label>
                 <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                   <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-orange-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200">
                     <SelectValue placeholder="Select Time" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl border-2">
                     {timeSlots.map((slot) => (
                       <SelectItem key={slot} value={slot} className="rounded-lg">
                         {slot}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
             </div>

             {/* Form Validation Info */}
             <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4">
               <div className="flex items-center gap-3">
                 <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                 <div className="text-sm text-yellow-800">
                   <p className="font-semibold mb-1">Required Fields:</p>
                   <p>All fields must be selected to {isEdit ? "update" : "create"} the lecture.</p>
                 </div>
               </div>
             </div>

             <div className="flex gap-4 pt-6 border-t border-gray-200">
               <Button
                 onClick={handleSubmit}
                 disabled={buttonLoading || !formSelectedCourse || !formSelectedSemester || !selectedSubject || !selectedTeacher || !selectedDay || !selectedTimeSlot}
                 className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
               >
                 {buttonLoading ? (
                   <>
                     <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                     {isEdit ? "Updating..." : "Creating..."}
                   </>
                 ) : (
                   <>
                     {isEdit ? <Pencil className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                     {isEdit ? "Update Lecture" : "Create Lecture"}
                   </>
                 )}
               </Button>
               <Button
                 type="button"
                 variant="outline"
                 onClick={() => setFormOpen(false)}
                 className="h-12 px-8 rounded-xl border-2 font-semibold transition-all duration-200 hover:scale-105"
               >
                 Cancel
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </div>
   </div>
 );
};

export default Lectures;