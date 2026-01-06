import React from 'react';
import { Card } from '@/components/ui/card';
import { Header, Footer } from '@/components/Layout';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="py-20 px-6 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
          <p className="text-xl text-gray-600">Last updated: January 5, 2026</p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-6 py-16">
        <Card className="p-8 border-0 shadow-lg prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Personal information (name, email, phone number)</li>
            <li>Medical history and health information</li>
            <li>Payment information</li>
            <li>Consultation records and prescriptions</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">We use the collected information to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Provide and improve our telemedicine services</li>
            <li>Process appointments and payments</li>
            <li>Communicate with you about consultations</li>
            <li>Ensure the security of our platform</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement industry-standard security measures to protect your personal
            and medical information. All data is encrypted during transmission and storage.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sharing of Information</h2>
          <p className="text-gray-600 mb-4">We do not sell your personal information. We may share your data with:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Healthcare professionals for consultation purposes</li>
            <li>Payment processors for transaction processing</li>
            <li>Law enforcement when required by law</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
          <p className="text-gray-600 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
          <p className="text-gray-600 mb-6">
            We use cookies and similar technologies to improve user experience and
            analyze platform usage. You can control cookies through your browser settings.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
          <p className="text-gray-600 mb-6">
            Our services are not intended for individuals under 18 years of age.
            Consultations for minors require parental consent.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Privacy Policy</h2>
          <p className="text-gray-600 mb-6">
            We may update this policy periodically. Users will be notified of significant
            changes via email or platform notification.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
          <p className="text-gray-600">
            For privacy-related inquiries, contact us at:
            <br />
            <span className="font-medium">Email:</span> privacy@mykitchenfarm.com
            <br />
            <span className="font-medium">Phone:</span> +91 1800-XXX-XXXX
          </p>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
