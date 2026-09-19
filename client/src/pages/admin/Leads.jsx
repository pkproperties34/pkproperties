import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, Mail, FileText, ChevronDown, X, MessageSquare, Save, Loader2 } from 'lucide-react';
import axios from 'axios';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [selectedLead, setSelectedLead] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      // Dummy data fallback
      if (error.response?.status === 401 || error.code === 'ERR_NETWORK') {
        setLeads([
          {
            _id: '1', name: 'Arjun Kumar', phone: '+91 9876543210', email: 'arjun@example.com',
            status: 'New', type: 'Site Visit', source: 'Website Form',
            project: null, createdAt: new Date().toISOString(), notes: []
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Contacted': return 'bg-indigo-100 text-indigo-700';
      case 'Site Visit Scheduled': return 'bg-purple-100 text-purple-700';
      case 'Site Visit Completed': return 'bg-yellow-100 text-yellow-700';
      case 'Negotiation': return 'bg-orange-100 text-orange-700';
      case 'Converted': return 'bg-green-100 text-green-700';
      case 'Lost': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const openLeadModal = (lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setNewNote('');
  };

  const handleUpdateStatus = async () => {
    if (newStatus === selectedLead.status) return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${import.meta.env.VITE_API_URL}/leads/${selectedLead._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state
      setSelectedLead({ ...selectedLead, status: newStatus });
      setLeads(leads.map(l => l._id === selectedLead._id ? { ...l, status: newStatus } : l));
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/leads/${selectedLead._id}/notes`, { content: newNote }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedLead(data);
      setLeads(leads.map(l => l._id === selectedLead._id ? data : l));
      setNewNote('');
    } catch (error) {
      alert('Failed to add note');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
          <p className="text-gray-500">Track and manage customer enquiries and site visits.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <input 
              type="text" placeholder="Search leads by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Lead Info</th>
                <th className="px-6 py-3 font-medium">Interest</th>
                <th className="px-6 py-3 font-medium">Source & Type</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading leads...</td></tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => openLeadModal(lead)}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1"><Phone size={12} className="mr-1"/> {lead.phone}</div>
                      {lead.email && <div className="text-xs text-gray-500 flex items-center mt-1"><Mail size={12} className="mr-1"/> {lead.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800">{lead.project?.name || 'General Enquiry'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-800">{lead.type}</div>
                      <div className="text-xs text-gray-500">{lead.source}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(lead.status)}`}>{lead.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-accent hover:text-yellow-600 transition bg-accent/10 rounded-md" title="View Details" onClick={(e) => { e.stopPropagation(); openLeadModal(lead); }}>
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedLead.name}</h2>
                <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center"><Phone size={14} className="mr-1"/> {selectedLead.phone}</span>
                  {selectedLead.email && <span className="flex items-center"><Mail size={14} className="mr-1"/> {selectedLead.email}</span>}
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Lead Details</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Source:</span> <span className="font-medium text-gray-800">{selectedLead.source}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Type:</span> <span className="font-medium text-gray-800">{selectedLead.type}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Project:</span> <span className="font-medium text-gray-800">{selectedLead.project?.name || 'None'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-800">{new Date(selectedLead.createdAt).toLocaleString()}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Update Status</h3>
                  <div className="flex space-x-2">
                    <select 
                      value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-accent text-sm"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                      <option value="Site Visit Completed">Site Visit Completed</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                    <button 
                      onClick={handleUpdateStatus} disabled={isUpdating || newStatus === selectedLead.status}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center">
                  <MessageSquare size={16} className="mr-2" /> Notes & History
                </h3>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4 max-h-64 overflow-y-auto space-y-4 border border-gray-100">
                  {selectedLead.notes && selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((note, idx) => (
                      <div key={idx} className="bg-white p-3 rounded shadow-sm border border-gray-100 text-sm">
                        <p className="text-gray-800">{note.content}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(note.timestamp).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No notes added yet.</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <input 
                    type="text" placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-accent text-sm"
                  />
                  <button 
                    onClick={handleAddNote} disabled={!newNote.trim() || isUpdating}
                    className="bg-accent text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition text-sm font-medium disabled:opacity-50 flex items-center"
                  >
                    {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminLeads;
