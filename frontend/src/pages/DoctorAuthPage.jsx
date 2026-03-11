import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, ArrowLeft, LogIn, UserPlus } from 'lucide-react';

export default function DoctorAuthPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full opacity-50 blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="absolute -top-16 left-0 text-gray-600 hover:text-teal-600 hover:bg-teal-50"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Main Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                TeleCare<span className="text-teal-600">Zone</span>
              </h1>
              <p className="text-gray-600 mt-2">For Healthcare Professionals</p>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome, Doctor!
              </h2>
              <p className="text-gray-500 mt-1">
                Choose an option to continue
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              {/* Login Button */}
              <Button
                className="w-full h-14 text-lg bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => navigate('/doctor/login')}
              >
                <LogIn className="w-5 h-5 mr-3" />
                Login
              </Button>

              {/* Join as Doctor Button */}
              <Button
                className="w-full h-14 text-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl shadow-lg shadow-cyan-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => navigate('/join-expert')}
              >
                <UserPlus className="w-5 h-5 mr-3" />
                Join as Doctor
              </Button>
            </div>

            {/* Info Text */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Join thousands of healthcare professionals on TeleCareZone
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

