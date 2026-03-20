import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Instagram, Youtube, Twitter, Linkedin, Facebook, Star, Play, Clock, MapPin, Mail, Phone, Award, Users, Heart, AlertCircle, ChevronRight, CheckCircle, Activity, FileText, Video, MessageCircle, Menu, X } from 'lucide-react';
import SocialMediaModal from '../components/SocialMediaModal';
import { Footer } from '@/components/Layout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://dev.telecarezone.com';
const API = `${BACKEND_URL}/api`;

export default function DoctorLanding({ subdomain: propSubdomain }) {
  const navigate = useNavigate();
  const { subdomain: paramSubdomain } = useParams();
  const subdomain = propSubdomain || paramSubdomain;
  const [professional, setProfessional] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoErrors, setVideoErrors] = useState({});
  const [socialModal, setSocialModal] = useState({ isOpen: false, platform: '', username: '' });
  const [activeTab, setActiveTab] = useState('about');
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (subdomain) {
      fetchProfessionalData();
    }
  }, [subdomain]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

  const fetchProfessionalData = async () => {
    try {
      const [profRes, testimonialRes] = await Promise.all([
        axios.get(`${API}/public/professional/${subdomain}`),
        axios.get(`${API}/testimonials/${subdomain}`).catch(() => ({ data: [] }))
      ]);
      
      setProfessional(profRes.data);
      setTestimonials(testimonialRes.data);
      
      // Debug: Log professional data to check social media fields
      console.log('Professional data:', profRes.data);
      console.log('Social media fields:', {
        instagram: profRes.data.instagram,
        youtube: profRes.data.youtube,
        twitter: profRes.data.twitter,
        linkedin: profRes.data.linkedin,
        facebook: profRes.data.facebook
      });
    } catch (error) {
      console.error('Error fetching professional:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoError = (videoIndex) => {
    setVideoErrors(prev => ({ ...prev, [videoIndex]: true }));
  };

  const handleSocialClick = (platform, username) => {
    setSocialModal({ isOpen: true, platform, username });
  };

  const closeSocialModal = () => {
    setSocialModal({ isOpen: false, platform: '', username: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Professional Not Found</h1>
          <p className="text-gray-600">This profile is not available or pending approval.</p>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    return `${professional.first_name?.charAt(0) || ''}${professional.last_name?.charAt(0) || ''}`;
  };

  // Get theme color or use default
  const themeColor = professional.theme_color || '#667eea';
  const lightThemeColor = themeColor + '20'; // Add transparency for backgrounds
  const darkThemeColor = themeColor + 'cc'; // Darker shade for gradients
  
  // Animated gradient colors
  const gradientColors = {
    primary: `linear-gradient(135deg, ${themeColor} 0%, ${darkThemeColor} 100%)`,
    light: `linear-gradient(135deg, ${lightThemeColor} 0%, ${themeColor}15 100%)`,
    reverse: `linear-gradient(135deg, ${darkThemeColor} 0%, ${themeColor} 100%)`
  };
  
  // Format availability
  const formatAvailability = () => {
    if (!professional.available_days) return null;
    try {
      const days = typeof professional.available_days === 'string' 
        ? JSON.parse(professional.available_days) 
        : professional.available_days;
      return days.join(', ');
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1
                className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'}`}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                TeleCareZone
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {['about', 'services', 'testimonials', 'contact'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    const element = document.getElementById(tab);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`capitalize transition-all duration-300 hover:scale-105 ${
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <Button
                className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate(paramSubdomain ? `/doctor/${subdomain}/book` : '/book')}
              >
                Book Now
              </Button>
            </div>

            <button
              type="button"
              className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-colors ${
                isScrolled
                  ? 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  : 'border-white/30 text-white hover:bg-white/10'
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
          <div className={`md:hidden border-t ${isScrolled ? 'border-gray-100 bg-white' : 'border-white/20 bg-black/20 backdrop-blur-md'}`}>
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              {['about', 'services', 'testimonials', 'contact'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    const element = document.getElementById(tab);
                    element?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left capitalize font-medium transition-colors ${
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <div className="pt-2">
                <Button
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 rounded-xl shadow-lg"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(paramSubdomain ? `/doctor/${subdomain}/book` : '/book');
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 pt-20 overflow-hidden" style={{ background: gradientColors.primary }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left text-white">
              <div className="mb-8 animate-fade-in-up">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <Activity className="w-5 h-5 mr-2" />
                  <span className="text-sm font-semibold">Available for Consultation</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Dr. {professional.first_name} {professional.last_name}
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 mb-2">{professional.speciality}</p>
                {professional.profession_qualification && (
                  <p className="text-lg sm:text-xl text-white/80 mb-8">{professional.profession_qualification}</p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                {professional.ug_qualification && (
                  <span className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/30">
                    {professional.ug_qualification}
                  </span>
                )}
                {professional.pg_qualification && (
                  <span className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/30">
                    {professional.pg_qualification}
                  </span>
                )}
                {professional.superspeciality && (
                  <span className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/30">
                    {professional.superspeciality}
                  </span>
                )}
              </div>
              
              <div className="mb-10 space-y-4">
                {professional.experience_years && (
                  <div className="flex items-center justify-center lg:justify-start text-white/90 group">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-300">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-lg"><strong>{professional.experience_years}+ years</strong> of experience</span>
                  </div>
                )}
                {professional.email && (
                  <div className="flex items-center justify-center lg:justify-start text-white/90 group">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-300">
                      <Mail className="w-6 h-6" />
                    </div>
                    <span>{professional.email}</span>
                  </div>
                )}
                {professional.phone && (
                  <div className="flex items-center justify-center lg:justify-start text-white/90 group">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <span>{professional.phone}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center space-y-6 mb-10">
                <div className="text-center bg-white/20 backdrop-blur-sm px-6 py-4 sm:px-8 sm:py-6 rounded-2xl border border-white/30">
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">₹{professional.consulting_fees}</p>
                  <p className="text-sm sm:text-base text-white/80">Consultation Fee</p>
                </div>
                <Button 
                  size="lg"
                  className="bg-white text-gray-900 px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-100"
                  onClick={() => navigate(paramSubdomain ? `/doctor/${subdomain}/book` : '/book')}
                  data-testid="book-appointment-btn"
                >
                  <Calendar className="w-7 h-7 mr-3" />
                  Book Appointment
                  <ChevronRight className="w-7 h-7 ml-2" />
                </Button>
                
                <div className="flex items-center space-x-6">
                  {professional.instagram && (
                    <button 
                      onClick={() => handleSocialClick('instagram', professional.instagram)}
                      className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transform hover:scale-110 transition-all duration-300 border border-white/30"
                      aria-label="Visit Instagram profile"
                    >
                      <Instagram className="w-7 h-7" />
                    </button>
                  )}
                  {professional.youtube && (
                    <button 
                      onClick={() => handleSocialClick('youtube', professional.youtube)}
                      className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transform hover:scale-110 transition-all duration-300 border border-white/30"
                      aria-label="Visit YouTube channel"
                    >
                      <Youtube className="w-7 h-7" />
                    </button>
                  )}
                  {professional.twitter && (
                    <button 
                      onClick={() => handleSocialClick('twitter', professional.twitter)}
                      className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transform hover:scale-110 transition-all duration-300 border border-white/30"
                      aria-label="Visit Twitter profile"
                    >
                      <Twitter className="w-7 h-7" />
                    </button>
                  )}
                  {professional.linkedin && (
                    <button 
                      onClick={() => handleSocialClick('linkedin', professional.linkedin)}
                      className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transform hover:scale-110 transition-all duration-300 border border-white/30"
                      aria-label="Visit LinkedIn profile"
                    >
                      <Linkedin className="w-7 h-7" />
                    </button>
                  )}
                  {professional.facebook && (
                    <button 
                      onClick={() => handleSocialClick('facebook', professional.facebook)}
                      className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transform hover:scale-110 transition-all duration-300 border border-white/30"
                      aria-label="Visit Facebook profile"
                    >
                      <Facebook className="w-7 h-7" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Content - 3D Profile Card */}
            <div className="flex justify-center">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                
                <Card className="relative bg-white/95 backdrop-blur-sm shadow-2xl transform hover:scale-105 transition-all duration-500 rounded-3xl overflow-hidden" style={{ borderColor: themeColor, borderWidth: '3px' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="text-center">
                      {/* Profile Avatar with Animation */}
                      <div className="relative mb-6 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition duration-300"></div>
                        <Avatar className="relative w-40 h-40 border-4 shadow-2xl mx-auto transform hover:scale-110 transition-transform duration-300" style={{ borderColor: themeColor }}>
                          <AvatarImage src={professional.profile_photo} />
                          <AvatarFallback className="text-white text-4xl font-bold" style={{ backgroundColor: themeColor }}>
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full animate-pulse"></div>
                      </div>
                      
                      <h2 className="text-3xl font-bold mb-2" style={{ color: themeColor }}>Dr. {professional.first_name} {professional.last_name}</h2>
                      <p className="text-gray-600 mb-2 text-lg">{professional.speciality}</p>
                      {professional.profession_qualification && (
                        <p className="text-gray-500 mb-6 text-sm">{professional.profession_qualification}</p>
                      )}
                      
                      {/* Interactive Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                          { icon: Users, value: '500+', label: 'Patients', id: 'patients' },
                          { icon: Heart, value: '98%', label: 'Satisfaction', id: 'satisfaction' },
                          { icon: Award, value: `${professional.experience_years || 0}+`, label: 'Years', id: 'years' }
                        ].map((stat) => (
                          <div 
                            key={stat.id}
                            className="text-center group cursor-pointer"
                            onMouseEnter={() => setHoveredStat(stat.id)}
                            onMouseLeave={() => setHoveredStat(null)}
                          >
                            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                              hoveredStat === stat.id ? 'scale-125 shadow-lg' : ''
                            }`} style={{ backgroundColor: lightThemeColor }}>
                              <stat.icon className="w-6 h-6" style={{ color: themeColor }} />
                            </div>
                            <p className="text-2xl font-bold transition-all duration-300" 
                               style={{ 
                                 color: themeColor,
                                 transform: hoveredStat === stat.id ? 'scale(1.1)' : 'scale(1)'
                               }}>
                              {stat.value}
                            </p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                      
                      {professional.bio && (
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                          <p className="relative text-gray-700 italic text-lg p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
                            "{professional.bio}"
                          </p>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-col space-y-3">
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          onClick={() => navigate(paramSubdomain ? `/doctor/${subdomain}/book` : '/book')}
                        >
                          <Calendar className="w-5 h-5 mr-2" />
                          Schedule Consultation
                        </Button>
                        <div className="flex space-x-3">
                          <Button 
                            variant="outline" 
                            className="flex-1 border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Video Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-sm font-semibold text-gray-700">Get to Know Your Doctor</span>
            </div>
            <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: themeColor }}>
              About Dr. {professional.first_name} {professional.last_name}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare with compassion and expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {professional.bio && (
                <div className="group">
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: themeColor }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: lightThemeColor }}>
                        <Users className="w-5 h-5" style={{ color: themeColor }} />
                      </div>
                      Personal Story
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">{professional.bio}</p>
                  </div>
                </div>
              )}
              
              {professional.practice_description && (
                <div className="group">
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: themeColor }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: lightThemeColor }}>
                        <Heart className="w-5 h-5" style={{ color: themeColor }} />
                      </div>
                      Practice Philosophy
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">{professional.practice_description}</p>
                  </div>
                </div>
              )}
              
              {professional.area_of_expertise && (
                <div className="group">
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: themeColor }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: lightThemeColor }}>
                        <Award className="w-5 h-5" style={{ color: themeColor }} />
                      </div>
                      Areas of Expertise
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">{professional.area_of_expertise}</p>
                  </div>
                </div>
              )}
              
              {/* Availability Information */}
              {(formatAvailability() || professional.morning_slots || professional.evening_slots) && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg border border-purple-100">
                  <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: themeColor }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-white">
                      <Clock className="w-5 h-5" style={{ color: themeColor }} />
                    </div>
                    Availability Schedule
                  </h3>
                  <div className="space-y-4">
                    {formatAvailability() && (
                      <div className="flex items-center justify-between bg-white p-4 rounded-xl">
                        <span className="font-semibold text-gray-700">Available Days:</span>
                        <span className="text-gray-600">{formatAvailability()}</span>
                      </div>
                    )}
                    {professional.morning_slots && (
                      <div className="flex items-center justify-between bg-white p-4 rounded-xl">
                        <span className="font-semibold text-gray-700">Morning Slots:</span>
                        <span className="text-gray-600">{professional.morning_slots}</span>
                      </div>
                    )}
                    {professional.evening_slots && (
                      <div className="flex items-center justify-between bg-white p-4 rounded-xl">
                        <span className="font-semibold text-gray-700">Evening Slots:</span>
                        <span className="text-gray-600">{professional.evening_slots}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Video Frames */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => {
                const videoFields = [
                  professional.intro_video,
                  professional.testimonial_1,
                  professional.testimonial_2,
                  professional.testimonial_3,
                  professional.youtube
                ];
                
                const videos = videoFields.filter(v => v && v.trim() !== '');
                const displayVideos = videos.length > 0 ? videos.slice(0, 4) : videoFields.slice(0, 4);
                
                return displayVideos.map((video, index) => {
                  let youtubeId = null;
                  
                  if (video && video.includes('youtu.be/')) {
                    youtubeId = video.split('youtu.be/')[1]?.split('?')[0];
                  } else if (video && video.includes('youtube.com/watch?v=')) {
                    youtubeId = video.split('v=')[1]?.split('&')[0];
                  }
                  
                  return (
                    <div key={index} className="group">
                      <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="aspect-video bg-gray-900">
                          {video && youtubeId && !videoErrors[index] ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${youtubeId}`}
                              title={`Video ${index + 1}`}
                              className="absolute inset-0 w-full h-full"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              style={{ border: 'none' }}
                              onError={() => handleVideoError(index)}
                            />
                          ) : video && !videoErrors[index] ? (
                            <video
                              controls
                              className="absolute inset-0 w-full h-full"
                              style={{ width: '100%', height: '100%' }}
                              onError={() => handleVideoError(index)}
                            >
                              <source src={video} type="video/mp4" />
                              <p className="text-white text-center p-4">Video URL: {video}</p>
                            </video>
                          ) : videoErrors[index] ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                              <div className="text-center p-4">
                                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                                <p className="text-white text-lg mb-2">Video Blocked</p>
                                <p className="text-gray-400 text-sm mb-4">This video may be blocked by your browser extensions</p>
                                <a 
                                  href={video && video.includes('youtube') ? `https://www.youtube.com/watch?v=${youtubeId}` : video}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-400 hover:text-blue-300 underline text-sm bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"
                                >
                                  Watch on {video && video.includes('youtube') ? 'YouTube' : 'External Site'}
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                              <div className="text-center p-4">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                                  <Play className="w-10 h-10" style={{ color: themeColor }} />
                                </div>
                                <p className="text-white text-lg font-semibold mb-2">Video {index + 1}</p>
                                <p className="text-gray-400 text-sm">Upload video to display here</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-lg font-semibold mb-1 text-white">
                            {index === 0 ? 'Introduction' : index === 1 ? 'Practice Overview' : index === 2 ? 'Patient Care' : 'Testimonial'}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {video ? 
                              (index === 0 ? 'Get to know Dr. ' + professional.last_name + ' personally' :
                               index === 1 ? 'Tour our practice and facilities' :
                               index === 2 ? 'See our approach to patient care' :
                               'Hear from our satisfied patients') :
                              'Video will be displayed here once uploaded'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full shadow-lg mb-6">
              <Heart className="w-5 h-5 mr-2 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Comprehensive Healthcare</span>
            </div>
            <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: themeColor }}>
              Services & Specialties
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert medical care tailored to your specific health needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'General Consultation',
                description: 'Comprehensive health assessment and personalized treatment plans',
                features: ['Full body checkup', 'Health screening', 'Preventive care']
              },
              {
                icon: Video,
                title: 'Video Consultation',
                description: 'Convenient online consultations from the comfort of your home',
                features: ['HD video calls', 'Instant prescriptions', 'Follow-up care']
              },
              {
                icon: MessageCircle,
                title: 'Chat Support',
                description: 'Quick medical advice and health queries via text chat',
                features: ['24/7 availability', 'Quick responses', 'Health tips']
              },
              {
                icon: Calendar,
                title: 'Appointment Booking',
                description: 'Easy scheduling system with flexible time slots',
                features: ['Online booking', 'Reminders', 'Rescheduling']
              },
              {
                icon: Activity,
                title: 'Health Monitoring',
                description: 'Continuous monitoring and tracking of your health progress',
                features: ['Progress tracking', 'Health reports', 'Alerts']
              },
              {
                icon: Award,
                title: 'Specialized Care',
                description: 'Expert treatment in specific medical conditions',
                features: ['Specialized treatment', 'Advanced procedures', 'Expert care']
              }
            ].map((service, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: lightThemeColor }}>
                    <service.icon className="w-8 h-8" style={{ color: themeColor }} />
                  </div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: themeColor }}>{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Information Section */}
      {(professional.informatory_image_1 || professional.informatory_image_2) && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif', color: themeColor }}>
              Health Information
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Educational resources and health tips from Dr. {professional.first_name} {professional.last_name}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[professional.informatory_image_1, professional.informatory_image_2].map((image, index) => (
                image && (
                  <Card key={index} className="overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Information ${index + 1}`} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2" style={{ color: themeColor }}>
                        {index === 0 ? 'Health Tips' : 'Medical Insights'}
                      </h3>
                      <p className="text-gray-600">
                        {index === 0 ? 'Expert advice on maintaining optimal health' : 'Latest medical research and treatment approaches'}
                      </p>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-sm font-semibold text-gray-700">Patient Success Stories</span>
            </div>
            <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: themeColor }}>
              Patient Testimonials
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from patients who trusted Dr. {professional.first_name} {professional.last_name} with their healthcare
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="group" data-testid={`testimonial-${testimonial.id}`}>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current transform hover:scale-110 transition-transform duration-200" />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-gray-600">{testimonial.rating}.0</span>
                  </div>
                  <p className="text-gray-700 mb-8 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: lightThemeColor }}>
                        <span className="text-lg font-bold" style={{ color: themeColor }}>
                          {testimonial.patient_name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{testimonial.patient_name}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Verified Patient
                        </p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden" style={{ background: gradientColors.primary }}>
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <Calendar className="w-6 h-6 mr-3" />
              <span className="text-lg font-semibold">Ready to prioritize your health?</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Start Your Health Journey Today
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Book an appointment with Dr. {professional.first_name} {professional.last_name} and take the first step towards better health and wellness
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8 mb-12">
            <Button 
              size="lg"
              className="bg-white text-gray-900 px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-100 group"
              onClick={() => navigate(paramSubdomain ? `/doctor/${subdomain}/book` : '/book')}
            >
              <Calendar className="w-7 h-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              Book Appointment Now
              <ChevronRight className="w-7 h-7 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl border border-white/30">
              <p className="text-3xl font-bold text-white mb-2">₹{professional.consulting_fees}</p>
              <p className="text-white/80">Consultation Fee</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>Flexible Scheduling</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full shadow-lg mb-6">
              <Mail className="w-5 h-5 mr-2 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Get in Touch</span>
            </div>
            <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: themeColor }}>
              Contact Information
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reach out to us for any questions or to schedule an appointment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Phone,
                title: 'Phone',
                value: professional.phone || '+91 98765 43210',
                action: 'Call Now',
                href: `tel:${professional.phone || '+919876543210'}`
              },
              {
                icon: Mail,
                title: 'Email',
                value: professional.email || 'doctor@telecarezone.com',
                action: 'Send Email',
                href: `mailto:${professional.email || 'doctor@telecarezone.com'}`
              },
              {
                icon: MapPin,
                title: 'Clinic Address',
                value: '123 Medical Center, Healthcare City, Mumbai - 400001',
                action: 'Get Directions',
                href: '#'
              },
              {
                icon: Clock,
                title: 'Working Hours',
                value: 'Mon-Sat: 9AM-8PM, Sun: 10AM-2PM',
                action: 'View Schedule',
                href: '#services'
              }
            ].map((contact, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center h-full">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: lightThemeColor }}>
                    <contact.icon className="w-8 h-8" style={{ color: themeColor }} />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900">{contact.title}</h3>
                  <p className="text-gray-600 mb-6">{contact.value}</p>
                  <a 
                    href={contact.href}
                    className="inline-flex items-center text-sm font-semibold hover:underline transition-all duration-300"
                    style={{ color: themeColor }}
                  >
                    {contact.action}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />

      {/* Social Media Modal */}
      <SocialMediaModal 
        isOpen={socialModal.isOpen}
        onClose={closeSocialModal}
        platform={socialModal.platform}
        username={socialModal.username}
      />
    </div>
  );
}
