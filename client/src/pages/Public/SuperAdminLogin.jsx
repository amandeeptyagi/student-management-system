import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSuperAdmin } from '@/services/publicAPI'; // ✅ make sure this path is correct
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Toaster } from 'react-hot-toast';

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await loginSuperAdmin(formData);
      const user = response.data;

      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");
      navigate('/superadmin/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response.data ||
                error.response?.data?.message ||
                error.message ||
                'Login failed';
                console.log("test");
                toast.error(message.message); // 🔥 Show actual error
            console.log(message.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster position="top center" reverseOrder={false} />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center text-blue-700">Super Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
