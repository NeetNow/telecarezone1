import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Instagram, Youtube, Twitter, Star } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function DoctorLanding({ subdomain: propSubdomain }) {
  const navigate = useNavigate();
  const { subdomain: paramSubdomain } = useParams();
  const subdomain = propSubdomain || paramSubdomain;
  const [professional, setProfessional] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error fetching professional:', error);
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

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%)' }}>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={professional.profile_photo} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Dr. {professional.first_name} {professional.last_name}
                  </h1>
                  <p className="text-xl text-gray-700 mb-2">{professional.speciality}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {professional.ug_qualification && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {professional.ug_qualification}
                      </span>
                    )}
                    {professional.pg_qualification && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {professional.pg_qualification}
                      </span>
                    )}
                    {professional.superspeciality && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {professional.superspeciality}
                      </span>
                    )}
                  </div>
                  {professional.experience_years && (
                    <p className="text-gray-600 mb-4">
                      <strong>Experience:</strong> {professional.experience_years} years
                    </p>
                  )}
                  {professional.bio && (
                    <p className="text-gray-700 mb-4">{professional.bio}</p>
                  )}
                  {professional.area_of_expertise && (
                    <p className="text-gray-700 mb-4">
                      <strong>Area of Expertise:</strong> {professional.area_of_expertise}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 justify-center md:justify-start mb-6">
                    {professional.instagram && (
                      <a href={`https://instagram.com/${professional.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                    {professional.youtube && (
                      <a href={`https://youtube.com/@${professional.youtube}`} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                        <Youtube className="w-6 h-6" />
                      </a>
                    )}
                    {professional.twitter && (
                      <a href={`https://twitter.com/${professional.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        <Twitter className="w-6 h-6" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">₹{professional.consulting_fees}</p>
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                    </div>
                    <Button 
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full"
                      onClick={() => navigate(paramSubdomain ? `/doctor/${subdomain}/book` : '/book')}
                      data-testid="book-appointment-btn"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Patient Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-white/95 backdrop-blur-sm" data-testid={`testimonial-${testimonial.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                    <p className="text-sm font-semibold text-gray-900">- {testimonial.patient_name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-gray-700">
        <p className="text-sm">Powered by TeleCareZone</p>
      </footer>
    </div>
  );
}