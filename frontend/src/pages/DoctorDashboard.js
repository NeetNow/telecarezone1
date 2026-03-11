import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  Settings, 
  LogOut,
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Phone,
  BookOpen,
  Save,
  X,
  Check,
  Plus
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://dev.telecarezone.com';
const API = `${BACKEND_URL}/api`;

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { subdomain } = useParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    speciality: '',
    password: ''
  });
  
  const [newAppointment, setNewAppointment] = useState({
    patient_first_name: '',
    patient_last_name: '',
    patient_phone: '',
    patient_email: '',
    patient_gender: 'male',
    patient_age: '',
    appointment_datetime: '',
    issue_detail: ''
  });
  
  const [availability, setAvailability] = useState({
    available_days: [],
    morning_slots: '',
    evening_slots: ''
  });
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    // Clear localStorage when accessing a new subdomain to prevent caching
    if (subdomain) {
      localStorage.removeItem('doctor_data');
      localStorage.removeItem('doctor_id');
    }
    checkAuth();
  }, [subdomain]);

const checkAuth = async () => {
    // Always fetch fresh data from subdomain if available
    if (subdomain) {
      try {
        // Fetch doctor data from API using subdomain - always get fresh data
        const profRes = await axios.get(`${API}/public/professional/${subdomain}`);
        const professional = profRes.data;
        
        if (!professional || !professional.id) {
          toast.error('Doctor not found');
          navigate(subdomain ? `/doctor/${subdomain}` : '/');
          return;
        }
        
        setDoctor(professional);
        setProfileForm(professional);
        
        // Set availability from doctor data
        let availableDays = [];
        try {
          availableDays = professional.appointment_days ? JSON.parse(professional.appointment_days) : days;
        } catch (e) {
          availableDays = days;
        }
        setAvailability({
          available_days: availableDays,
          morning_slots: professional.morning_time || '9:00 AM - 1:00 PM',
          evening_slots: professional.evening_time || '5:00 PM - 9:00 PM'
        });
        
        // Store for later use
        localStorage.setItem('doctor_id', professional.id);
        localStorage.setItem('doctor_data', JSON.stringify(professional));
        
        await fetchDashboardData(professional.id, null);
      } catch (error) {
        console.error('Error fetching professional:', error);
        toast.error('Failed to load doctor data');
        navigate(subdomain ? `/doctor/${subdomain}` : '/');
      }
      return;
    }

    // Fallback: check localStorage if no subdomain
    const doctorData = localStorage.getItem('doctor_data');
    const doctorId = localStorage.getItem('doctor_id');

    if (doctorData) {
      setDoctor(JSON.parse(doctorData));
      setProfileForm(JSON.parse(doctorData));
      setAvailability({
        available_days: JSON.parse(JSON.stringify(days)), // default all days
        morning_slots: '9:00 AM - 1:00 PM',
        evening_slots: '5:00 PM - 9:00 PM'
      });
    }

    if (doctorId) {
      await fetchDashboardData(doctorId, null);
    }
  };

const fetchDashboardData = async (doctorId, token) => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Only fetch analytics if we have a token (authenticated)
      if (token) {
        try {
          const analyticsRes = await axios.get(`${API}/admin/analytics/${doctorId}`, { headers });
          setAnalytics(analyticsRes.data);
        } catch (e) {
          setAnalytics({
            total_appointments: 0,
            completed_appointments: 0,
            doctor_revenue: 0
          });
        }
      } else {
        // Set empty data when not authenticated
        setAnalytics({
          total_appointments: 0,
          completed_appointments: 0,
          doctor_revenue: 0
        });
      }
      
      // Skip fetching appointments and patients - these endpoints require authentication
      // Show empty data for now
      setAppointments([]);
      setPatients([]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty data if API fails (no auth)
      setAnalytics({
        total_appointments: 0,
        completed_appointments: 0,
        doctor_revenue: 0
      });
      setAppointments([]);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctor_token');
    localStorage.removeItem('doctor_id');
    localStorage.removeItem('doctor_data');
    toast.success('Logged out successfully');
    navigate(subdomain ? `/doctor/${subdomain}` : '/');
  };

  const updateProfile = async () => {
    const token = localStorage.getItem('doctor_token');
    const doctorId = localStorage.getItem('doctor_id');
    
    try {
      const updateData = { ...profileForm };
      // Only update password if provided
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await axios.put(`${API}/professionals/${doctorId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local storage
      localStorage.setItem('doctor_data', JSON.stringify(profileForm));
      setDoctor(profileForm);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const createAppointment = async () => {
    const token = localStorage.getItem('doctor_token');
    const doctorId = localStorage.getItem('doctor_id');
    
    try {
      await axios.post(`${API}/appointments`, {
        ...newAppointment,
        professional_id: doctorId,
        referral_source: 'doctor_dashboard'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Appointment created successfully');
      setNewAppointment({
        patient_first_name: '',
        patient_last_name: '',
        patient_phone: '',
        patient_email: '',
        patient_gender: 'male',
        patient_age: '',
        appointment_datetime: '',
        issue_detail: ''
      });
      
      // Refresh appointments
      const appointmentsRes = await axios.get(`${API}/appointments/professional/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointmentsRes.data || []);
      
      setActiveTab('appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error(error.response?.data?.error || 'Failed to create appointment');
    }
  };

  const updateAvailability = async () => {
    const token = localStorage.getItem('doctor_token');
    const doctorId = localStorage.getItem('doctor_id');
    
    try {
      await axios.put(`${API}/professionals/${doctorId}`, {
        available_days: JSON.stringify(availability.available_days),
        morning_slots: availability.morning_slots,
        evening_slots: availability.evening_slots
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Availability updated successfully');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const toggleDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter(d => d !== day)
        : [...prev.available_days, day]
    }));
  };

  // Calculate monthly revenue from appointments
  const calculateMonthlyRevenue = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyAppointments = appointments.filter(appt => {
      const apptDate = new Date(appt.appointment_datetime);
      return apptDate.getMonth() === currentMonth && 
             apptDate.getFullYear() === currentYear &&
             appt.payment_status === 'completed';
    });
    
    return monthlyAppointments.length * (doctor?.consulting_fees || 500);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'profile', label: 'My Profile', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-lg transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-4 border-b">
          {sidebarCollapsed ? (
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              {doctor?.first_name?.charAt(0) || 'D'}
            </div>
          ) : (
            <h2 className="text-xl font-bold text-indigo-600">Doctor Portal</h2>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
        
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 border-t text-gray-500 hover:text-gray-700"
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome, Dr. {doctor?.first_name} {doctor?.last_name}
                </h1>
                <p className="text-gray-600">{doctor?.speciality || 'General Practitioner'}</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{analytics?.doctor_revenue?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ₹{calculateMonthlyRevenue().toFixed(2)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Appointments</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {analytics?.total_appointments || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {analytics?.completed_appointments || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart Section */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Revenue Chart</p>
                    <p className="text-sm text-gray-400">Total: ₹{analytics?.doctor_revenue?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Appointments</CardTitle>
                <Button size="sm" onClick={() => setActiveTab('appointments')}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No appointments yet</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.slice(0, 5).map((appt, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {appt.patient_first_name} {appt.patient_last_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(appt.appointment_datetime).toLocaleDateString()} at{' '}
                              {new Date(appt.appointment_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <Badge variant={appt.status === 'completed' ? 'default' : 'secondary'}>
                          {appt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            
            {/* Schedule New Appointment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Schedule New Appointment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Patient First Name</Label>
                    <Input
                      value={newAppointment.patient_first_name}
                      onChange={(e) => setNewAppointment({...newAppointment, patient_first_name: e.target.value})}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label>Patient Last Name</Label>
                    <Input
                      value={newAppointment.patient_last_name}
                      onChange={(e) => setNewAppointment({...newAppointment, patient_last_name: e.target.value})}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={newAppointment.patient_phone}
                      onChange={(e) => setNewAppointment({...newAppointment, patient_phone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newAppointment.patient_email}
                      onChange={(e) => setNewAppointment({...newAppointment, patient_email: e.target.value})}
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newAppointment.patient_gender}
                      onChange={(e) => setNewAppointment({...newAppointment, patient_gender: e.target.value})}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={newAppointment.patient_age}
                      onChange={(e) => setNewAppointment({...newAppointment, patient_age: e.target.value})}
                      placeholder="Age"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Appointment Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={newAppointment.appointment_datetime}
                      onChange={(e) => setNewAppointment({...newAppointment, appointment_datetime: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Notes / Issue Details</Label>
                    <Textarea
                      value={newAppointment.issue_detail}
                      onChange={(e) => setNewAppointment({...newAppointment, issue_detail: e.target.value})}
                      placeholder="Describe the issue or reason for visit"
                      rows={3}
                    />
                  </div>
                </div>
                <Button 
                  className="mt-4" 
                  onClick={createAppointment}
                  style={{ backgroundColor: '#667eea' }}
                >
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No appointments found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Patient</th>
                          <th className="text-left p-3">Date & Time</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appt, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <p className="font-medium">{appt.patient_first_name} {appt.patient_last_name}</p>
                              <p className="text-sm text-gray-600">{appt.patient_phone}</p>
                            </td>
                            <td className="p-3">
                              {new Date(appt.appointment_datetime).toLocaleDateString()} at{' '}
                              {new Date(appt.appointment_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-3">
                              <Badge variant={appt.status === 'completed' ? 'default' : 'secondary'}>
                                {appt.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge variant={appt.payment_status === 'completed' ? 'default' : 'destructive'}>
                                {appt.payment_status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            
            <Card>
              <CardContent className="p-0">
                {patients.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No patients found</p>
                    <p className="text-sm text-gray-400">Patients will appear here after booking appointments</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4">Name</th>
                          <th className="text-left p-4">Age</th>
                          <th className="text-left p-4">Gender</th>
                          <th className="text-left p-4">Contact</th>
                          <th className="text-left p-4">Medical History</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map((patient, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="p-4 font-medium">
                              {patient.first_name} {patient.last_name}
                            </td>
                            <td className="p-4">{patient.age}</td>
                            <td className="p-4 capitalize">{patient.gender}</td>
                            <td className="p-4">
                              <p className="text-sm">{patient.phone}</p>
                              <p className="text-sm text-gray-600">{patient.email}</p>
                            </td>
<td className="p-4 text-sm text-gray-600">
                              {patient.medical_history || 'No history recorded'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Set Your Available Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 mb-6">
                  {days.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-full border transition-colors ${
                        availability.available_days.includes(day)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Morning Slots</Label>
                    <Input
                      value={availability.morning_slots}
                      onChange={(e) => setAvailability({...availability, morning_slots: e.target.value})}
                      placeholder="e.g., 9:00 AM - 1:00 PM"
                    />
                  </div>
                  <div>
                    <Label>Evening Slots</Label>
                    <Input
                      value={availability.evening_slots}
                      onChange={(e) => setAvailability({...availability, evening_slots: e.target.value})}
                      placeholder="e.g., 5:00 PM - 9:00 PM"
                    />
                  </div>
                </div>
                
                <Button 
                  className="mt-4" 
                  onClick={updateAvailability}
                  style={{ backgroundColor: '#667eea' }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Availability
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Change Personal Information</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={profileForm.first_name}
                      onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={profileForm.last_name}
                      onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Specialization</Label>
                    <Input
                      value={profileForm.speciality}
                      onChange={(e) => setProfileForm({...profileForm, speciality: e.target.value})}
                      placeholder="e.g., General Medicine, Cardiology"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>New Password (leave blank to keep current)</Label>
                    <Input
                      type="password"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                
                <Button 
                  className="mt-4" 
                  onClick={updateProfile}
                  style={{ backgroundColor: '#667eea' }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

