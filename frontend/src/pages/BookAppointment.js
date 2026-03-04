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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost/telecarezone11';
const API = `${BACKEND_URL}/api`;

export default function BookAppointment({ subdomain: propSubdomain }) {
  const navigate = useNavigate();
  const { subdomain: paramSubdomain } = useParams();
  const subdomain = propSubdomain || paramSubdomain;
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select slot, 2: Personal info
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [bookedSlots, setBookedSlots] = useState([]);
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

  useEffect(() => {
    if (professional && timeSlots.length > 0) {
      fetchBookedSlots();
    }
  }, [professional, selectedDayIndex]);

  const fetchProfessional = async () => {
    try {
      const response = await axios.get(`${API}/public/professional/${subdomain}`);
      setProfessional(response.data);
    } catch (error) {
      console.error('Error fetching professional:', error);
      toast.error('Unable to load professional details');
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const selectedDay = timeSlots[selectedDayIndex];
      if (!selectedDay) return;
      
      const response = await axios.get(`${API}/appointments/check-availability`, {
        params: {
          professional_id: professional.id,
          date: selectedDay.date
        }
      });
      setBookedSlots(response.data.booked_slots || []);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      // Don't show error to user, just continue with empty booked slots
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const today = new Date();
    
    // Generate slots for next 7 days
    for (let day = 0; day < 7; day++) {
      const date = addDays(today, day);
      const daySlots = [];
      
      // Generate time slots from 9 AM to 6 PM with 20-minute intervals
      for (let hour = 9; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 20) {
          const slotStartTime = setMinutes(setHours(date, hour), minute);
          const slotEndTime = addMinutes(slotStartTime, 20);
          
          daySlots.push({
            datetime: format(slotStartTime, 'yyyy-MM-dd HH:mm:00'),
            display: `${format(slotStartTime, 'hh:mm a')} to ${format(slotEndTime, 'hh:mm a')}`,
            date: format(slotStartTime, 'MMM dd, yyyy'),
            dayName: format(slotStartTime, 'EEEE')
          });
        }
      }
      
      slots.push({
        date: format(date, 'MMM dd, yyyy'),
        dayName: format(date, 'EEEE'),
        isToday: day === 0,
        slots: daySlots
      });
    }
    
    return slots;
  };

  const handleSlotSelect = (slot) => {
    // Check if slot is already booked
    if (bookedSlots.includes(slot.datetime)) {
      toast.error('This slot is already booked');
      return;
    }
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
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                    Select Available Time Slot
                  </h3>
                  
                  {/* Day Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {timeSlots.map((dayGroup, dayIndex) => (
                      <button
                        key={dayIndex}
                        onClick={() => setSelectedDayIndex(dayIndex)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          selectedDayIndex === dayIndex
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xs font-medium uppercase tracking-wide">
                            {dayGroup.dayName.substring(0, 3)}
                          </div>
                          <div className="text-lg font-bold">
                            {format(new Date(dayGroup.date), 'dd')}
                          </div>
                          <div className="text-xs">
                            {format(new Date(dayGroup.date), 'MMM')}
                          </div>
                          {dayGroup.isToday && (
                            <div className="text-xs font-semibold mt-1">
                              Today
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Selected Day's Slots */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className={`px-6 py-4 ${
                      timeSlots[selectedDayIndex]?.isToday 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                        : 'bg-gray-50 border-b border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold">{timeSlots[selectedDayIndex]?.dayName}</h4>
                          <p className={`text-sm ${
                            timeSlots[selectedDayIndex]?.isToday ? 'text-blue-100' : 'text-gray-600'
                          }`}>
                            {timeSlots[selectedDayIndex]?.date} {timeSlots[selectedDayIndex]?.isToday && '(Today)'}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          timeSlots[selectedDayIndex]?.isToday 
                            ? 'bg-white/20 text-white' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {timeSlots[selectedDayIndex]?.slots.length} slots
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {timeSlots[selectedDayIndex]?.slots.map((slot, slotIndex) => {
                          const isBooked = bookedSlots.includes(slot.datetime);
                          return (
                            <button
                              key={slotIndex}
                              onClick={() => handleSlotSelect({
                                ...slot,
                                fullDisplay: `${timeSlots[selectedDayIndex].date} - ${slot.display}`
                              })}
                              disabled={isBooked}
                              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-center group ${
                                isBooked
                                  ? 'border-red-300 bg-red-50 cursor-not-allowed opacity-60'
                                  : selectedSlot?.datetime === slot.datetime
                                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:scale-105 cursor-pointer'
                              }`}
                              data-testid={`time-slot-${selectedDayIndex}-${slotIndex}`}
                            >
                              <div className="flex flex-col items-center space-y-1">
                                {isBooked ? (
                                  <>
                                    <div className="w-5 h-5 text-red-500">
                                      <svg fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <span className="text-xs font-semibold text-red-600">
                                      Booked
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className={`w-5 h-5 ${
                                      selectedSlot?.datetime === slot.datetime 
                                        ? 'text-blue-600' 
                                        : 'text-gray-400 group-hover:text-blue-500'
                                    }`} />
                                    <span className={`text-xs font-semibold ${
                                      selectedSlot?.datetime === slot.datetime 
                                        ? 'text-blue-700' 
                                        : 'text-gray-700 group-hover:text-blue-600'
                                    }`}>
                                      {slot.display}
                                    </span>
                                  </>
                                )}
                              </div>
                              {selectedSlot?.datetime === slot.datetime && !isBooked && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedSlot && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Selected Time Slot</p>
                          <p className="text-lg font-semibold text-gray-800">{selectedSlot.fullDisplay || selectedSlot.display}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleStepOne}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    data-testid="continue-to-info-btn"
                  >
                    Continue to Personal Info
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="step-2-personal-info">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Selected Time Slot</p>
                        <p className="text-xl font-bold text-gray-800">{selectedSlot?.fullDisplay || selectedSlot?.display}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      data-testid="change-slot-btn"
                    >
                      Change Slot
                    </Button>
                  </div>
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
