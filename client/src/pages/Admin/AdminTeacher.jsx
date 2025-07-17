import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import {
  addTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} from "@/services/adminAPI";

export default function AdminTeacherManagementPage() {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    specialization: "",
    department: "",
    address: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await getAllTeachers();
      setTeachers(res.data);
    } catch (error) {
      toast.error("Failed to fetch teachers");
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await updateTeacher(editId, formData);
        toast.success("Teacher updated successfully");
      } else {
        await addTeacher(formData);
        toast.success("Teacher added successfully");
      }
      setFormData({
        name: "",
        email: "",
        mobile: "",
        specialization: "",
        department: "",
        address: "",
        password: "",
      });
      setIsEditing(false);
      setEditId(null);
      fetchTeachers();
    } catch (error) {
      toast.error("Failed to submit teacher");
    }
  };

  const handleEdit = (teacher) => {
    setFormData({ ...teacher, password: "" });
    setEditId(teacher._id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeacher(id);
      toast.success("Teacher deleted");
      fetchTeachers();
    } catch (error) {
      toast.error("Failed to delete teacher");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Manage Teachers</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher._id}>
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold">{teacher.name}</p>
              <p>Email: {teacher.email}</p>
              <p>Mobile: {teacher.mobile}</p>
              <p>Specialization: {teacher.specialization}</p>
              <p>Department: {teacher.department}</p>
              <p>Address: {teacher.address}</p>
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => handleEdit(teacher)} size="sm">Edit</Button>
                <Button onClick={() => handleDelete(teacher._id)} size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border rounded-xl p-4 space-y-4 shadow">
        <h3 className="text-xl font-semibold">
          {isEditing ? "Update Teacher" : "Add New Teacher"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            placeholder="Mobile"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
          <Input
            placeholder="Specialization"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />
          <Input
            placeholder="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <Button onClick={handleSubmit}>
          <Plus className="w-4 h-4 mr-2" /> {isEditing ? "Update Teacher" : "Add Teacher"}
        </Button>
      </div>
    </div>
  );
}
