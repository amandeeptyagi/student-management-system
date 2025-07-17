import React, { useState, useEffect } from 'react';
import { addTeacher, getAllTeachers, deleteTeacher, updateTeacher } from "@/services/adminAPI";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Filter,
  GraduationCap,
  BookOpen,
  MapPin,
  Loader2,
  UserPlus,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

const SuperAdminTeachersManage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState("oldest");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingTeacherId, setDeletingTeacherId] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    department: '',
    specialization: '',
    address: ''
  });

  // Load teachers on component mount
  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const response = await getAllTeachers();
      setTeachers(response.data);
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async () => {
    setIsLoading(true);
    const { name, email, mobile, password } = formData;

    if (!name || !email || !mobile || !password) {
      setIsLoading(false);
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await addTeacher(formData);
      const newTeacher = response.data;
      setShowCreateModal(false);
      resetForm();
      toast.success("Teacher created successfully");
      setTeachers((prev) => [...prev, newTeacher]);
      await loadTeachers();
    } catch (error) {
      setIsLoading(false);
      setShowCreateModal(false);
      console.error("Error creating teacher:", error);
      toast.error(
        error.response?.data?.message || "Failed to create teacher"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTeacher = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      setIsLoading(false);
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const payload = { ...formData };
      if (!formData.password) delete payload.password;
      const response = await updateTeacher(selectedTeacher._id, payload);
      const updated = response.data.teacher;
      console.log(updated);
      setTeachers(teachers.map(teacher =>
        teacher._id === selectedTeacher._id ? { ...teacher, ...updated } : teacher
      ));
      toast.success("Updated successfully");
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      toast.error("Update failed");
      console.error('Error updating teacher:', error);
      setIsLoading(false);
      setShowEditModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        setDeletingTeacherId(id);
        await deleteTeacher(id);
        setTeachers(teachers.filter(teacher => teacher._id !== id));
        toast.success("Teacher deleted");
      } catch (error) {
        setDeletingTeacherId(null);
        toast.error("Delete failed");
        console.error('Error deleting teacher:', error);
      } finally {
        setDeletingTeacherId(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      password: '',
      department: '',
      specialization: '',
      address: ''
    });
    setSelectedTeacher(null);
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      mobile: teacher.mobile,
      department: teacher.department,
      specialization: teacher.specialization,
      address: teacher.address || '',
      password: ''
    });
    setShowEditModal(true);
  };

  const openProfileModal = (teacher) => {
    setSelectedTeacher(teacher);
    setShowProfileModal(true);
  };

  // Filter teachers based on search and Date
  const filteredTeachers = teachers
    .filter(teacher => {
      const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "oldest") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600">Manage system teachers</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Teacher
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Create Date Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="oldest">Oldest First</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>


      {/* Teachers Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(teachers.map(t => t.department)).size}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Building className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Specializations</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(teachers.map(t => t.specialization)).size}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Teacher</th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Specialization</th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-right text-s font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className='flex items-center justify-center min-h-20'>
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                      <span className="text-lg text-gray-600">Loading teachers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No teachers found
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-700">
                            {teacher.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-m font-medium text-gray-900">{teacher.name}</div>
                          <div className="text-s text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {teacher.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* <div className="text-m text-gray-500">{teacher.mobile}</div> */}
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {teacher.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {teacher.mobile}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-m text-black-500">{teacher.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-m text-black-500">{teacher.specialization}</div>
                    </td>
                    <td className="px-6 py-4 text-m text-gray-500">
                      {new Date(teacher.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openProfileModal(teacher)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(teacher)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deletingTeacherId === teacher._id}
                          onClick={() => handleDeleteTeacher(teacher._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingTeacherId === teacher._id ? (
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

      {/* Create Teacher Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Teacher</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {["name", "email", "mobile", "password", "department", "specialization", "address"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize mb-1">
                  {field === "mobile" ? "Phone" : field}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            ))}
          </div>

          <DialogFooter className="pt-4">
            <Button onClick={handleCreateTeacher} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Creating..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Teacher
                </>
              )}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {["name", "email", "mobile", "password", "department", "specialization", "address"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize mb-1">
                  {field === "mobile" ? "Phone" : field === "password" ? "New Password (optional)" : field}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={field !== "password"}
                />
              </div>
            ))}
          </div>

          <DialogFooter className="pt-4">
            <Button onClick={handleUpdateTeacher} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Updating..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Teacher
                </>
              )}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Teacher Profile Modal */}
      {showProfileModal && selectedTeacher && (
        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Teacher Profile</DialogTitle>
            </DialogHeader>

            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-green-700">
                  {selectedTeacher.name[0]}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              {[
                { icon: <User />, label: "Name", value: selectedTeacher.name },
                { icon: <Mail />, label: "Email", value: selectedTeacher.email },
                { icon: <Phone />, label: "Phone", value: selectedTeacher.mobile },
                { icon: <GraduationCap />, label: "Department", value: selectedTeacher.department },
                { icon: <BookOpen />, label: "Specialization", value: selectedTeacher.specialization },
                { icon: <MapPin />, label: "Address", value: selectedTeacher.address },
                {
                  icon: <Calendar />,
                  label: "Created",
                  value: new Date(selectedTeacher.createdAt).toLocaleDateString("en-GB"),
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
                  setShowProfileModal(false);
                  openEditModal(selectedTeacher);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Teacher
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SuperAdminTeachersManage;