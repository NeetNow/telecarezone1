import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Download,
  RefreshCw
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week'); // week, month, quarter
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalAppointments: 0,
    totalPatients: 0,
    averageRating: 0,
    topDoctors: [],
    revenueByPeriod: [],
    appointmentsByDoctor: []
  });

  // Fetch analytics data
  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      
      // Fetch professionals
      const profResponse = await axios.get(
        `${BACKEND_URL}/api/admin/onboarding/list`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const professionals = profResponse.data.professionals || [];
      
      // Calculate mock analytics (replace with real API when available)
      const mockAnalytics = calculateMockAnalytics(professionals, timeframe);
      setAnalytics(mockAnalytics);
      
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate mock analytics (will be replaced with real backend API)
  const calculateMockAnalytics = (professionals, period) => {
    const multiplier = period === 'week' ? 1 : period === 'month' ? 4 : 12;
    
    return {
      totalRevenue: professionals.reduce((sum, p) => sum + (p.consulting_fees * 5 * multiplier), 0),
      totalAppointments: professionals.length * 5 * multiplier,
      totalPatients: professionals.length * 4 * multiplier,
      averageRating: 4.7,
      topDoctors: professionals
        .map(p => ({
          name: p.display_name || `${p.first_name} ${p.last_name}`,
          revenue: p.consulting_fees * 5 * multiplier,
          appointments: 5 * multiplier,
          rating: (4.5 + Math.random()).toFixed(1)
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      revenueByPeriod: generateRevenueData(professionals, period),
      appointmentsByDoctor: professionals.map(p => ({
        name: p.display_name || `${p.first_name} ${p.last_name}`,
        count: Math.floor(Math.random() * 20) + 5
      }))
    };
  };

  const generateRevenueData = (professionals, period) => {
    const periods = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const data = [];
    
    for (let i = 0; i < Math.min(periods, 10); i++) {
      data.push({
        period: period === 'week' ? `Day ${i + 1}` : `Period ${i + 1}`,
        revenue: Math.floor(Math.random() * 5000) + 2000
      });
    }
    
    return data;
  };

  const exportData = () => {
    alert('Analytics data export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Timeframe Selector */}
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
              <Button
                onClick={fetchAnalytics}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={exportData}
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Total Revenue */}
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Account Receivable</div>
              <DollarSign className="w-6 h-6 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">₹{analytics.totalRevenue.toLocaleString()}</div>
            <div className="text-xs opacity-80 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% from last period
            </div>
          </Card>

          {/* Total Appointments */}
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Total Appointments</div>
              <Calendar className="w-6 h-6 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{analytics.totalAppointments}</div>
            <div className="text-xs opacity-80 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8% from last period
            </div>
          </Card>

          {/* Total Patients */}
          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Total Patients</div>
              <Users className="w-6 h-6 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{analytics.totalPatients}</div>
            <div className="text-xs opacity-80 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +15% from last period
            </div>
          </Card>

          {/* Average Rating */}
          <Card className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Average Rating</div>
              <div className="text-xl">⭐</div>
            </div>
            <div className="text-3xl font-bold mb-1">{analytics.averageRating}/5</div>
            <div className="text-xs opacity-80">Excellent service quality</div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
            <div className="space-y-2">
              {analytics.revenueByPeriod.slice(0, 7).map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-600">{item.period}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-semibold transition-all duration-500"
                      style={{ width: `${(item.revenue / 5000) * 100}%` }}
                    >
                      ₹{item.revenue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Appointments by Doctor */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Appointments by Doctor</h2>
            <div className="space-y-2">
              {analytics.appointmentsByDoctor.slice(0, 7).map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-gray-600 truncate">{item.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-2 text-white text-xs font-semibold"
                      style={{ width: `${(item.count / 25) * 100}%` }}
                    >
                      {item.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Performing Doctors */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Doctors</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointments</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.topDoctors.map((doctor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        {index > 2 && <span className="text-gray-500 font-semibold">#{index + 1}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">₹{doctor.revenue.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.appointments}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium">{doctor.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(doctor.revenue / analytics.topDoctors[0].revenue) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((doctor.revenue / analytics.topDoctors[0].revenue) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
