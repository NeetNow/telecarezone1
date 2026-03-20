import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Footer, Header } from '@/components/Layout';
import { 
  Video, 
  Users, 
  Shield, 
  Clock, 
  Star, 
  CheckCircle, 
  Phone, 
  Calendar,
  Stethoscope,
  Brain,
  Heart,
  Eye,
  Baby,
  Bone,
  ArrowRight,
  Play,
  MessageCircle,
  Leaf,
  Home
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://dev.telecarezone.com';
const API = `${BACKEND_URL}/api`;

// Specialties data
const specialties = [
  { name: 'General Physician', icon: Stethoscope, color: 'bg-blue-100 text-blue-600' },
  { name: 'Dermatologist', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { name: 'Psychiatrist', icon: Brain, color: 'bg-purple-100 text-purple-600' },
  { name: 'Gynecologist', icon: Baby, color: 'bg-rose-100 text-rose-600' },
  { name: 'Orthopedist', icon: Bone, color: 'bg-amber-100 text-amber-600' },
  { name: 'Ophthalmologist', icon: Eye, color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Ayurveda', icon: Leaf, color: 'bg-green-100 text-green-600' },
  { name: 'Homeopathy', icon: Home, color: 'bg-orange-100 text-orange-600' },
];

// Testimonials data
const testimonials = [
  {
    name: 'Rahul Verma',
    location: 'Mumbai',
    rating: 5,
    text: 'Excellent experience! Got consultation within 10 minutes. The doctor was very thorough and helpful.',
    avatar: null
  },
  {
    name: 'Priyanka Singh',
    location: 'Delhi',
    rating: 5,
    text: 'Very convenient service. No need to travel or wait in long queues. Highly recommended!',
    avatar: null
  },
  {
    name: 'Amit Patel',
    location: 'Bangalore',
    rating: 5,
    text: 'The video consultation was clear and the doctor gave me a detailed prescription. Great platform!',
    avatar: null
  }
];

// Stats data
const stats = [
  { value: '10K+', label: 'Consultations Done' },
  { value: '500+', label: 'Verified Doctors' },
  { value: '4.8', label: 'Average Rating', icon: Star },
  { value: '24/7', label: 'Available' }
];

export default function MainLanding() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSpecialtyIndex, setCurrentSpecialtyIndex] = useState(0);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const response = await axios.get(`${API}/professionals/approved`);
      const payload = response?.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.professionals)
            ? payload.professionals
            : null;

      if (list) {
        setProfessionals(list);
      } else {
        console.error('Unexpected response format:', payload);
        setProfessionals([]);
      }
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  const handleNextSpecialties = () => {
    setCurrentSpecialtyIndex((prev) => 
      prev + 4 >= specialties.length ? 0 : prev + 4
    );
  };

  const handlePrevSpecialties = () => {
    setCurrentSpecialtyIndex((prev) => 
      prev - 4 < 0 ? Math.max(0, specialties.length - 4) : prev - 4
    );
  };

  const visibleSpecialties = specialties.slice(currentSpecialtyIndex, currentSpecialtyIndex + 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-50 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full opacity-50 blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full opacity-30 blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-sm font-semibold mb-8 shadow-lg border border-teal-200 transform hover:scale-105 transition-all duration-300">
                <CheckCircle className="w-5 h-5 mr-3 animate-pulse" />
                Trusted by 10 Lakh+ Patients
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8 animate-fade-in-up">
                <span className="block mb-2">Consult Top Doctors</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Online, Anytime</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed animate-fade-in-up delay-200">
                Skip the wait. Connect with India's best healthcare professionals via secure video consultation from the comfort of your home.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-12 animate-fade-in-up delay-300">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-lg px-10 py-6 rounded-xl shadow-xl shadow-teal-200 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-teal-600"
                  onClick={() => document.getElementById('experts-section')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="hero-consult-btn"
                >
                  Start Consultation
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-10 py-6 rounded-xl border-2 border-gray-300 hover:border-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                  onClick={() => navigate('/doctor-auth')}
                  data-testid="hero-join-btn"
                >
                  <Play className="mr-3 w-6 h-6" />
                  Join as Doctor - FREE
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-500 animate-fade-in-up delay-400">
                <div className="flex items-center gap-2 group">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-700">100% Secure</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Quick Response</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors duration-300">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  </div>
                  <span className="font-medium text-gray-700">4.8 Rating</span>
                </div>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="hidden lg:block relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl transform rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500" />
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform group-hover:scale-105 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Video Consultation</p>
                      <p className="text-xl font-bold text-gray-900">In Progress...</p>
                    </div>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    <div className="text-center text-white relative z-10">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-12 h-12 text-white ml-1 group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <p className="text-xl font-bold mb-2">HD Video Calls</p>
                      <p className="text-sm opacity-90">Secure & Private</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                  {stat.icon && <stat.icon className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Consult Specialists Across All Fields
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From general physicians to specialists, find the right doctor for your health concerns
            </p>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-center">
              <button
                onClick={handlePrevSpecialties}
                className="absolute left-0 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={specialties.length <= 4}
              >
                <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
              </button>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mx-12">
                {visibleSpecialties.map((specialty, index) => (
                  <Card 
                    key={`${currentSpecialtyIndex}-${index}`} 
                    className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-0 bg-white"
                    onClick={() => document.getElementById('experts-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-14 h-14 ${specialty.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                        <specialty.icon className="w-7 h-7" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">{specialty.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <button
                onClick={handleNextSpecialties}
                className="absolute right-0 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={specialties.length <= 4}
              >
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Pagination dots */}
            {specialties.length > 4 && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: Math.ceil(specialties.length / 4) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSpecialtyIndex(index * 4)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSpecialtyIndex === index * 4 
                        ? 'bg-teal-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started with your online consultation in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choose a Doctor',
                description: 'Browse through our verified specialists and select based on your health concern',
                icon: Users,
                color: 'bg-teal-500'
              },
              {
                step: '2',
                title: 'Book Appointment',
                description: 'Select a convenient time slot and pay securely online',
                icon: Calendar,
                color: 'bg-cyan-500'
              },
              {
                step: '3',
                title: 'Start Consultation',
                description: 'Join the video call at scheduled time and get your prescription',
                icon: Video,
                color: 'bg-blue-500'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gray-200" />
                )}
                <Card className="relative bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Experts Section */}
      <section id="experts-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Healthcare Experts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All our doctors are verified with valid medical registrations and years of experience
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No experts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionals.map((prof) => (
                <Card 
                  key={prof.id} 
                  className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  data-testid={`expert-card-${prof.id}`}
                >
                  <CardContent className="p-0">
                    {/* Card Header with Theme Color */}
                    <div 
                      className="h-2" 
                      style={{ backgroundColor: prof.theme_color || '#0d9488' }}
                    />
                    
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-16 h-16 border-2 border-gray-100">
                          <AvatarImage src={prof.profile_photo} />
                          <AvatarFallback 
                            className="text-lg font-bold text-white"
                            style={{ backgroundColor: prof.theme_color || '#0d9488' }}
                          >
                            {getInitials(prof.first_name, prof.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            Dr. {prof.first_name} {prof.last_name}
                          </h3>
                          <p className="text-teal-600 font-medium">{prof.speciality}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-gray-600">4.8 (120+ reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        {prof.experience_years && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{prof.experience_years} years experience</span>
                          </div>
                        )}
                        {prof.area_of_expertise && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                            <span className="line-clamp-1">{prof.area_of_expertise}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">Consultation Fee</p>
                          <p className="text-xl font-bold text-gray-900">₹{prof.consulting_fees}</p>
                        </div>
                        <Button 
                          className="text-white rounded-xl"
                          style={{ backgroundColor: prof.theme_color || '#0d9488' }}
                          onClick={() => navigate(`/doctor/${prof.subdomain}`)}
                          data-testid={`view-profile-btn-${prof.id}`}
                        >
                          Consult Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-gray-600">Real experiences from real patients</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 bg-teal-100">
                      <AvatarFallback className="bg-teal-100 text-teal-600 font-bold">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-teal-600 to-cyan-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Consult a Doctor?
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Get expert medical advice from the comfort of your home. Book your consultation now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl"
              onClick={() => document.getElementById('experts-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
<Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
              onClick={() => navigate('/doctor-auth')}
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Join as Doctor
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
