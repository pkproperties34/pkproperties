import React, { useState, useEffect } from 'react';
import { Building, Home, Users, TrendingUp, Loader2 } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalProperties: 0,
    newLeads: 0,
    siteVisits: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all in parallel
        const [projectsRes, propertiesRes, leadsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/projects', { headers }).catch(() => ({ data: [] })),
          axios.get('http://localhost:5000/api/properties', { headers }).catch(() => ({ data: [] })),
          axios.get('http://localhost:5000/api/leads', { headers }).catch(() => ({ data: [] }))
        ]);

        const projects = projectsRes.data || [];
        const properties = propertiesRes.data || [];
        const leads = leadsRes.data || [];

        const newLeadsCount = leads.filter(l => l.status === 'New').length;
        const siteVisitsCount = leads.filter(l => l.status === 'Site Visit').length;

        setStats({
          totalProjects: projects.length,
          totalProperties: properties.length,
          newLeads: newLeadsCount,
          siteVisits: siteVisitsCount
        });

        // Set recent leads (last 5)
        const sortedLeads = leads.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
        setRecentLeads(sortedLeads.slice(0, 5));

      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const kpis = [
    { title: 'Total Projects', value: stats.totalProjects, icon: <Building size={24} className="text-blue-500"/>, bg: 'bg-blue-50' },
    { title: 'Total Properties', value: stats.totalProperties, icon: <Home size={24} className="text-green-500"/>, bg: 'bg-green-50' },
    { title: 'New Leads', value: stats.newLeads, icon: <Users size={24} className="text-yellow-500"/>, bg: 'bg-yellow-50' },
    { title: 'Site Visits', value: stats.siteVisits, icon: <TrendingUp size={24} className="text-purple-500"/>, bg: 'bg-purple-50' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary mr-2" size={24} /> Loading Dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back to PK PROPERTIES admin portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${kpi.bg} mr-4`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Leads</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.length > 0 ? recentLeads.map((lead, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3">{lead.name}</td>
                    <td className="py-3 text-sm text-gray-500">{lead.phone || lead.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        lead.status === 'New' ? 'bg-yellow-100 text-yellow-700' :
                        lead.status === 'Site Visit' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'Closed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-sm text-gray-500">No recent leads found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium">Add New Project</button>
            <button className="w-full bg-accent text-white py-2 rounded-md hover:bg-yellow-600 transition text-sm font-medium">Add New Property</button>
            <button className="w-full border border-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium">View All Leads</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
