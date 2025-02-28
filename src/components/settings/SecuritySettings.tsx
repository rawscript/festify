
import React, { useState } from 'react';

const SecuritySettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTwoFactor = () => {
    // This would be implemented with actual 2FA logic
    setTwoFactorEnabled(!twoFactorEnabled);
    setMessage({ 
      type: 'info', 
      text: !twoFactorEnabled ? 
        'Two-factor authentication enabled' : 
        'Two-factor authentication disabled' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Update your password to keep your account secure
          </p>
        </div>

        {message.text && (
          <div className={`px-4 py-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 
            message.type === 'error' ? 'bg-red-50 text-red-800' : 
            'bg-blue-50 text-blue-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="border-t border-gray-200">
          <form onSubmit={handlePasswordChange} className="divide-y divide-gray-200">
            <div className="px-4 py-5 space-y-4 sm:p-6">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="mt-1">
                  <input
                    id="current-password"
                    name="current-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters and include a number and a special character
                </p>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Two-Factor Authentication</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Add an extra layer of security to your account
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex items-start">
            <div className="flex-1">
              <h4 className="text-md font-medium text-gray-900">
                {twoFactorEnabled ? 'Disable two-factor authentication' : 'Enable two-factor authentication'}
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                {twoFactorEnabled ? 
                  'Two-factor authentication is currently enabled. You will need to enter a code from your authenticator app when logging in.' : 
                  'When two-factor authentication is enabled, you will be required to enter a secure, random code during login.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleTwoFactor}
              className={`ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                twoFactorEnabled 
                  ? 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200' 
                  : 'text-white bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {/* Session Management Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Account Security</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your account security options
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-medium text-gray-900">Active Sessions</h4>
              <p className="mt-1 text-sm text-gray-500">
                You're currently signed in on this device.
              </p>
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign out all other sessions
                </button>
              </div>
            </div>
            
            <div className="pt-5">
              <h4 className="text-md font-medium text-gray-900">Account Activity Log</h4>
              <p className="mt-1 text-sm text-gray-500">
                Review recent account activity
              </p>
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View activity log
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
