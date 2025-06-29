import React, { useState, useEffect } from 'react';
import { Settings, ToggleLeft, ToggleRight, Loader2, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { toggleAdminRegistration, toggleLoginAccess, getSystemConfig } from '@/services/superAdminAPI';

const SuperAdminConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState({
    registration: false,
    login: false
  });

  // Load system config on component mount
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await getSystemConfig();
      setConfig(response.data);
    } catch (error) {
      toast.error('Failed to load system configuration');
      console.error('Config fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRegistration = async () => {
    try {
      setToggleLoading(prev => ({ ...prev, registration: true }));
      await toggleAdminRegistration();

      setConfig(prev => ({
        ...prev,
        allowAdminRegistration: !prev.allowAdminRegistration
      }));

      toast.success(
        `Admin registration ${!config.allowAdminRegistration ? 'enabled' : 'disabled'} successfully`
      );
    } catch (error) {
      toast.error('Failed to toggle admin registration');
      console.error('Registration toggle error:', error);
    } finally {
      setToggleLoading(prev => ({ ...prev, registration: false }));
    }
  };

  const handleToggleLogin = async () => {
    try {
      setToggleLoading(prev => ({ ...prev, login: true }));
      await toggleLoginAccess();

      setConfig(prev => ({
        ...prev,
        allowLogin: !prev.allowLogin
      }));

      toast.success(
        `Login access ${!config.allowLogin ? 'enabled' : 'disabled'} successfully`
      );
    } catch (error) {
      toast.error('Failed to toggle login access');
      console.error('Login toggle error:', error);
    } finally {
      setToggleLoading(prev => ({ ...prev, login: false }));
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-lg text-gray-600">Loading configuration...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Configuration</h1>
              <p className="text-gray-600">Manage system-wide access controls and settings</p>
            </div>
          </div>
        </div>

        {/* Configuration Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Admin Registration Toggle */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Admin Registration
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Control whether new admin accounts can be registered
                </p>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.allowAdminRegistration
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {config.allowAdminRegistration ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              {toggleLoading.registration ? (
                <Loader2 className="ml-4 h-8 w-8 animate-spin text-gray-400" />
              ) : (
                <button
                  onClick={handleToggleRegistration}
                  disabled={toggleLoading.registration}
                  className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none  ${config?.allowAdminRegistration ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config?.allowAdminRegistration ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Login Access Toggle */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Login Access
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Control whether users can log into the system
                </p>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.allowLogin
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {config.allowLogin ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              {toggleLoading.login ? (
                <Loader2 className="ml-4 h-8 w-8 animate-spin text-gray-400" />
              ) : (
                <button
                  onClick={handleToggleLogin}
                  disabled={toggleLoading.login}
                  className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none  ${config?.allowLogin ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config?.allowLogin ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Settings className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Important Notice
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  These settings affect system-wide access. Disabling login access will prevent
                  all users from logging in. Disabling admin registration will prevent new admin
                  accounts from being created. Use with caution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminConfig;