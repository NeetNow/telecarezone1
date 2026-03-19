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
  MessageCircle
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-50 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full opacity-50 blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4 mr-2" />
                Trusted by 10 Lakh+ Patients
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Consult Top Doctors
                <span className="block text-teal-600">Online, Anytime</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Skip the wait. Connect with India's best healthcare professionals via secure video consultation from the comfort of your home.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-teal-600 hover:bg-teal-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-teal-200 hover:shadow-xl transition-all"
                  onClick={() => document.getElementById('experts-section')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="hero-consult-btn"
                >
                  Start Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
<Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-xl border-2"
                  onClick={() => navigate('/doctor-auth')}
                  data-testid="hero-join-btn"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Join as Doctor - FREE
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Quick Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>4.8 Rating</span>
                </div>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="hidden lg:block relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl transform rotate-3 opacity-20" />
                <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center">
                      <Video className="w-8 h-8 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Video Consultation</p>
                      <p className="text-xl font-bold text-gray-900">In Progress...</p>
                    </div>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Play className="w-10 h-10 text-white ml-1" />
                      </div>
                      <p className="text-lg font-medium">HD Video Calls</p>
                      <p className="text-sm opacity-80">Secure & Private</p>
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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {specialties.map((specialty, index) => (
              <Card 
                key={index} 
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
