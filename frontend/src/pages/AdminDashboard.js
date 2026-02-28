import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogOut, Users, BarChart3, CheckCircle, XCircle, Clock, DollarSign, Menu, X, Layout, Package, ShoppingCart, UserSquare, Tag, FileText, Newspaper, Percent, TrendingUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Custom CSS for animations
const customStyles = `
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

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
  const [animatedNumbers, setAnimatedNumbers] = useState({
    professionals: 0,
    pending: 0,
    appointments: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (analytics) {
      // Animate numbers on load
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedNumbers({
          professionals: Math.floor(analytics.total_professionals * progress),
          pending: Math.floor(analytics.pending_professionals * progress),
          appointments: Math.floor(analytics.total_appointments * progress),
          revenue: (analytics.platform_revenue || 0) * progress
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedNumbers({
            professionals: analytics.total_professionals,
            pending: analytics.pending_professionals,
            appointments: analytics.total_appointments,
            revenue: analytics.platform_revenue || 0
          });
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [analytics]);

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

  if (!analytics) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="space-y-8" data-testid="dashboard-home">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white p-8 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 animate-pulse">Welcome to TeleCare Admin! 👋</h1>
            <p className="text-xl opacity-90">Here's your platform overview with real-time analytics</p>
          </div>
          <div className="hidden lg:block">
            <div className="animate-bounce">
              <BarChart3 className="w-16 h-16 text-white opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={() => navigate('/admin/onboarding')}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Users className="w-4 h-4 mr-2" />
          + Add New Doctor
        </Button>
        <Button 
          onClick={() => navigate('/admin/leads')}
          variant="outline"
          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 shadow-md transform hover:scale-105 transition-all duration-200"
        >
          <Clock className="w-4 h-4 mr-2" />
          Review Applications ({analytics.pending_professionals})
        </Button>
        <Button 
          onClick={() => navigate('/admin/analytics')}
          variant="outline"
          className="border-blue-500 text-blue-600 hover:bg-blue-50 shadow-md transform hover:scale-105 transition-all duration-200"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>
      
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Professionals</CardTitle>
            <div className="animate-pulse">
              <Users className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">{animatedNumbers.professionals}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-700">
                {analytics.approved_professionals} approved
              </p>
              <div className="w-16 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: `${(analytics.approved_professionals / analytics.total_professionals) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pending Applications</CardTitle>
            <div className="animate-bounce">
              <Clock className="h-6 w-6 text-yellow-600 group-hover:rotate-12 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900 mb-2">{animatedNumbers.pending}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-yellow-700">Awaiting review</p>
              {analytics.pending_professionals > 0 && (
                <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full animate-pulse">
                  Action Needed
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Appointments</CardTitle>
            <div className="animate-spin-slow">
              <BarChart3 className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-2">{animatedNumbers.appointments}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-green-700">
                {analytics.completed_appointments} completed
              </p>
              <div className="w-16 bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(analytics.completed_appointments / analytics.total_appointments) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Platform Revenue</CardTitle>
            <div className="animate-pulse">
              <DollarSign className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-2">₹{animatedNumbers.revenue.toFixed(2)}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-purple-700">
                Total: ₹{analytics.total_revenue?.toFixed(2) || '0.00'}
              </p>
              <span className="text-green-600 text-xs font-semibold">+12.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today's Revenue</span>
                <span className="font-semibold text-green-600">₹2,450.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold text-blue-600">₹12,340.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold text-purple-600">₹27,688.00</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Professional Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm">Approved</span>
                </div>
                <span className="font-semibold">{analytics.approved_professionals}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-bounce"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-semibold">{analytics.pending_professionals}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm">Rejected</span>
                </div>
                <span className="font-semibold">{analytics.total_professionals - analytics.approved_professionals - analytics.pending_professionals}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" onClick={() => navigate('/admin/onboarding')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UserSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-purple-800">🩺 Onboard New Doctor</h3>
            <p className="text-sm text-purple-700">Add a new professional with comprehensive 27-field form</p>
          </CardContent>
        </Card>
        
        <Card className="group cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" onClick={() => navigate('/admin/doctors')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-blue-800">👥 Manage Doctors</h3>
            <p className="text-sm text-blue-700">View, edit, and manage all healthcare professionals</p>
          </CardContent>
        </Card>
        
        <Card className="group cursor-pointer bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" onClick={() => navigate('/admin/analytics')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-green-800">📊 View Analytics</h3>
            <p className="text-sm text-green-700">Track revenue, appointments, and doctor performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">New doctor registration</p>
                <p className="text-xs text-gray-600">Dr. Sarah Johnson registered 2 hours ago</p>
              </div>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Doctor approved</p>
                <p className="text-xs text-gray-600">Dr. Michael Chen's application approved</p>
              </div>
              <span className="text-xs text-gray-500">4h ago</span>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Revenue milestone</p>
                <p className="text-xs text-gray-600">Platform crossed ₹25,000 revenue mark</p>
              </div>
              <span className="text-xs text-gray-500">6h ago</span>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Pending applications</p>
                <p className="text-xs text-gray-600">3 new applications awaiting review</p>
              </div>
              <span className="text-xs text-gray-500">8h ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // Navigation items for sidebar
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout, path: '/admin/dashboard', color: 'text-green-400' },
    { id: 'doctors', label: 'Manage Doctors', icon: Users, path: '/admin/doctors', color: 'text-blue-400' },
    { id: 'onboarding', label: 'Add Doctor', icon: UserSquare, path: '/admin/onboarding', color: 'text-purple-400' },
    { id: 'leads', label: 'New Leads', icon: Clock, path: '/admin/leads', color: 'text-yellow-400' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/admin/analytics', color: 'text-orange-400' },
    { id: 'professionals', label: 'Professionals', icon: Package, path: '/admin/professionals', color: 'text-pink-400' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo and Collapse Button */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-white">TeleCare Admin</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-white hover:bg-gray-800 p-2"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          {!sidebarCollapsed && (
            <p className="text-xs text-gray-400">Logged in as Admin</p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {navigationItems.find(item => isActivePath(item.path))?.label || 'Admin Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <Button variant="ghost" onClick={() => navigate('/')}>
                View Main Site
              </Button>
              <Button variant="outline" onClick={handleLogout} data-testid="logout-btn">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
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
              <div className="space-y-6" data-testid="admin-dashboard-root">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
                  <h1 className="text-3xl font-bold mb-2">WELCOME!</h1>
                  <p className="text-lg opacity-90">Here is your analytics dashboard.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">16</p>
                        </div>
                        <ShoppingCart className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">₹27,688.00</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Products</p>
                          <p className="text-2xl font-bold text-gray-900">10</p>
                        </div>
                        <Package className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Customers</p>
                          <p className="text-2xl font-bold text-gray-900">7</p>
                        </div>
                        <Users className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Navigation Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Link to="/admin/dashboard">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
                      <CardContent className="p-6 text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                        <h3 className="text-xl font-semibold">Dashboard</h3>
                        <p className="text-gray-600 mt-2">View platform analytics</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to="/admin/onboarding">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
                      <CardContent className="p-6 text-center">
                        <UserSquare className="w-12 h-12 mx-auto mb-4 text-green-600" />
                        <h3 className="text-xl font-semibold">Add Doctor</h3>
                        <p className="text-gray-600 mt-2">27-field onboarding form</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to="/admin/doctors">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
                      <CardContent className="p-6 text-center">
                        <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                        <h3 className="text-xl font-semibold">Manage Doctors</h3>
                        <p className="text-gray-600 mt-2">View & edit professionals</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to="/admin/analytics">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
                      <CardContent className="p-6 text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                        <h3 className="text-xl font-semibold">Analytics</h3>
                        <p className="text-gray-600 mt-2">Reports & insights</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to="/admin/leads">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
                      <CardContent className="p-6 text-center">
                        <Clock className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                        <h3 className="text-xl font-semibold">New Leads</h3>
                        <p className="text-gray-600 mt-2">Review applications</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to="/admin/professionals">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
                      <CardContent className="p-6 text-center">
                        <Package className="w-12 h-12 mx-auto mb-4 text-pink-600" />
                        <h3 className="text-xl font-semibold">Professionals</h3>
                        <p className="text-gray-600 mt-2">Manage all professionals</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}