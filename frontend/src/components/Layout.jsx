import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Stethoscope, Menu, X, Shield, CheckCircle, Phone, MessageCircle } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg' 
        : 'bg-white border-b border-gray-100 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-teal-200">
              <Stethoscope className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-gray-900 block leading-tight">
                TeleCare<span className="text-teal-600">Zone</span>
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">Your Health, Our Priority</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/blogs" 
              className="text-gray-600 hover:text-teal-600 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Health Blog
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-teal-600 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-600 hover:text-teal-600 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-50 hover:border-teal-700 hover:text-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
              onClick={() => navigate('/doctor-auth')}
            >
              Join as Doctor
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-teal-200"
              onClick={() => navigate('/')}
            >
              Consult Now
            </Button>
          </div>

          <button
            type="button"
            className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 ${
              isScrolled
                ? 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:scale-105'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:scale-105'
            }`}
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden border-t transition-all duration-300 ${
          isScrolled ? 'border-gray-100 bg-white/95 backdrop-blur-md' : 'border-gray-100 bg-white'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <Link
              to="/blogs"
              className="block text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 hover:pl-2 border-l-2 border-transparent hover:border-teal-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Health Blog
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 hover:pl-2 border-l-2 border-transparent hover:border-teal-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 hover:pl-2 border-l-2 border-transparent hover:border-teal-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 transition-all duration-300 hover:scale-105"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/doctor-auth');
                }}
              >
                Join as Doctor
              </Button>
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-all duration-300 hover:scale-105"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
              >
                Consult Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                TeleCare<span className="text-teal-400">Zone</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              India's trusted telemedicine platform connecting patients with verified healthcare professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Video Consultation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Instant Appointments</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Digital Prescriptions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Health Records</a></li>
              <li><Link to="/doctor-auth" className="text-gray-400 hover:text-teal-400 transition-colors">Join as Doctor</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><Link to="/blogs" className="text-gray-400 hover:text-teal-400 transition-colors">Health Blog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-teal-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-teal-400 mt-0.5" />
                <div>
                  <p className="text-gray-400">+91 1800-XXX-XXXX (Toll Free)</p>
                  <p className="text-gray-400">+91 9876543210</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-teal-400 mt-0.5" />
                <p className="text-gray-400">support@mykitchenfarm.com</p>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-gray-800 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">24/7 Support Available</p>
              <p className="text-teal-400 font-semibold">We're here to help!</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 TeleCareZone. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                100% Secure Payments
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                Verified Doctors
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
