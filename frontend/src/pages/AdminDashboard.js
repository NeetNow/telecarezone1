import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogOut, Users, BarChart3, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import new admin components
import DoctorOnboarding from '@/pages/admin/DoctorOnboarding';
import DoctorManagement from '@/pages/admin/DoctorManagement';
import Analytics from '@/pages/admin/Analytics';
import LeadsManagement from '@/pages/admin/LeadsManagement';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function DashboardHome() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/analytics/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (!analytics) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6" data-testid="dashboard-home">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Platform Overview</h2>
        <Button 
          onClick={() => navigate('/admin/onboarding')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          + Add New Doctor
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/doctors')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Professionals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_professionals}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.approved_professionals} approved
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/leads')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pending_professionals}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/analytics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_appointments}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completed_appointments} completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/analytics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.platform_revenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              Total: ₹{analytics.total_revenue?.toFixed(2) || '0.00'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="p-6 cursor-pointer hover:bg-purple-50 transition-colors" onClick={() => navigate('/admin/onboarding')}>
          <h3 className="font-semibold text-lg mb-2">🩺 Onboard New Doctor</h3>
          <p className="text-sm text-gray-600">Add a new professional with comprehensive 27-field form</p>
        </Card>
        <Card className="p-6 cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => navigate('/admin/doctors')}>
          <h3 className="font-semibold text-lg mb-2">👥 Manage Doctors</h3>
          <p className="text-sm text-gray-600">View, edit, and manage all healthcare professionals</p>
        </Card>
        <Card className="p-6 cursor-pointer hover:bg-green-50 transition-colors" onClick={() => navigate('/admin/analytics')}>
          <h3 className="font-semibold text-lg mb-2">📊 View Analytics</h3>
          <p className="text-sm text-gray-600">Track revenue, appointments, and doctor performance</p>
        </Card>
      </div>
    </div>
  );
}

function ProfessionalsManagement() {
  const [professionals, setProfessionals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingPro, setEditingPro] = useState(null);

  useEffect(() => {
    fetchProfessionals();
  }, [filter]);

  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = filter === 'all' 
        ? `${API}/professionals` 
        : `${API}/professionals?status=${filter}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfessionals(response.data);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    }
  };

  const updateStatus = async (professionalId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(
        `${API}/professionals/${professionalId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Professional ${newStatus}`);
      fetchProfessionals();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6" data-testid="professionals-management">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Professionals Management</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]" data-testid="filter-status-select">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Speciality</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Subdomain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professionals.map((prof) => (
                <TableRow key={prof.id} data-testid={`professional-row-${prof.id}`}>
                  <TableCell className="font-medium">
                    Dr. {prof.first_name} {prof.last_name}
                  </TableCell>
                  <TableCell>{prof.speciality || 'N/A'}</TableCell>
                  <TableCell>{prof.email}</TableCell>
                  <TableCell>{prof.phone}</TableCell>
                  <TableCell>₹{prof.consulting_fees}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {prof.subdomain}
                    </code>
                  </TableCell>
                  <TableCell>{getStatusBadge(prof.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {prof.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => updateStatus(prof.id, 'approved')}
                            data-testid={`approve-btn-${prof.id}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => updateStatus(prof.id, 'rejected')}
                            data-testid={`reject-btn-${prof.id}`}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {prof.status === 'approved' && (
                        <Link to={`/admin/analytics/${prof.id}`}>
                          <Button size="sm" variant="outline" data-testid={`view-analytics-${prof.id}`}>
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Analytics
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfessionalAnalytics({ professionalId }) {
  const [analytics, setAnalytics] = useState(null);
  const [professional, setProfessional] = useState(null);

  useEffect(() => {
    if (professionalId) {
      fetchData();
    }
  }, [professionalId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const [analyticsRes, professionalRes] = await Promise.all([
        axios.get(`${API}/admin/analytics/${professionalId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/professionals/${professionalId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setAnalytics(analyticsRes.data);
      setProfessional(professionalRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (!analytics || !professional) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6" data-testid="professional-analytics">
      <div>
        <h2 className="text-3xl font-bold">
          Dr. {professional.first_name} {professional.last_name} - Analytics
        </h2>
        <p className="text-gray-600">{professional.speciality}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.total_appointments}</div>
            <p className="text-sm text-gray-600">
              {analytics.completed_appointments} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{analytics.doctor_revenue?.toFixed(2) || '0.00'}</div>
            <p className="text-sm text-gray-600">90% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{analytics.platform_revenue?.toFixed(2) || '0.00'}</div>
            <p className="text-sm text-gray-600">10% platform fee</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Revenue:</span>
              <span className="font-semibold">₹{analytics.total_revenue?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee (10%):</span>
              <span className="font-semibold text-purple-600">₹{analytics.platform_revenue?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Doctor Amount (90%):</span>
              <span className="font-semibold text-green-600">₹{analytics.doctor_revenue?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // Extract professional ID from URL if on analytics page
  const professionalId = location.pathname.match(/\/admin\/analytics\/(\w+)/)?.[1];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-purple-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                View Main Site
              </Button>
              <Button variant="outline" onClick={handleLogout} data-testid="logout-btn">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="professionals" element={<ProfessionalsManagement />} />
          <Route path="analytics/:professionalId" element={<ProfessionalAnalytics professionalId={professionalId} />} />
          
          {/* New Routes for Enhanced Admin Features */}
          <Route path="onboarding" element={<DoctorOnboarding />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="leads" element={<LeadsManagement />} />
          
          <Route path="*" element={
            <div className="text-center space-y-6" data-testid="admin-dashboard-root">
              <h2 className="text-3xl font-bold">Welcome to Admin Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <Link to="/admin/dashboard">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                      <h3 className="text-xl font-semibold">Dashboard</h3>
                      <p className="text-gray-600 mt-2">View platform analytics</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/admin/onboarding">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
                      <h3 className="text-xl font-semibold">Add Doctor</h3>
                      <p className="text-gray-600 mt-2">27-field onboarding form</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/admin/doctors">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                      <h3 className="text-xl font-semibold">Manage Doctors</h3>
                      <p className="text-gray-600 mt-2">View & edit professionals</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/admin/analytics">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                      <h3 className="text-xl font-semibold">Analytics</h3>
                      <p className="text-gray-600 mt-2">Reports & insights</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/admin/leads">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                      <h3 className="text-xl font-semibold">New Leads</h3>
                      <p className="text-gray-600 mt-2">Review applications</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}