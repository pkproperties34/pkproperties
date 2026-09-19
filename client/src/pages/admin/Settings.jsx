import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, Shield, Settings as SettingsIcon, Globe, Image as ImageIcon, LayoutTemplate, Loader2 } from 'lucide-react';
import LandingPageBuilder from './LandingPageBuilder';
import UserManagement from './UserManagement';
import axios from 'axios';

const AdminSettings = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'general');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [developerSettings, setDeveloperSettings] = useState({
    cloudinaryConfigured: false,
    cloudinaryCloudName: ''
  });

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'general');
  }, [searchParams]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/content');
        setContent(data);
        
        // Fetch developer settings
        const token = localStorage.getItem('adminToken');
        if (token) {
          const devRes = await axios.get('http://localhost:5000/api/content/developer-settings', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDeveloperSettings(devRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put('http://localhost:5000/api/content', content, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleGlobalChange = (e) => {
    setContent({
      ...content,
      global: {
        ...content.global,
        [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
      }
    });
  };

  const handleSocialChange = (e) => {
    setContent({
      ...content,
      global: {
        ...content.global,
        socials: {
          ...content.global.socials,
          [e.target.name]: e.target.value
        }
      }
    });
  };

  if (loading || !content) return <div className="p-8 text-center text-gray-500">Loading Settings...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        <p className="text-gray-500">Configure your website, API integrations, and developer preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            
            {activeTab === 'general' && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">General Website Settings</h3>
                <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input type="email" name="email" value={content.global?.email || ''} onChange={handleGlobalChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input type="tel" name="phone" value={content.global?.phone || ''} onChange={handleGlobalChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
                    <textarea name="address" value={content.global?.address || ''} onChange={handleGlobalChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                    <textarea name="workingHours" value={content.global?.workingHours || ''} onChange={handleGlobalChange} rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"></textarea>
                  </div>

                  <h4 className="font-bold text-gray-700 pt-4 border-t">Social Media Links</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Instagram URL</label>
                      <input type="text" name="instagram" value={content.global?.socials?.instagram || ''} onChange={handleSocialChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Facebook URL</label>
                      <input type="text" name="facebook" value={content.global?.socials?.facebook || ''} onChange={handleSocialChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Twitter (X) URL</label>
                      <input type="text" name="twitter" value={content.global?.socials?.twitter || ''} onChange={handleSocialChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn URL</label>
                      <input type="text" name="linkedin" value={content.global?.socials?.linkedin || ''} onChange={handleSocialChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-accent" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2 rounded-md hover:bg-gray-800 transition flex items-center text-sm font-medium disabled:opacity-50">
                      {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />} Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'builder' && (
              <LandingPageBuilder />
            )}

            {activeTab === 'security' && (
              <UserManagement />
            )}

            {activeTab === 'integrations' && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">API Integrations</h3>
                <div className="space-y-8 max-w-2xl">
                  <p className="text-sm text-gray-500">Integrations have been moved to Developer Settings for tighter security control.</p>
                </div>
              </div>
            )}

            {activeTab === 'developer' && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-red-600 mb-6 border-b border-red-100 pb-4 flex items-center">
                  <Shield className="mr-2" /> Super Admin Developer Settings
                </h3>
                <p className="text-sm text-gray-500 mb-6">These settings are highly sensitive and can affect system stability.</p>
                
                <div className="space-y-6 max-w-2xl">
                  
                  <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">Cloudinary (Image Storage)</h4>
                      {developerSettings.cloudinaryConfigured ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Connected</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Not Configured</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Manage your media storage API keys here.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Cloud Name</label>
                        <input type="text" value={developerSettings.cloudinaryCloudName || 'Not configured in .env'} disabled className="w-full px-3 py-1.5 bg-gray-100 border border-gray-200 rounded text-gray-500 text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-red-200 rounded-md bg-red-50">
                    <h4 className="font-semibold text-red-800 mb-2">Maintenance Mode</h4>
                    <p className="text-xs text-red-600 mb-4">Put the public website into maintenance mode. Only admins will be able to log in.</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="maintenanceMode"
                        checked={content.global?.maintenanceMode || false}
                        onChange={handleGlobalChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">Enable Maintenance Mode</span>
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <button onClick={handleSave} disabled={saving} className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition flex items-center text-sm font-medium disabled:opacity-50">
                      {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />} Apply Settings
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-md mt-8">
                    <h4 className="font-semibold text-gray-800 mb-2">System Cache</h4>
                    <p className="text-xs text-gray-500 mb-4">Clear backend API cache and reset Redis connections (if applicable).</p>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition text-sm font-medium">
                      Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
