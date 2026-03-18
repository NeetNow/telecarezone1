import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  Phone,
  User,
  Briefcase,
  Calendar,
  Filter
} from 'lucide-react';

import { getApiBaseUrl } from '@/lib/utils';

const API = getApiBaseUrl();

export default function LeadsManagement() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch leads from API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      // Fetch leads from leads table
      const response = await axios.get(
        `${API}/leads?page=1&limit=50`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setLeads(response.data.leads || []);
      } else {
        setLeads([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      if (error?.response?.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      } else {
        alert('Failed to load leads');
      }
    } finally {
      setLoading(false);
    }
  };

  // Approve a lead
  const handleApprove = async (leadId, leadName) => {
    if (!window.confirm(`Approve ${leadName} as a professional?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      // Update lead status to converted
      await axios.put(
        `${API}/leads/${leadId}`,
        { 
          status: 'converted',
          notes: 'Approved and converted to professional'
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      alert('Lead approved successfully!');
      fetchLeads();
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      } else {
        alert('Failed to approve: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Reject a lead
  const handleReject = async (leadId, leadName) => {
    if (!window.confirm(`Reject application from ${leadName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      // Update lead status to closed
      await axios.put(
        `${API}/leads/${leadId}`,
        { 
          status: 'closed',
          notes: 'Application rejected by admin'
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      alert('Lead rejected successfully!');
      fetchLeads();
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      } else {
        alert('Failed to reject: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Convert lead to professional (onboard directly)
  const handleConvertToProfessional = (leadId) => {
    navigate(`/admin/onboarding?leadId=${leadId}`);
  };

  // Filter leads based on search and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.ug_qualification?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || lead.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
    closed: leads.filter(l => l.status === 'closed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">New Leads Management</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {filteredLeads.length} Leads
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 font-medium">New Leads</div>
                <div className="text-2xl font-bold text-blue-900">{stats.new}</div>
              </div>
              <User className="w-10 h-10 text-blue-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-yellow-600 font-medium">Contacted</div>
                <div className="text-2xl font-bold text-yellow-900">{stats.contacted}</div>
              </div>
              <Clock className="w-10 h-10 text-yellow-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 font-medium">Converted</div>
                <div className="text-2xl font-bold text-green-900">{stats.converted}</div>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 font-medium">Closed</div>
                <div className="text-2xl font-bold text-red-900">{stats.closed}</div>
              </div>
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, email, or qualification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Leads</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredLeads.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No Leads Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No applications received yet'}
            </p>
          </Card>
        )}

        {/* Leads List */}
        {!loading && filteredLeads.length > 0 && (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  {/* Lead Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Profile Initials */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                        {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lead.first_name} {lead.last_name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.status === 'converted' 
                            ? 'bg-green-100 text-green-800'
                            : lead.status === 'new'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'contacted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {lead.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{lead.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{lead.phone}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{lead.speciality || 'Not specified'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{lead.ug_qualification || 'Not specified'}</span>
                        </div>
                      </div>
                      
                      {lead.pg_qualification && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">PG:</span> {lead.pg_qualification}
                        </div>
                      )}
                      
                      {lead.superspeciality && (
                        <div className="mt-1 text-sm text-gray-600">
                          <span className="font-medium">Super Speciality:</span> {lead.superspeciality}
                        </div>
                      )}
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Applied on: {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    {lead.status === 'new' && (
                      <>
                        <Button
                          onClick={() => handleApprove(lead.id, `${lead.first_name} ${lead.last_name}`)}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(lead.id, `${lead.first_name} ${lead.last_name}`)}
                          className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    <Button
                      onClick={() => navigate(`/admin/leads/${lead.id}`, { state: { lead } })}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
