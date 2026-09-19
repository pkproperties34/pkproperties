import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Shield, User as UserIcon } from 'lucide-react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [editingPermissionsUser, setEditingPermissionsUser] = useState(null);
  
  const availablePermissions = [
    'Dashboard', 'Projects', 'Properties', 'Leads', 
    'General Website', 'Landing Page', 'Security & Roles', 
    'Integrations', 'Developer Settings'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = { ...formData, permissions: [] }; // start with no permissions
      
      await axios.post('http://localhost:5000/api/users', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('User created successfully');
      setShowModal(false);
      setFormData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this admin user?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleSavePermissions = async () => {
    if (!editingPermissionsUser) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5000/api/users/${editingPermissionsUser._id}`, {
        permissions: editingPermissionsUser.permissions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Permissions updated successfully!');
      setEditingPermissionsUser(null);
      fetchUsers();
    } catch (error) {
      alert('Failed to update permissions');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Users...</div>;

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Security & Roles</h3>
          <p className="text-sm text-gray-500 mt-1">Manage team members and their access to the admin portal.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-800 transition flex items-center text-sm font-medium"
        >
          <Plus size={16} className="mr-2" /> Add Team Member
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 text-sm flex items-start">
        <Shield className="mr-3 mt-0.5 flex-shrink-0" size={18} />
        <div>
          <p className="font-semibold">Granular Permissions Active.</p>
          <p className="mt-1">The Super Admin has complete access. Assign specific permissions to other users to control which modules they can see.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Permissions</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold mr-3">
                      {user.name?.charAt(0) || <UserIcon size={16} />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.email === 'ssaiprasanth333@gmail.com' ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">All Access</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {user.permissions?.slice(0, 2).map((p, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">{p}</span>
                      ))}
                      {user.permissions?.length > 2 && <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">+{user.permissions.length - 2} more</span>}
                      {(!user.permissions || user.permissions.length === 0) && <span className="text-xs text-gray-400">None</span>}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  {user.email !== 'ssaiprasanth333@gmail.com' && (
                    <button 
                      onClick={() => setEditingPermissionsUser(user)}
                      className="p-2 text-primary hover:text-blue-600 transition hover:bg-blue-50 rounded text-sm font-medium flex items-center gap-1"
                    >
                      <Shield size={16} /> Permissions
                    </button>
                  )}
                  {user.email !== 'ssaiprasanth333@gmail.com' && (
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition hover:bg-red-50 rounded"
                      title="Remove User"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Add New Team Member</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-accent focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-accent focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-accent focus:outline-none" />
              </div>



              <div className="pt-4 flex justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded mr-2 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={creating} className="bg-primary text-white px-4 py-2 rounded flex items-center text-sm font-medium disabled:opacity-50">
                  {creating ? <Loader2 size={16} className="animate-spin mr-2" /> : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {editingPermissionsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Edit Permissions</h3>
              <button onClick={() => setEditingPermissionsUser(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Select the modules <strong>{editingPermissionsUser.name}</strong> can access:</p>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {availablePermissions.map(perm => (
                  <label key={perm} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                      checked={editingPermissionsUser.permissions?.includes(perm) || false}
                      onChange={(e) => {
                        const newPerms = e.target.checked 
                          ? [...(editingPermissionsUser.permissions || []), perm]
                          : (editingPermissionsUser.permissions || []).filter(p => p !== perm);
                        setEditingPermissionsUser({ ...editingPermissionsUser, permissions: newPerms });
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700">{perm}</span>
                  </label>
                ))}
              </div>

              <div className="pt-6 flex justify-end">
                <button type="button" onClick={() => setEditingPermissionsUser(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded mr-2 text-sm font-medium">Cancel</button>
                <button type="button" onClick={handleSavePermissions} className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition">
                  Save Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
