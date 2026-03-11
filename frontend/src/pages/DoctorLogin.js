import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://dev.telecarezone.com';
const API = `${BACKEND_URL}/api`;

export default function DoctorLogin() {
  const navigate = useNavigate();
  const { subdomain } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo login credentials
    const DEMO_EMAIL = 'doctor@demo.com';
    const DEMO_PASSWORD = '123456';

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate credentials
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        // Mock doctor data for demo login
        const mockDoctor = {
          id: 1,
          first_name: 'Demo',
          last_name: 'Doctor',
          email: email,
          phone: '9876543210',
          speciality: 'General Physician',
          subdomain: 'testdoctor'
        };

        // Store mock doctor data and token
        localStorage.setItem('doctor_token', 'mock_token_12345');
        localStorage.setItem('doctor_id', mockDoctor.id);
        localStorage.setItem('doctor_data', JSON.stringify(mockDoctor));
        
        toast.success('Login successful!');
        
        // Navigate to doctor dashboard
        navigate('/dashboard');
      } else {
        // Invalid credentials
        setError('Invalid Email or Password');
        toast.error('Invalid Email or Password');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid Email or Password');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Doctor Login
          </CardTitle>
          <p className="text-sm text-gray-600">
            Access your dashboard to manage appointments and patients
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
              style={{ backgroundColor: '#667eea' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate(subdomain ? `/doctor/${subdomain}` : '/')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to Profile
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

