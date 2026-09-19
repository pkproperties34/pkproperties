import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building, Home, Users, Settings, LogOut, Menu, X, Globe, LayoutTemplate, Shield, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };
  
  // Read current user from localStorage
  const adminUserStr = localStorage.getItem('adminUser');
  const user = adminUserStr && adminUserStr !== 'undefined' ? JSON.parse(adminUserStr) : {};
  const isSuperAdmin = user.email === 'ssaiprasanth333@gmail.com';

  const allMenuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Projects', icon: <Building size={20} />, path: '/admin/projects' },
    { name: 'Properties', icon: <Home size={20} />, path: '/admin/properties' },
    { name: 'Leads', icon: <Users size={20} />, path: '/admin/leads' },
    { name: 'General Website', icon: <Globe size={20} />, path: '/admin/settings?tab=general' },
    { name: 'Landing Page', icon: <LayoutTemplate size={20} />, path: '/admin/settings?tab=builder' },
    { name: 'Security & Roles', icon: <Shield size={20} />, path: '/admin/settings?tab=security' },
    { name: 'Integrations', icon: <ImageIcon size={20} />, path: '/admin/settings?tab=integrations' },
    { name: 'Developer Settings', icon: <Settings size={20} />, path: '/admin/settings?tab=developer' },
  ];
  
  // Filter menu items based on permissions
  const menuItems = isSuperAdmin 
    ? allMenuItems 
    : allMenuItems.filter(item => user.permissions?.includes(item.name));

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className={`bg-primary text-white w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute h-full z-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 bg-gray-900">
          <span className="text-xl font-serif font-bold text-accent">PK Admin</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition"
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-gray-800 rounded-md transition">
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white shadow-sm flex items-center px-4 justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-primary">
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold uppercase">
              {user.name ? user.name.substring(0, 2) : 'A'}
            </div>
            <div className="hidden sm:block">
              <span className="font-medium block leading-tight">{user.name || 'Admin User'}</span>
              <span className="text-xs text-gray-500">{isSuperAdmin ? 'Super Admin' : (user.role || 'User')}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
