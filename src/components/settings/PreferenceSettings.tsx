
import React, { useState } from 'react';

const PreferenceSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    accountUpdates: true,
    securityAlerts: true,
    newsletters: false,
    tips: false,
  });

  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEmailNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Make API call to update preferences
      const response = await fetch('/api/preferences/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailNotifications,
          theme,
          language,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Preferences updated successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update preferences' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating preferences' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {message.text && (
          <div className={`px-4 py-3 mb-6 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Email Notification Preferences */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Preferences</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage how you receive notifications
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Email Notifications</legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="accountUpdates"
                      name="accountUpdates"
                      type="checkbox"
                      checked={emailNotifications.accountUpdates}
                      onChange={handleNotificationChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="accountUpdates" className="font-medium text-gray-700">Account updates</label>
                    <p className="text-gray-500">Get notified about important changes to your account</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="securityAlerts"
                      name="securityAlerts"
                      type="checkbox"
                      checked={emailNotifications.securityAlerts}
                      onChange={handleNotificationChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="securityAlerts" className="font-medium text-gray-700">Security alerts</label>
                    <p className="text-gray-500">Get notified about security events like password changes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="newsletters"
                      name="newsletters"
                      type="checkbox"
                      checked={emailNotifications.newsletters}
                      onChange={handleNotificationChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="newsletters" className="font-medium text-gray-700">Newsletters</label>
                    <p className="text-gray-500">Receive our monthly newsletter with updates and news</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="tips"
                      name="tips"
                      type="checkbox"
                      checked={emailNotifications.tips}
                      onChange={handleNotificationChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="tips" className="font-medium text-gray-700">Tips and tutorials</label>
                    <p className="text-gray-500">Receive helpful tips about using the application</p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Display Preferences</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Customize your visual experience
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
                <select
                  id="theme"
                  name="theme"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="system">System default</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  id="language"
                  name="language"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Privacy */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Data & Privacy</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your data and privacy settings
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Download my data
                </button>
                <p className="mt-1 text-sm text-gray-500">Get a copy of all data associated with your account</p>
              </div>
              
              <div className="pt-2">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete my account
                </button>
                <p className="mt-1 text-sm text-gray-500">Permanently delete your account and all associated data</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? 'Saving...' : 'Save preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreferenceSettings;
