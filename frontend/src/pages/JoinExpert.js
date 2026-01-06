import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function JoinExpert() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    speciality: '',
    ug_qualification: '',
    pg_qualification: '',
    superspeciality: '',
    area_of_expertise: '',
    instagram: '',
    youtube: '',
    twitter: '',
    consulting_fees: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.phone || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        consulting_fees: parseFloat(formData.consulting_fees) || 0
      };
      
      await axios.post(`${API}/onboarding/submit`, submitData);
      toast.success('Application submitted successfully! We will review and get back to you.');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/')}
              data-testid="back-to-home-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Join as Healthcare Expert
            </CardTitle>
            <CardDescription className="text-base">
              Fill in your details to create your personalized profile. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="expert-onboarding-form">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Qualifications */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Professional Qualifications</h3>
                <div>
                  <Label htmlFor="speciality">Speciality</Label>
                  <Input
                    id="speciality"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleChange}
                    placeholder="e.g., Cardiologist, Dermatologist"
                    data-testid="input-speciality"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ug_qualification">Undergraduate Qualification (UG)</Label>
                    <Input
                      id="ug_qualification"
                      name="ug_qualification"
                      value={formData.ug_qualification}
                      onChange={handleChange}
                      placeholder="e.g., MBBS"
                      data-testid="input-ug"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pg_qualification">Postgraduate Qualification (PG)</Label>
                    <Input
                      id="pg_qualification"
                      name="pg_qualification"
                      value={formData.pg_qualification}
                      onChange={handleChange}
                      placeholder="e.g., MD, MS"
                      data-testid="input-pg"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="superspeciality">Superspeciality</Label>
                  <Input
                    id="superspeciality"
                    name="superspeciality"
                    value={formData.superspeciality}
                    onChange={handleChange}
                    placeholder="e.g., DM Cardiology"
                    data-testid="input-superspeciality"
                  />
                </div>
                <div>
                  <Label htmlFor="area_of_expertise">Area of Expertise</Label>
                  <Textarea
                    id="area_of_expertise"
                    name="area_of_expertise"
                    value={formData.area_of_expertise}
                    onChange={handleChange}
                    placeholder="Describe your areas of expertise"
                    rows={3}
                    data-testid="input-expertise"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Social Media (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="instagram">Instagram Username</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="@username"
                      data-testid="input-instagram"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube">YouTube Channel</Label>
                    <Input
                      id="youtube"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleChange}
                      placeholder="Channel name"
                      data-testid="input-youtube"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter Username</Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="@username"
                      data-testid="input-twitter"
                    />
                  </div>
                </div>
              </div>

              {/* Consulting Fees */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Consulting Fees</h3>
                <div>
                  <Label htmlFor="consulting_fees">Consultation Fee (₹)</Label>
                  <Input
                    id="consulting_fees"
                    name="consulting_fees"
                    type="number"
                    value={formData.consulting_fees}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    min="0"
                    step="0.01"
                    data-testid="input-fees"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Platform fee: 10% | You receive: 90%
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  data-testid="cancel-btn"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                  data-testid="submit-application-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}