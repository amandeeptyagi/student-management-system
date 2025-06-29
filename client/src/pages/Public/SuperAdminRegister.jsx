import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerSuperAdmin } from '@/services/superAdminAPI'; // Make sure path is correct
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Toaster } from "react-hot-toast";

const SuperAdminRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, mobile, password } = formData;
        if (!name || !email || !mobile || !password) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await registerSuperAdmin(formData);
            toast.success('Super Admin registered successfully!');
            navigate('/superadmin/login'); // or wherever you want to redirect
        } catch (error) {
            console.error("Registration error:", error);

            const message = error.response.data ||
                error.response?.data?.message ||
                error.message ||
                'Registration failed';
                console.log("test");
                toast.error(message.message); // 🔥 Show actual error
            console.log(message.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
           
            <Toaster position="top center" reverseOrder={false} />
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
                <h2 className="text-2xl font-semibold text-center text-blue-700">Register Super Admin</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminRegister;
