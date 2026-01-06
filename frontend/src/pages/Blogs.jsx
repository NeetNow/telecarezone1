import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '@/components/Layout';

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Benefits of Teleconsultation in Modern Healthcare",
    excerpt: "Discover how telemedicine is revolutionizing healthcare delivery and making quality medical care accessible to everyone, regardless of location.",
    content: `
      <h2>The Rise of Teleconsultation</h2>
      <p>Teleconsultation has emerged as a game-changer in healthcare, especially in the post-pandemic era. Here are the top 10 benefits:</p>
      
      <h3>1. Convenience and Time-Saving</h3>
      <p>No need to travel to clinics or wait in long queues. Consult with doctors from the comfort of your home.</p>
      
      <h3>2. Access to Specialists</h3>
      <p>Get expert opinions from specialists across the country without geographical barriers.</p>
      
      <h3>3. Cost-Effective</h3>
      <p>Save on transportation costs and time off work. Consultation fees are often lower than in-person visits.</p>
      
      <h3>4. Reduced Risk of Infection</h3>
      <p>Especially important during flu season or pandemics, teleconsultation minimizes exposure to contagious diseases.</p>
      
      <h3>5. Better Follow-up Care</h3>
      <p>Easy scheduling of follow-up appointments ensures continuity of care.</p>
      
      <h3>6. Immediate Access in Emergencies</h3>
      <p>Get quick medical advice when you need it most, even at odd hours.</p>
      
      <h3>7. Privacy and Confidentiality</h3>
      <p>Discuss sensitive health issues privately from your own space.</p>
      
      <h3>8. Digital Health Records</h3>
      <p>All your consultations and prescriptions are digitally recorded for easy access.</p>
      
      <h3>9. Reduced Burden on Healthcare Facilities</h3>
      <p>By handling routine consultations online, hospitals can focus on critical cases.</p>
      
      <h3>10. Environmental Benefits</h3>
      <p>Reduced travel means lower carbon emissions, contributing to a healthier planet.</p>
    `,
    author: "Dr. Priya Sharma",
    date: "December 15, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop",
    category: "Telemedicine"
  },
  {
    id: 2,
    title: "How to Prepare for Your First Virtual Consultation",
    excerpt: "A complete guide to making the most of your teleconsultation experience, including technical requirements and consultation tips.",
    content: `
      <h2>Getting Ready for Teleconsultation</h2>
      <p>Your first virtual doctor visit? Here's everything you need to know to ensure a smooth experience.</p>
      
      <h3>Before the Appointment</h3>
      <h4>1. Technical Setup</h4>
      <ul>
        <li>Ensure stable internet connection (minimum 2 Mbps)</li>
        <li>Test your camera and microphone</li>
        <li>Download required apps or use web-based platform</li>
        <li>Close unnecessary applications to improve performance</li>
      </ul>
      
      <h4>2. Prepare Your Information</h4>
      <ul>
        <li>List of current medications with dosages</li>
        <li>Recent lab reports or test results</li>
        <li>List of symptoms with duration and severity</li>
        <li>Previous medical history</li>
        <li>Insurance information (if applicable)</li>
      </ul>
      
      <h4>3. Environment Setup</h4>
      <ul>
        <li>Choose a quiet, well-lit room</li>
        <li>Ensure privacy during consultation</li>
        <li>Have a notepad ready for instructions</li>
        <li>Keep water nearby</li>
      </ul>
      
      <h3>During the Consultation</h3>
      <ul>
        <li>Be punctual and login 5 minutes early</li>
        <li>Speak clearly and describe symptoms in detail</li>
        <li>Ask questions - don't hesitate</li>
        <li>Take notes of doctor's advice</li>
        <li>Confirm if prescription will be sent digitally</li>
      </ul>
      
      <h3>After the Consultation</h3>
      <ul>
        <li>Follow prescribed treatment plan</li>
        <li>Schedule follow-up if needed</li>
        <li>Save consultation summary and prescription</li>
        <li>Contact doctor if symptoms worsen</li>
      </ul>
    `,
    author: "Dr. Amit Kumar",
    date: "December 10, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=400&fit=crop",
    category: "Patient Guide"
  },
  {
    id: 3,
    title: "The Future of Healthcare: AI and Telemedicine Integration",
    excerpt: "Exploring how artificial intelligence is enhancing teleconsultation services and improving diagnostic accuracy.",
    content: `
      <h2>AI-Powered Telemedicine Revolution</h2>
      <p>The integration of AI with telemedicine is transforming how healthcare is delivered. Here's what the future holds:</p>
      
      <h3>1. AI-Assisted Diagnosis</h3>
      <p>Machine learning algorithms can analyze symptoms and medical history to provide preliminary assessments before doctor consultation.</p>
      
      <h3>2. Predictive Healthcare</h3>
      <p>AI can identify potential health risks by analyzing patient data patterns, enabling preventive care.</p>
      
      <h3>3. Natural Language Processing</h3>
      <p>Advanced chatbots can understand patient queries in natural language and provide immediate guidance.</p>
      
      <h3>4. Image Recognition</h3>
      <p>AI can analyze medical images shared during teleconsultation, assisting doctors in making accurate diagnoses.</p>
      
      <h3>5. Personalized Treatment Plans</h3>
      <p>AI algorithms consider individual patient data to recommend customized treatment approaches.</p>
      
      <h3>6. Remote Patient Monitoring</h3>
      <p>IoT devices combined with AI enable continuous health monitoring and alert systems.</p>
      
      <h3>7. Reduced Wait Times</h3>
      <p>AI scheduling systems optimize doctor availability and patient flow.</p>
      
      <h3>Ethical Considerations</h3>
      <p>While AI enhances healthcare delivery, it's crucial to maintain:</p>
      <ul>
        <li>Patient privacy and data security</li>
        <li>Human oversight in critical decisions</li>
        <li>Transparency in AI recommendations</li>
        <li>Accessibility for all demographics</li>
      </ul>
      
      <h3>Conclusion</h3>
      <p>AI and telemedicine together are creating a more efficient, accessible, and personalized healthcare system for everyone.</p>
    `,
    author: "Dr. Sarah Johnson",
    date: "December 5, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
    category: "Technology"
  },
  {
    id: 4,
    title: "Understanding Telemedicine Laws and Regulations in India",
    excerpt: "A comprehensive overview of legal guidelines and regulations governing teleconsultation practices in India.",
    content: `
      <h2>Legal Framework for Telemedicine in India</h2>
      <p>The Telemedicine Practice Guidelines issued by the Medical Council of India provide a comprehensive framework for teleconsultation.</p>
      
      <h3>Key Regulations</h3>
      
      <h4>1. Doctor Registration Requirements</h4>
      <ul>
        <li>Must be registered with State Medical Council or MCI</li>
        <li>Should have valid practice license</li>
        <li>Required to verify credentials on platform</li>
      </ul>
      
      <h4>2. Types of Teleconsultation</h4>
      <p><strong>Video Consultation:</strong> Preferred mode for detailed assessment</p>
      <p><strong>Audio Consultation:</strong> Allowed for follow-ups and minor queries</p>
      <p><strong>Text-based:</strong> Only for preliminary queries, not for diagnosis</p>
      
      <h4>3. Patient Consent</h4>
      <ul>
        <li>Informed consent required before consultation</li>
        <li>Patient must agree to telemedicine mode</li>
        <li>Consent for data storage and usage</li>
      </ul>
      
      <h4>4. Prescription Guidelines</h4>
      <ul>
        <li>E-prescriptions must include doctor's digital signature</li>
        <li>Registration number must be mentioned</li>
        <li>Controlled substances have restrictions</li>
        <li>First-time prescriptions may require physical examination for certain medications</li>
      </ul>
      
      <h4>5. Documentation Requirements</h4>
      <ul>
        <li>Maintain digital records for minimum 3 years</li>
        <li>Patient data must be encrypted</li>
        <li>Secure storage complying with IT Act</li>
      </ul>
      
      <h4>6. Emergency Situations</h4>
      <ul>
        <li>Doctors must advise in-person visit if needed</li>
        <li>Emergency cases should be directed to nearest facility</li>
        <li>Clear communication about limitations</li>
      </ul>
      
      <h3>Patient Rights</h3>
      <ul>
        <li>Right to choose consultation mode</li>
        <li>Right to second opinion</li>
        <li>Access to medical records</li>
        <li>Privacy and confidentiality</li>
        <li>Right to file complaints</li>
      </ul>
      
      <h3>Platform Responsibilities</h3>
      <ul>
        <li>Verify doctor credentials</li>
        <li>Ensure secure data transmission</li>
        <li>Maintain audit trails</li>
        <li>Provide patient support</li>
      </ul>
    `,
    author: "Dr. Rajesh Mehta",
    date: "November 28, 2025",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop",
    category: "Legal"
  },
  {
    id: 5,
    title: "Mental Health Support Through Teleconsultation",
    excerpt: "How online therapy and counseling services are breaking stigmas and making mental healthcare more accessible.",
    content: `
      <h2>Mental Health in the Digital Age</h2>
      <p>Teleconsultation has opened new doors for mental health support, making therapy more accessible and reducing stigma.</p>
      
      <h3>Benefits for Mental Health Care</h3>
      
      <h4>1. Increased Accessibility</h4>
      <p>Connect with therapists from anywhere, especially helpful for:</p>
      <ul>
        <li>People in remote areas</li>
        <li>Those with mobility issues</li>
        <li>Individuals with social anxiety</li>
        <li>Busy professionals</li>
      </ul>
      
      <h4>2. Reduced Stigma</h4>
      <p>Online consultations offer more privacy, encouraging people to seek help without fear of judgment.</p>
      
      <h4>3. Comfortable Environment</h4>
      <p>Being in your own space can help you feel more relaxed and open during therapy sessions.</p>
      
      <h4>4. Continuity of Care</h4>
      <p>Easier to maintain regular sessions, leading to better treatment outcomes.</p>
      
      <h3>Types of Mental Health Services Available</h3>
      <ul>
        <li><strong>Individual Therapy:</strong> One-on-one sessions with psychologists or counselors</li>
        <li><strong>Couples Counseling:</strong> Relationship therapy conducted online</li>
        <li><strong>Family Therapy:</strong> Multiple family members can join from different locations</li>
        <li><strong>Group Support:</strong> Virtual support groups for specific conditions</li>
        <li><strong>Psychiatric Consultations:</strong> Medication management and psychiatric evaluations</li>
      </ul>
      
      <h3>When is Online Therapy Effective?</h3>
      <ul>
        <li>Anxiety and depression</li>
        <li>Stress management</li>
        <li>Relationship issues</li>
        <li>Grief and loss</li>
        <li>Work-related stress</li>
        <li>Lifestyle changes</li>
      </ul>
      
      <h3>When In-Person Care is Recommended</h3>
      <ul>
        <li>Severe mental health crises</li>
        <li>Suicidal ideation</li>
        <li>Severe substance abuse</li>
        <li>Complex diagnostic evaluations</li>
      </ul>
      
      <h3>Tips for Successful Online Therapy</h3>
      <ul>
        <li>Create a quiet, private space</li>
        <li>Be consistent with appointments</li>
        <li>Be honest and open</li>
        <li>Do homework assignments between sessions</li>
        <li>Give feedback to your therapist</li>
      </ul>
      
      <h3>Choosing the Right Therapist</h3>
      <ul>
        <li>Check credentials and specialization</li>
        <li>Read reviews and testimonials</li>
        <li>Consider their experience with online therapy</li>
        <li>Ensure they match your cultural and linguistic needs</li>
        <li>Trust your comfort level</li>
      </ul>
    `,
    author: "Dr. Ananya Desai",
    date: "November 20, 2025",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&h=400&fit=crop",
    category: "Mental Health"
  }
];

export default function Blogs() {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        {/* Article Header */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={selectedPost.image} 
            alt={selectedPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto max-w-4xl">
              <div className="inline-block px-3 py-1 bg-teal-600 text-white text-sm rounded-full mb-4">
                {selectedPost.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {selectedPost.title}
              </h1>
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedPost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto max-w-4xl px-6 py-12">
          <Button 
            onClick={() => setSelectedPost(null)} 
            variant="outline" 
            className="mb-8 border-teal-600 text-teal-600"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to all articles
          </Button>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />
          
          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Experience Better Healthcare?</h3>
            <p className="text-gray-600 mb-6">
              Book a consultation with our verified healthcare professionals today.
            </p>
            <Button onClick={() => navigate('/')} className="bg-teal-600 hover:bg-teal-700">
              Book Consultation <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Healthcare Insights & Articles</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert advice, latest trends, and helpful guides about telemedicine and healthcare
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <div className="flex gap-3 flex-wrap justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto max-w-6xl px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Card 
              key={post.id} 
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group border-0 shadow-lg"
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-teal-600 text-white text-sm rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors text-gray-900">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
