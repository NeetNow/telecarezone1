import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  ExternalLink,
  Filter
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function DoctorManagement() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch doctors from API
  useEffect(() => {
    fetchDoctors();
  }, [filterStatus]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const url = filterStatus === 'all' 
        ? `${BACKEND_URL}/api/admin/onboarding/list`
        : `${BACKEND_URL}/api/admin/onboarding/list?status=${filterStatus}`;
        
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setDoctors(response.data.professionals || []);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      alert('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  // Delete doctor
  const handleDelete = async (doctorId, doctorName) => {
    if (!window.confirm(`Are you sure you want to delete ${doctorName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(
        `${BACKEND_URL}/api/admin/onboarding/${doctorId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      alert('Doctor deleted successfully');
      fetchDoctors(); // Refresh list
    } catch (error) {
      alert('Failed to delete doctor: ' + (error.response?.data?.error || error.message));
    }
  };

  // Filter doctors based on search
  const filteredDoctors = doctors.filter(doc => {
    const searchLower = searchTerm.toLowerCase();
    return (
      doc.first_name?.toLowerCase().includes(searchLower) ||
      doc.last_name?.toLowerCase().includes(searchLower) ||
      doc.email?.toLowerCase().includes(searchLower) ||
      doc.profession_qualification?.toLowerCase().includes(searchLower)
    );
  });

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
              <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {filteredDoctors.length} Doctors
              </span>
            </div>
            <Button
              onClick={() => navigate('/admin/onboarding')}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Doctor
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
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
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading doctors...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDoctors.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold mb-2">No Doctors Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Get started by adding your first doctor'}
            </p>
            <Button
              onClick={() => navigate('/admin/onboarding')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Doctor
            </Button>
          </Card>
        )}

        {/* Doctors Table */}
        {!loading && filteredDoctors.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qualification
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      {/* Doctor Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {doctor.profile_photo ? (
                              <img
                                className="h-12 w-12 rounded-full object-cover"
                                src={doctor.profile_photo}
                                alt={doctor.display_name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {doctor.display_name || `${doctor.first_name} ${doctor.last_name}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {doctor.subdomain}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.email}</div>
                        <div className="text-sm text-gray-500">{doctor.country}</div>
                      </td>

                      {/* Qualification */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {doctor.profession_qualification || 'Not specified'}
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{doctor.consulting_fees}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doctor.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : doctor.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doctor.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/doctors/edit/${doctor.id}`)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => window.open(`/doctor/${doctor.subdomain}`, '_blank')}
                            className="text-purple-600 hover:text-purple-900"
                            title="View Landing Page"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor.id, doctor.display_name)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && filteredDoctors.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-gray-500">Total Doctors</div>
              <div className="text-2xl font-bold text-gray-900">{filteredDoctors.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-500">Approved</div>
              <div className="text-2xl font-bold text-green-600">
                {filteredDoctors.filter(d => d.status === 'approved').length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {filteredDoctors.filter(d => d.status === 'pending').length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-500">Average Fee</div>
              <div className="text-2xl font-bold text-purple-600">
                ₹{Math.round(filteredDoctors.reduce((sum, d) => sum + (d.consulting_fees || 0), 0) / filteredDoctors.length)}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
