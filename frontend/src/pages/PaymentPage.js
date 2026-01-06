import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CreditCard, Loader2, CheckCircle, Shield } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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
      toast.error('Unable to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Create Razorpay order
      const orderRes = await axios.post(`${API}/payments/create-order?appointment_id=${appointmentId}`);
      const { order_id, amount, currency, key_id } = orderRes.data;

      // In production, this would integrate with actual Razorpay
      // For now, simulate payment success
      const mockPaymentId = `pay_${Date.now()}`;
      
      // Complete payment
      const completeRes = await axios.put(
        `${API}/appointments/${appointmentId}/complete-payment?payment_id=${mockPaymentId}&razorpay_order_id=${order_id}`
      );

      toast.success('Payment successful!');
      setTimeout(() => {
        navigate(`/confirmation/${appointmentId}`);
      }, 1000);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
      <div className="w-full max-w-2xl px-4">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Complete Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Appointment Summary */}
            <div className="bg-blue-50 p-6 rounded-lg space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-semibold">Dr. {professional.first_name} {professional.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Speciality:</span>
                  <span className="font-semibold">{professional.speciality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-semibold">{appointment.patient_first_name} {appointment.patient_last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-semibold">
                    {new Date(appointment.appointment_datetime).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-semibold">₹{professional.consulting_fees}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Platform Fee (10%):</span>
                  <span>₹{(professional.consulting_fees * 0.10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Doctor Receives (90%):</span>
                  <span>₹{(professional.consulting_fees * 0.90).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between text-2xl font-bold text-blue-600">
                    <span>Total Amount:</span>
                    <span>₹{professional.consulting_fees}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                <p className="text-sm text-gray-600">
                  Your payment is processed securely through Razorpay. We never store your card details.
                </p>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-lg"
              data-testid="pay-now-btn"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ₹{professional.consulting_fees}
                </>
              )}
            </Button>

            <p className="text-center text-sm text-gray-500">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}