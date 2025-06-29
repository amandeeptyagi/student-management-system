import React, { useEffect, useState } from "react";
import { getSuperAdminProfile, getSystemConfig, getAllAdmins, toggleAdminRegistration, toggleLoginAccess } from "@/services/superAdminAPI";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [config, setConfig] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState({ registration: false, login: false });

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const [profileRes, configRes, adminsRes] = await Promise.all([
        getSuperAdminProfile(),
        getSystemConfig(),
        getAllAdmins(),
      ]);
      setProfile(profileRes.data);
      setConfig(configRes.data);
      setAdmins(adminsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRegistration = async () => {
    setToggleLoading(prev => ({ ...prev, registration: true }));
    try {
      await toggleAdminRegistration();
      setConfig(prev => ({ ...prev, allowAdminRegistration: !prev.allowAdminRegistration }));
    } catch (error) {
      console.error("Error toggling registration", error);
    } finally {
      setToggleLoading(prev => ({ ...prev, registration: false }));
    }
  };

  const handleToggleLogin = async () => {
    setToggleLoading(prev => ({ ...prev, login: true }));
    try {
      await toggleLoginAccess();
      setConfig(prev => ({ ...prev, allowLogin: !prev.allowLogin }));
    } catch (error) {
      console.error("Error toggling login", error);
    } finally {
      setToggleLoading(prev => ({ ...prev, login: false }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="p-4 flex items-center justify-center min-h-64">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
      <span className="text-lg text-gray-600">Loading dashboard...</span>
    </div>
  );

  // const activeAdmins = admins?.filter(admin => admin.status === 'active')?.length || 0;
  const activeAdmins = admins?.filter(admin => admin.status === 'active')?.length || admins?.length;
  const inactiveAdmins = admins?.filter(admin => admin.status === 'inactive')?.length || 0;
  const totalAdmins = admins?.length || 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-600">Manage your system and administrators</p>
      </div>

      {/* Welcome Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 border-l-4 border-blue-500">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Welcome back, {profile?.name}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{profile?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mobile</p>
            <p className="font-medium text-gray-800">{profile?.mobile}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium text-blue-600">{profile?.role}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Admins</p>
              <p className="text-2xl font-bold text-gray-800">{totalAdmins}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Admins</p>
              <p className="text-2xl font-bold text-green-600">{activeAdmins}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Inactive Admins</p>
              <p className="text-2xl font-bold text-red-600">{inactiveAdmins}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className={`p-3 ${config?.allowLogin ? 'bg-purple-100' : 'bg-gray-200'} rounded-full`}>
              <svg className={`w-6 h-6 ${config?.allowLogin ? 'text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">System Status</p>
              <p className={`text-2xl font-bold ${config?.allowLogin ? 'text-purple-600' : 'text-gray-400'}`}>
                {config?.allowLogin ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Configuration */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">System Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">Admin Registration</h3>
              <p className="text-sm text-gray-500">Allow new admin registration</p>
            </div>
            <button
              onClick={handleToggleRegistration}
              disabled={toggleLoading.registration}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${config?.allowAdminRegistration ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config?.allowAdminRegistration ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">Login Access</h3>
              <p className="text-sm text-gray-500">Allow user login to system</p>
            </div>
            <button
              onClick={handleToggleLogin}
              disabled={toggleLoading.login}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${config?.allowLogin ? 'bg-green-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config?.allowLogin ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Admins */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Admins</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer" onClick={() => navigate('/superadmin/admins-list')}>
            View All
          </button>
        </div>
        {admins && admins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {admins.slice(0, 5).map((admin, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{admin.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">{admin.email || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">{admin.instituteName || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No admins found
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;