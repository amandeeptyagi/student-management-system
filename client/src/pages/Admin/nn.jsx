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