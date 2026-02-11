import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Theme color options (20 colors)
const THEME_COLORS = [
  '#667eea', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4',
  '#84CC16', '#A855F7', '#F43F5E', '#22C55E', '#FACC15',
  '#6366F1', '#EAB308', '#10B981', '#8B5CF6', '#F59E0B'
];

// Country options
const COUNTRIES = ['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Singapore'];

// Indian states
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir'
];

// Days of the week
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorOnboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdSubdomain, setCreatedSubdomain] = useState('');

  const [formData, setFormData] = useState({
    // Basic Info (Fields 1-7)
    profile_photo: '',
    first_name: '',
    last_name: '',
    email: '',
    country: 'India',
    state: '',
    display_name: '',
    
    // Professional Info (Fields 8-9)
    profession_qualification: '',
    bio: '',
    
    // Theme (Field 10)
    theme_color: '#667eea',
    
    // Social Media (Fields 11-15)
    instagram: '',
    youtube: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    
    // Bank Details (Fields 16-19)
    bank_account_name: '',
    bank_account_number: '',
    bank_ifsc_code: '',
    bank_branch: '',
    
    // Appointment Settings (Fields 20-22)
    appointment_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    morning_time: '9:00 AM - 1:00 PM',
    evening_time: '5:00 PM - 9:00 PM',
    
    // Media Links (Fields 23-26)
    intro_video: '',
    testimonial_1: '',
    testimonial_2: '',
    testimonial_3: '',
    
    // Consulting Fee (Field 27)
    consulting_fees: 500
  });

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('profile_photo', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/onboarding/upload`,
        uploadData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      handleChange('profile_photo', response.data.files.profile_photo);
      alert('Profile photo uploaded successfully!');
    } catch (error) {
      alert('File upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  // Handle day selection
  const toggleDay = (day) => {
    const currentDays = formData.appointment_days;
    if (currentDays.includes(day)) {
      handleChange('appointment_days', currentDays.filter(d => d !== day));
    } else {
      handleChange('appointment_days', [...currentDays, day]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.display_name) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/onboarding/create`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      setCreatedSubdomain(response.data.subdomain);
      alert(`Success! Professional created with subdomain: ${response.data.subdomain}`);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        navigate('/admin/doctors');
      }, 3000);

    } catch (error) {
      alert('Failed to create professional: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Professional Created Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Landing page URL: <br />
            <span className="font-mono text-sm text-purple-600">
              {createdSubdomain}.mykitchenfarm.com
            </span>
          </p>
          <Button onClick={() => navigate('/admin/doctors')} className="w-full">
            View All Doctors
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Onboarding</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto p-6 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Profile Photo Upload */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">1. Profile Photo *</h2>
            <div className="flex items-center gap-4">
              <Input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1"
              />
              {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
            </div>
            {formData.profile_photo && (
              <div className="mt-4">
                <img 
                  src={formData.profile_photo} 
                  alt="Profile Preview" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
                />
              </div>
            )}
          </Card>

          {/* 2-7. Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>2. First Name *</Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label>3. Last Name *</Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <Label>4. Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <Label>5. Country *</Label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>6. State *</Label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>7. Display Name *</Label>
                <Input
                  value={formData.display_name}
                  onChange={(e) => handleChange('display_name', e.target.value)}
                  placeholder="Dr. John Doe"
                  required
                />
              </div>
            </div>
          </Card>

          {/* 8-9. Professional Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
            <div className="space-y-4">
              <div>
                <Label>8. Profession + Qualification</Label>
                <Input
                  value={formData.profession_qualification}
                  onChange={(e) => handleChange('profession_qualification', e.target.value)}
                  placeholder="MBBS, MD (General Medicine)"
                />
              </div>
              <div>
                <Label>9. Bio (Long Text)</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={5}
                  placeholder="Write a professional bio about experience, specialization, approach to patient care..."
                />
              </div>
            </div>
          </Card>

          {/* 10. Theme Color Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">10. Display Theme (Choose from 20 colors)</h2>
            <Label className="mb-3 block">Selected Color: {formData.theme_color}</Label>
            <div className="grid grid-cols-10 gap-3">
              {THEME_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-12 h-12 rounded-lg border-4 transition-all ${
                    formData.theme_color === color ? 'border-gray-900 scale-110' : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange('theme_color', color)}
                  title={color}
                />
              ))}
            </div>
          </Card>

          {/* 11-15. Social Media URLs */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media URLs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>11. Instagram URL</Label>
                <Input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <Label>12. YouTube URL</Label>
                <Input
                  type="url"
                  value={formData.youtube}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/channel"
                />
              </div>
              <div>
                <Label>13. LinkedIn URL</Label>
                <Input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label>14. Facebook URL</Label>
                <Input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <Label>15. Twitter URL</Label>
                <Input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </Card>

          {/* 16-19. Bank Account Details */}
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              🔒 Bank Account Details
            </h2>
            <p className="text-sm text-gray-600 mb-4">Confidential information - Handle with care</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>16. Account Name</Label>
                <Input
                  value={formData.bank_account_name}
                  onChange={(e) => handleChange('bank_account_name', e.target.value)}
                  placeholder="Account holder name"
                />
              </div>
              <div>
                <Label>17. Account Number</Label>
                <Input
                  type="text"
                  value={formData.bank_account_number}
                  onChange={(e) => handleChange('bank_account_number', e.target.value)}
                  placeholder="Bank account number"
                />
              </div>
              <div>
                <Label>18. IFSC Code</Label>
                <Input
                  value={formData.bank_ifsc_code}
                  onChange={(e) => handleChange('bank_ifsc_code', e.target.value)}
                  placeholder="IFSC Code"
                />
              </div>
              <div>
                <Label>19. Home Branch</Label>
                <Input
                  value={formData.bank_branch}
                  onChange={(e) => handleChange('bank_branch', e.target.value)}
                  placeholder="Branch name"
                />
              </div>
            </div>
          </Card>

          {/* 20-22. Appointment Schedule */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Appointment Schedule</h2>
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">20. Appointment Days (Multi-select)</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        formData.appointment_days.includes(day)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                      }`}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {formData.appointment_days.join(', ') || 'None'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>21. Morning Time</Label>
                  <Input
                    value={formData.morning_time}
                    onChange={(e) => handleChange('morning_time', e.target.value)}
                    placeholder="e.g., 9:00 AM - 1:00 PM"
                  />
                </div>
                <div>
                  <Label>22. Evening Time</Label>
                  <Input
                    value={formData.evening_time}
                    onChange={(e) => handleChange('evening_time', e.target.value)}
                    placeholder="e.g., 5:00 PM - 9:00 PM"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 23-26. Video Links */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Video Links</h2>
            <div className="space-y-4">
              <div>
                <Label>23. Intro Video Link (URL)</Label>
                <Input
                  type="url"
                  value={formData.intro_video}
                  onChange={(e) => handleChange('intro_video', e.target.value)}
                  placeholder="YouTube or Vimeo video URL"
                />
              </div>
              <div>
                <Label>24. Testimonial Video 1 (URL)</Label>
                <Input
                  type="url"
                  value={formData.testimonial_1}
                  onChange={(e) => handleChange('testimonial_1', e.target.value)}
                  placeholder="Patient testimonial video URL"
                />
              </div>
              <div>
                <Label>25. Testimonial Video 2 (URL)</Label>
                <Input
                  type="url"
                  value={formData.testimonial_2}
                  onChange={(e) => handleChange('testimonial_2', e.target.value)}
                  placeholder="Patient testimonial video URL"
                />
              </div>
              <div>
                <Label>26. Testimonial Video 3 (URL)</Label>
                <Input
                  type="url"
                  value={formData.testimonial_3}
                  onChange={(e) => handleChange('testimonial_3', e.target.value)}
                  placeholder="Patient testimonial video URL"
                />
              </div>
            </div>
          </Card>

          {/* 27. Consulting Fee */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">27. Consulting Fee</h2>
            <div>
              <Label>Consultation Fee (₹)</Label>
              <Input
                type="number"
                value={formData.consulting_fees}
                onChange={(e) => handleChange('consulting_fees', parseFloat(e.target.value))}
                min="0"
                step="50"
                placeholder="500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Current fee: ₹{formData.consulting_fees}
              </p>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg font-semibold"
              disabled={loading || uploading}
            >
              {loading ? 'Creating Professional Profile...' : 'Create Professional Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
