import React, { useState, useEffect } from 'react';
import { createAdmin, getAllAdmins, deleteAdmin, updateAdmin } from "@/services/superAdminAPI";
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
  School2Icon,
  HomeIcon,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";



const SuperAdminAdminsManage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState("oldest");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState(null);



  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    instituteName: '',
    address: ''
  });


  // Load admins on component mount
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const response = await getAllAdmins();
      setAdmins(response.data);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    setIsLoading(true); // loader start
    const { name, email, mobile, password } = formData;

    if (!name || !email || !mobile || !password) {
      setIsLoading(false); // loader stop
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await createAdmin(formData); // This returns { data: {...admin} }
      const newAdmin = response.data;
      setShowCreateModal(false);
      resetForm();
      toast.success("Admin created successfully");
      setAdmins((prev) => [...prev, newAdmin]); // Add new admin to state
      await loadAdmins();

    } catch (error) {
      setIsLoading(false); // loader stop
      setShowCreateModal(false);
      console.error("Error creating admin:", error);
      toast.error(
        error.response?.data?.message || "Failed to create admin"
        
      );
    } finally {
      setIsLoading(false); // loader stop
    }
  };

  const handleUpdateAdmin = async (e) => {
    setIsLoading(true); // loader start
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      setIsLoading(false); // loader stop
      
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const payload = { ...formData };
      if (!formData.password) delete payload.password;
      const response = await updateAdmin(selectedAdmin._id, payload);
      const updated = response.data;
      setAdmins(admins.map(admin =>
        admin._id === selectedAdmin._id ? { ...admin, ...updated } : admin
      ));
      toast.success("Updated successfully");
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      toast.error("Update failed");
      console.error('Error updating admin:', error);
      setIsLoading(false); // loader stop
      setShowEditModal(false);
    } finally {
    setIsLoading(false); // loader stop
  }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        setDeletingAdminId(id);
        await deleteAdmin(id);
        setAdmins(admins.filter(admin => admin._id !== id));
        toast.success("Admin deleted");
      } catch (error) {
        setDeletingAdminId(null);
        toast.error("Delete failed");
        console.error('Error deleting admin:', error);
      } finally {
    setDeletingAdminId(null);
  }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      password: '',
      instituteName: '',
      address: ''
    });
    setSelectedAdmin(null);
  };


  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      mobile: admin.mobile,
      instituteName: admin.instituteName,
      address: admin.address || '',
      password: '' // Don't prefill password for security
    });
    setShowEditModal(true);
  };


  const openProfileModal = (admin) => {
    setSelectedAdmin(admin);
    setShowProfileModal(true);
  };

  // Filter admins based on search and Date
  const filteredAdmins = admins
    .filter(admin => {
      const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "oldest") {
        return dateA - dateB; // ascending
      } else {
        return dateB - dateA; // descending
      }
    });


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600">Manage system administrators</p>
        </div>
        <Button
          onClick={() => {
            resetForm();               // Clear the form data first
            setShowCreateModal(true);  // Then show the modal
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Admin
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
              placeholder="Search admins..."
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

      {/* Admins Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Admin</th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Institute Name</th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-right text-s font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className='flex items-center justify-center min-h-20'>
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                      <span className="text-lg text-gray-600">Loading admins...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No admins found
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {admin.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-m font-medium text-gray-900">{admin.name}</div>
                          <div className="text-s text-gray-500 ">ID: {admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">

                      <div className="text-m text-gray-500">{admin.mobile}</div>
                    </td>
                    <td className="px-6 py-4">

                      <div className="text-m text-black-500">{admin.instituteName}</div>

                    </td>
                    <td className="px-6 py-4 text-m text-gray-500">
                      {new Date(admin.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openProfileModal(admin)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(admin)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deletingAdminId === admin._id}
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingAdminId === admin._id ? (
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

      {/* Create Admin Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Admin</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {["name", "email", "mobile", "password", "instituteName", "address"].map((field) => (
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
            <Button onClick={handleCreateAdmin} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">

              {isLoading ? "Creating..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Admin
                </>
              )}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>




      {/* Edit Admin Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Admin</DialogTitle>
    </DialogHeader>

    <div className="space-y-4 py-2">
      {["name", "email", "mobile", "password", "instituteName", "address"].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium capitalize mb-1">
            {field === "mobile" ? "Phone" : field === "password" ? "New Password (optional)" : field}
          </label>
          <input
            type={field === "password" ? "password" : "text"}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field !== "password"} // password is optional on update
          />
        </div>
      ))}
    </div>

    <DialogFooter className="pt-4">
      <Button onClick={handleUpdateAdmin} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
        {isLoading ? "Updating..." : (
    <>
      <Save className="mr-2 h-4 w-4" />
      Update Admin
    </>
  )}
      </Button>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>


      {showProfileModal && selectedAdmin && (
  <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Admin Profile</DialogTitle>
      </DialogHeader>

      <div className="flex justify-center mb-4">
        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-xl font-semibold text-blue-700">
            {selectedAdmin.name[0]}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        {[
          { icon: <User />, label: "Name", value: selectedAdmin.name },
          { icon: <Mail />, label: "Email", value: selectedAdmin.email },
          { icon: <Phone />, label: "Phone", value: selectedAdmin.mobile },
          { icon: <School2Icon />, label: "Institute", value: selectedAdmin.instituteName },
          { icon: <HomeIcon />, label: "Address", value: selectedAdmin.address },
          {
            icon: <Calendar />,
            label: "Created",
            value: new Date(selectedAdmin.createdAt).toLocaleDateString("en-GB"),
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
            openEditModal(selectedAdmin);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Admin
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

export default SuperAdminAdminsManage;