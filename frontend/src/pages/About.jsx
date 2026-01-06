import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, Shield, Phone, Target, Lock, Zap } from 'lucide-react';
import { Header, Footer } from '@/components/Layout';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            About <span className="text-teal-600">TeleCareZone</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            India's Leading Telemedicine Platform Connecting Patients with Verified Healthcare Professionals
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                To make quality healthcare accessible to everyone, everywhere through innovative telemedicine solutions.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                We connect patients with verified healthcare professionals for instant consultations, breaking down geographical barriers and making healthcare more affordable and convenient.
              </p>
              <div className="flex gap-4 mt-8">
                <Button onClick={() => navigate('/join-expert')} className="bg-teal-600 hover:bg-teal-700">
                  Join as Professional
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" className="border-teal-600 text-teal-600">
                  Book Consultation
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4 items-start p-4 bg-green-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">Verified Professionals</h3>
                  <p className="text-gray-600">All healthcare professionals are verified and licensed</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 bg-blue-50 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">Secure & Private</h3>
                  <p className="text-gray-600">Your medical data is encrypted and completely confidential</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 bg-purple-50 rounded-xl">
                <Phone className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">24/7 Available</h3>
                  <p className="text-gray-600">Connect with doctors anytime, anywhere</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-teal-600 mb-2">500+</div>
              <div className="text-gray-600">Healthcare Professionals</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-cyan-600 mb-2">10,000+</div>
              <div className="text-gray-600">Happy Patients</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Specializations</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Patient First</h3>
              <p className="text-gray-600">Every decision we make puts patient welfare at the center</p>
            </Card>
            <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Privacy & Security</h3>
              <p className="text-gray-600">Your medical information is protected with bank-level encryption</p>
            </Card>
            <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Innovation</h3>
              <p className="text-gray-600">Leveraging technology to improve healthcare accessibility</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Better Healthcare?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied patients who trust TeleCareZone
          </p>
          <Button onClick={() => navigate('/')} size="lg" className="bg-white text-teal-600 hover:bg-gray-100 rounded-xl">
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
