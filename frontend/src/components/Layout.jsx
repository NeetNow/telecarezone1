import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              TeleCare<span className="text-teal-600">Zone</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/blogs" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              Health Blog
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="hidden sm:flex border-teal-600 text-teal-600 hover:bg-teal-50"
              onClick={() => navigate('/join-expert')}
            >
              Join as Doctor
            </Button>
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => navigate('/')}
            >
              Consult Now
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                TeleCare<span className="text-teal-400">Zone</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              India's trusted telemedicine platform.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-teal-400">Video Consultation</a></li>
              <li><a href="#" className="hover:text-teal-400">Digital Prescriptions</a></li>
              <li><Link to="/join-expert" className="hover:text-teal-400">Join as Doctor</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-teal-400">About Us</Link></li>
              <li><Link to="/blogs" className="hover:text-teal-400">Health Blog</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-teal-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-teal-400">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>+91 1800-XXX-XXXX</li>
              <li>support@mykitchenfarm.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          © 2025 TeleCareZone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
