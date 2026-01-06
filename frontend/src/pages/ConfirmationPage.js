import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Video, Mail, MessageCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ConfirmationPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentData();
    }
  }, [appointmentId]);

  const fetchAppointmentData = async () => {
    try {
      const appointmentRes = await axios.get(`${API}/appointments/${appointmentId}`);
      setAppointment(appointmentRes.data);
      
      const professionalRes = await axios.get(`${API}/public/professional/${appointmentRes.data.professional_id}`);
      setProfessional(professionalRes.data);
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!appointment || !professional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Appointment Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%)' }}>
      <div className="w-full max-w-3xl px-4">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center text-green-600" style={{ fontFamily: 'Playfair Display, serif' }}>
              Appointment Confirmed!
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Your consultation has been successfully booked
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Appointment Details */}
            <div className="bg-blue-50 p-6 rounded-lg space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointment Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Date & Time</p>
                    <p className="text-gray-700">
                      {new Date(appointment.appointment_datetime).toLocaleString('en-IN', {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Video className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Meeting Link</p>
                    {appointment.meeting_link ? (
                      <a 
                        href={appointment.meeting_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        data-testid="meeting-link"
                      >
                        {appointment.meeting_link}
                      </a>
                    ) : (
                      <p className="text-gray-700">Link will be sent shortly</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">WhatsApp Notification</p>
                    <p className="text-gray-700">
                      Confirmation sent to {appointment.patient_phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Email Confirmation</p>
                    <p className="text-gray-700">
                      Details sent to {appointment.patient_email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Doctor</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">
                    {professional.first_name.charAt(0)}{professional.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Dr. {professional.first_name} {professional.last_name}
                  </p>
                  <p className="text-gray-600">{professional.speciality}</p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">⚠️ Important Notes:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• You will receive a WhatsApp reminder 15 minutes before the appointment</li>
                <li>• Please join the meeting 2-3 minutes early</li>
                <li>• Ensure you have a stable internet connection</li>
                <li>• Keep your medical history and current medications ready</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="back-home-btn"
              >
                Back to Home
              </Button>
              {appointment.meeting_link && (
                <Button
                  onClick={() => window.open(appointment.meeting_link, '_blank')}
                  variant="outline"
                  className="flex-1"
                  data-testid="join-meeting-btn"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join Meeting
                </Button>
              )}
            </div>

            <p className="text-center text-sm text-gray-500">
              Booking ID: {appointment.id}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}