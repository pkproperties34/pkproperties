import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public Imports
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Properties from './pages/Properties';
import ProjectDetails from './pages/ProjectDetails';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import AdminProjects from './pages/admin/Projects';
import ProjectForm from './pages/admin/ProjectForm';
import AdminProperties from './pages/admin/Properties';
import PropertyForm from './pages/admin/PropertyForm';
import AdminLeads from './pages/admin/Leads';
import AdminSettings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
        <Route path="/projects/:slug" element={<PublicLayout><ProjectDetails /></PublicLayout>} />
        <Route path="/properties" element={<PublicLayout><Properties /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        
        {/* Admin Auth Routes (No Layout) */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<AdminProjects />} />
              <Route path="/projects/new" element={<ProjectForm />} />
              <Route path="/projects/edit/:id" element={<ProjectForm />} />
              <Route path="/properties" element={<AdminProperties />} />
              <Route path="/properties/new" element={<PropertyForm />} />
              <Route path="/properties/edit/:id" element={<PropertyForm />} />
              <Route path="/leads" element={<AdminLeads />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
