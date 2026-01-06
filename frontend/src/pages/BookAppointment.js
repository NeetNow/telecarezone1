import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { format, addDays, addMinutes, setHours, setMinutes } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function BookAppointment({ subdomain: propSubdomain }) {
  const navigate = useNavigate();
  const { subdomain: paramSubdomain } = useParams();
  const subdomain = propSubdomain || paramSubdomain;
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select slot, 2: Personal info
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    patient_first_name: '',
    patient_last_name: '',
    patient_phone: '',
    patient_email: '',
    patient_gender: '',
    patient_age: '',
    referral_source: '',
    issue_detail: ''
  });

  useEffect(() => {
    if (subdomain) {
      fetchProfessional();
    }
  }, [subdomain]);

  const fetchProfessional = async () => {
    try {
      const response = await axios.get(`${API}/public/professional/${subdomain}`);
      setProfessional(response.data);
    } catch (error) {
      console.error('Error fetching professional:', error);
      toast.error('Unable to load professional details');
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const today = new Date();
    
    // Generate slots for next 7 days
    for (let day = 0; day < 7; day++) {
      const date = addDays(today, day);
      
      // Generate time slots from 9 AM to 6 PM
      for (let hour = 9; hour < 18; hour++) {
        const slotTime = setMinutes(setHours(date, hour), 0);
        slots.push({
          datetime: slotTime.toISOString(),
          display: format(slotTime, 'MMM dd, yyyy - hh:mm a')
        });
      }
    }
    
    return slots;
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStepOne = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.patient_first_name || !formData.patient_last_name || !formData.patient_phone || !formData.patient_email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        professional_id: professional.id,
        appointment_datetime: selectedSlot.datetime,
        ...formData,
        patient_age: parseInt(formData.patient_age)
      };
      
      const response = await axios.post(`${API}/appointments`, appointmentData);
      toast.success('Appointment created! Proceeding to payment...');
      
      // Navigate to payment page
      setTimeout(() => {
        navigate(`/payment/${response.data.id}`);
      }, 1000);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!professional) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={() => navigate(paramSubdomain ? `/doctor/${subdomain}` : '/')} data-testid="back-btn">
                ← Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Book Appointment with Dr. {professional.first_name} {professional.last_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-6" data-testid="step-1-slot-selection">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Select Available Time Slot
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotSelect(slot)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          selectedSlot?.datetime === slot.datetime
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        data-testid={`time-slot-${index}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">{slot.display}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={handleStepOne}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    data-testid="continue-to-info-btn"
                  >
                    Continue to Personal Info
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="step-2-personal-info">
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm font-semibold text-blue-900">
                    Selected Slot: {selectedSlot?.display}
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setStep(1)}
                    className="text-blue-600 p-0 h-auto"
                    data-testid="change-slot-btn"
                  >
                    Change Slot
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient_first_name">First Name *</Label>
                      <Input
                        id="patient_first_name"
                        name="patient_first_name"
                        value={formData.patient_first_name}
                        onChange={handleChange}
                        required
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="patient_last_name">Last Name *</Label>
                      <Input
                        id="patient_last_name"
                        name="patient_last_name"
                        value={formData.patient_last_name}
                        onChange={handleChange}
                        required
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient_phone">Phone Number *</Label>
                      <Input
                        id="patient_phone"
                        name="patient_phone"
                        type="tel"
                        value={formData.patient_phone}
                        onChange={handleChange}
                        required
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="patient_email">Email *</Label>
                      <Input
                        id="patient_email"
                        name="patient_email"
                        type="email"
                        value={formData.patient_email}
                        onChange={handleChange}
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient_gender">Gender *</Label>
                      <Select name="patient_gender" value={formData.patient_gender} onValueChange={(value) => setFormData(prev => ({...prev, patient_gender: value}))} required>
                        <SelectTrigger data-testid="select-gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="patient_age">Age *</Label>
                      <Input
                        id="patient_age"
                        name="patient_age"
                        type="number"
                        value={formData.patient_age}
                        onChange={handleChange}
                        required
                        min="1"
                        max="120"
                        data-testid="input-age"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="referral_source">Where did you hear about us? *</Label>
                    <Select name="referral_source" value={formData.referral_source} onValueChange={(value) => setFormData(prev => ({...prev, referral_source: value}))} required>
                      <SelectTrigger data-testid="select-referral">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="search">Search Engine</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="friend">Friend/Family</SelectItem>
                        <SelectItem value="doctor">Another Doctor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="issue_detail">Describe your issue in detail *</Label>
                    <Textarea
                      id="issue_detail"
                      name="issue_detail"
                      value={formData.issue_detail}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Please describe your health concern..."
                      data-testid="input-issue"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    data-testid="back-to-slots-btn"
                  >
                    Back to Slots
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    data-testid="proceed-to-payment-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Payment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}