import React from 'react';
import { Card } from '@/components/ui/card';
import { Header, Footer } from '@/components/Layout';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="py-20 px-6 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Terms of Service</h1>
          <p className="text-xl text-gray-600">Last updated: January 5, 2026</p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-6 py-16">
        <Card className="p-8 border-0 shadow-lg prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing and using TeleCareZone platform, you accept and agree to be
            bound by the terms and provisions of this agreement.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
          <p className="text-gray-600 mb-6">
            TeleCareZone provides a platform connecting patients with licensed healthcare
            professionals for virtual consultations. We do not practice medicine or provide
            medical advice directly.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
          <p className="text-gray-600 mb-4">As a user, you agree to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the confidentiality of your account</li>
            <li>Use the platform only for lawful purposes</li>
            <li>Follow medical advice provided by healthcare professionals</li>
            <li>Pay all applicable fees for services</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Healthcare Professional Verification</h2>
          <p className="text-gray-600 mb-6">
            We verify the credentials of healthcare professionals on our platform.
            However, users should independently verify qualifications when making
            healthcare decisions.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Medical Disclaimer</h2>
          <p className="text-gray-600 mb-6">
            Teleconsultations have limitations. In case of emergencies, contact local
            emergency services immediately. The platform is not a substitute for
            in-person medical care when required.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>All fees must be paid before consultation</li>
            <li>Refunds are subject to our refund policy</li>
            <li>Failed or cancelled appointments may be charged</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
          <p className="text-gray-600 mb-6">
            All content on the platform, including text, graphics, logos, and software,
            is the property of TeleCareZone and protected by copyright laws.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            TeleCareZone is not liable for any direct, indirect, or consequential damages
            arising from the use of our platform or services provided by healthcare
            professionals.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to terminate or suspend access to our platform for
            violation of these terms or any unlawful activity.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
          <p className="text-gray-600 mb-6">
            These terms shall be governed by and construed in accordance with the laws
            of India. Disputes shall be subject to the jurisdiction of Mumbai courts.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
          <p className="text-gray-600">
            For questions about these terms, contact:
            <br />
            <span className="font-medium">Email:</span> legal@mykitchenfarm.com
            <br />
            <span className="font-medium">Phone:</span> +91 1800-XXX-XXXX
          </p>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
