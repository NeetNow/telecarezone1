import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Instagram, Youtube, Twitter, Linkedin, Facebook, Star, Play, Clock, MapPin, Mail, Phone, Award, Users, Heart, AlertCircle } from 'lucide-react';
import SocialMediaModal from '../components/SocialMediaModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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

  useEffect(() => {
    if (subdomain) {
      fetchProfessionalData();
    }
  }, [subdomain]);

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
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ color: themeColor }}>TeleCareZone</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" style={{ borderColor: themeColor, color: themeColor }}>
                Back to Home
              </Button>
              <Button style={{ backgroundColor: themeColor }} className="text-white">
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4" style={{ background: `linear-gradient(135deg, ${lightThemeColor} 0%, ${themeColor}40 100%)` }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <h1 className="text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: themeColor }}>
                  Dr. {professional.first_name} {professional.last_name}
                </h1>
                <p className="text-2xl text-gray-700 mb-6">{professional.speciality}</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6 justify-center lg:justify-start">
                {professional.ug_qualification && (
                  <span className="px-4 py-2 text-white rounded-full text-sm font-semibold shadow-lg" style={{ backgroundColor: themeColor }}>
                    {professional.ug_qualification}
                  </span>
                )}
                {professional.pg_qualification && (
                  <span className="px-4 py-2 text-white rounded-full text-sm font-semibold shadow-lg" style={{ backgroundColor: themeColor }}>
                    {professional.pg_qualification}
                  </span>
                )}
                {professional.superspeciality && (
                  <span className="px-4 py-2 text-white rounded-full text-sm font-semibold shadow-lg" style={{ backgroundColor: themeColor }}>
                    {professional.superspeciality}
                  </span>
                )}
              </div>
              
              <div className="mb-8 space-y-3">
                {professional.experience_years && (
                  <div className="flex items-center justify-center lg:justify-start text-gray-700">
                    <Award className="w-5 h-5 mr-3" style={{ color: themeColor }} />
                    <span className="text-lg"><strong>{professional.experience_years} years</strong> of experience</span>
                  </div>
                )}
                {professional.email && (
                  <div className="flex items-center justify-center lg:justify-start text-gray-700">
                    <Mail className="w-5 h-5 mr-3" style={{ color: themeColor }} />
                    <span>{professional.email}</span>
                  </div>
                )}
                {professional.phone && (
                  <div className="flex items-center justify-center lg:justify-start text-gray-700">
                    <Phone className="w-5 h-5 mr-3" style={{ color: themeColor }} />
                    <span>{professional.phone}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2" style={{ color: themeColor }}>₹{professional.consulting_fees}</p>
                  <p className="text-gray-600">Consultation Fee</p>
                </div>
                <Button 
                  size="lg"
                  className="text-white px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  style={{ backgroundColor: themeColor }}
                  onClick={() => navigate(paramSubdomain ? `/doctor/${subdomain}/book` : '/book')}
                  data-testid="book-appointment-btn"
                >
                  <Calendar className="w-6 h-6 mr-2" />
                  Book Appointment
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 justify-center lg:justify-start">
                
                {professional.instagram && (
                  <button 
                    onClick={() => handleSocialClick('instagram', professional.instagram)}
                    className="text-pink-600 hover:text-pink-700 transform hover:scale-110 transition-transform"
                    aria-label="Visit Instagram profile"
                  >
                    <Instagram className="w-8 h-8" />
                  </button>
                )}
                {professional.youtube && (
                  <button 
                    onClick={() => handleSocialClick('youtube', professional.youtube)}
                    className="text-red-600 hover:text-red-700 transform hover:scale-110 transition-transform"
                    aria-label="Visit YouTube channel"
                  >
                    <Youtube className="w-8 h-8" />
                  </button>
                )}
                {professional.twitter && (
                  <button 
                    onClick={() => handleSocialClick('twitter', professional.twitter)}
                    className="text-blue-600 hover:text-blue-700 transform hover:scale-110 transition-transform"
                    aria-label="Visit Twitter profile"
                  >
                    <Twitter className="w-8 h-8" />
                  </button>
                )}
                {professional.linkedin && (
                  <button 
                    onClick={() => handleSocialClick('linkedin', professional.linkedin)}
                    className="text-blue-700 hover:text-blue-800 transform hover:scale-110 transition-transform"
                    aria-label="Visit LinkedIn profile"
                  >
                    <Linkedin className="w-8 h-8" />
                  </button>
                )}
                {professional.facebook && (
                  <button 
                    onClick={() => handleSocialClick('facebook', professional.facebook)}
                    className="text-blue-800 hover:text-blue-900 transform hover:scale-110 transition-transform"
                    aria-label="Visit Facebook profile"
                  >
                    <Facebook className="w-8 h-8" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Right Content - Profile Card */}
            <div className="flex justify-center">
              <Card className="bg-white/95 backdrop-blur-sm shadow-2xl transform hover:scale-105 transition-transform duration-300" style={{ borderColor: themeColor, borderWidth: '3px' }}>
                <CardContent className="p-8">
                  <div className="text-center">
                    <Avatar className="w-40 h-40 border-4 shadow-xl mx-auto mb-6" style={{ borderColor: themeColor }}>
                      <AvatarImage src={professional.profile_photo} />
                      <AvatarFallback className="text-white text-4xl font-bold" style={{ backgroundColor: themeColor }}>
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: themeColor }}>Dr. {professional.first_name} {professional.last_name}</h2>
                    <p className="text-gray-600 mb-4">{professional.speciality}</p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <Users className="w-8 h-8 mx-auto mb-2" style={{ color: themeColor }} />
                        <p className="text-2xl font-bold" style={{ color: themeColor }}>500+</p>
                        <p className="text-sm text-gray-600">Patients</p>
                      </div>
                      <div className="text-center">
                        <Heart className="w-8 h-8 mx-auto mb-2" style={{ color: themeColor }} />
                        <p className="text-2xl font-bold" style={{ color: themeColor }}>98%</p>
                        <p className="text-sm text-gray-600">Satisfaction</p>
                      </div>
                      <div className="text-center">
                        <Award className="w-8 h-8 mx-auto mb-2" style={{ color: themeColor }} />
                        <p className="text-2xl font-bold" style={{ color: themeColor }}>{professional.experience_years || 0}</p>
                        <p className="text-sm text-gray-600">Years</p>
                      </div>
                    </div>
                    
                    {professional.bio && (
                      <p className="text-gray-700 italic">"{professional.bio}"</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: themeColor }}>
                About Dr. {professional.first_name} {professional.last_name}
              </h2>
              {professional.bio && (
                <p className="text-lg text-gray-700 mb-6">{professional.bio}</p>
              )}
              {professional.practice_description && (
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-3" style={{ color: themeColor }}>About Practice</h3>
                  <p className="text-gray-700">{professional.practice_description}</p>
                </div>
              )}
              {professional.area_of_expertise && (
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-3" style={{ color: themeColor }}>Area of Expertise</h3>
                  <p className="text-gray-700">{professional.area_of_expertise}</p>
                </div>
              )}
              
              {/* Availability Information */}
              {(formatAvailability() || professional.morning_slots || professional.evening_slots) && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: themeColor }}>Availability</h3>
                  {formatAvailability() && (
                    <p className="text-gray-700 mb-2">
                      <strong>Available Days:</strong> {formatAvailability()}
                    </p>
                  )}
                  {professional.morning_slots && (
                    <p className="text-gray-700 mb-2">
                      <strong>Morning Slots:</strong> {professional.morning_slots}
                    </p>
                  )}
                  {professional.evening_slots && (
                    <p className="text-gray-700">
                      <strong>Evening Slots:</strong> {professional.evening_slots}
                    </p>
                  )}
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
                    <Card key={index} className="overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-300">
                      <div className="relative aspect-video bg-gray-900">
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
                                className="text-blue-400 hover:text-blue-300 underline text-sm"
                              >
                                Watch on {video && video.includes('youtube') ? 'YouTube' : 'External Site'}
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                            <div className="text-center p-4">
                              <Play className="w-16 h-16 mx-auto mb-4" style={{ color: themeColor }} />
                              <p className="text-white text-lg">Video {index + 1}</p>
                              <p className="text-gray-400 text-sm mt-2">Upload video to display here</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2" style={{ color: themeColor }}>
                          {index === 0 ? 'Introduction' : index === 1 ? 'Practice Overview' : index === 2 ? 'Patient Care' : 'Testimonial'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {video ? 
                            (index === 0 ? 'Get to know Dr. ' + professional.last_name + ' personally' :
                             index === 1 ? 'Tour our practice and facilities' :
                             index === 2 ? 'See our approach to patient care' :
                             'Hear from our satisfied patients') :
                            'Video will be displayed here once uploaded'
                          }
                        </p>
                      </CardContent>
                    </Card>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {(professional.template_image_1 || professional.template_image_2) && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif', color: themeColor }}>
              Gallery
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Explore our clinic facilities and environment
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[professional.template_image_1, professional.template_image_2].map((image, index) => (
                image && (
                  <Card key={index} className="overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2" style={{ color: themeColor }}>
                        {index === 0 ? 'Clinic Environment' : 'Treatment Facilities'}
                      </h3>
                      <p className="text-gray-600">
                        {index === 0 ? 'Modern and comfortable environment for our patients' : 'State-of-the-art medical equipment and facilities'}
                      </p>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          </div>
        </section>
      )}

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
      {testimonials.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif', color: themeColor }}>
              Patient Testimonials
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              What our patients say about their experience with Dr. {professional.first_name} {professional.last_name}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-white shadow-xl transform hover:scale-105 transition-all duration-300" data-testid={`testimonial-${testimonial.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4" style={{ backgroundColor: lightThemeColor }}>
                        <span className="text-lg font-semibold" style={{ color: themeColor }}>
                          {testimonial.patient_name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.patient_name}</p>
                        <p className="text-sm text-gray-600">Verified Patient</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}80 100%)` }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Book an appointment with Dr. {professional.first_name} {professional.last_name} today and take the first step towards better health
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              size="lg"
              className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate(paramSubdomain ? `/doctor/${subdomain}/book` : '/book')}
            >
              <Calendar className="w-6 h-6 mr-2" />
              Book Appointment
            </Button>
            <div className="text-white">
              <p className="text-2xl font-bold">₹{professional.consulting_fees}</p>
              <p className="text-sm">Consultation Fee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: themeColor }}>TeleCareZone</h3>
              <p className="text-gray-400">Connecting patients with trusted healthcare professionals.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                {professional.instagram && (
                  <button 
                    onClick={() => handleSocialClick('instagram', professional.instagram)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Visit Instagram profile"
                  >
                    <Instagram className="w-6 h-6" />
                  </button>
                )}
                {professional.youtube && (
                  <button 
                    onClick={() => handleSocialClick('youtube', professional.youtube)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Visit YouTube channel"
                  >
                    <Youtube className="w-6 h-6" />
                  </button>
                )}
                {professional.twitter && (
                  <button 
                    onClick={() => handleSocialClick('twitter', professional.twitter)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Visit Twitter profile"
                  >
                    <Twitter className="w-6 h-6" />
                  </button>
                )}
                {professional.linkedin && (
                  <button 
                    onClick={() => handleSocialClick('linkedin', professional.linkedin)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Visit LinkedIn profile"
                  >
                    <Linkedin className="w-6 h-6" />
                  </button>
                )}
                {professional.facebook && (
                  <button 
                    onClick={() => handleSocialClick('facebook', professional.facebook)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Visit Facebook profile"
                  >
                    <Facebook className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TeleCareZone. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
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
