
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import PreferenceSettings from '../components/settings/PreferenceSettings';
import DashboardOverview from '../components/dashboard/DashboardOverview';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Welcome, {user?.name || 'User'}!</h1>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <DashboardOverview />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-6">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <PreferenceSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
