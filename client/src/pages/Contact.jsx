import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [global, setGlobal] = useState({});

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/content');
        if (data && data.global) {
          setGlobal(data.global);
        }
      } catch (error) {
        console.error('Failed to fetch contact content', error);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post('http://localhost:5000/api/leads', {
        ...formData,
        source: 'Contact Form'
      });
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-background pt-24 pb-20 min-h-screen">
      <div className="bg-primary text-white py-16 px-4 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Contact Us</h1>
        <p className="text-gray-300 max-w-2xl mx-auto font-light">
          Get in touch with our luxury real estate experts. We're here to help you find your dream home or answer any questions.
        </p>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Information */}
          <div className="bg-white p-10 shadow-lg border-t-4 border-accent">
            <h2 className="text-3xl font-serif text-primary mb-8">Get In Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mr-4 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary mb-1">Our Office</h4>
                  <p className="text-gray-600 whitespace-pre-line">{global.address || '123 Luxury Avenue, Jubilee Hills,\nHyderabad, Telangana 500033'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mr-4 flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary mb-1">Call Us</h4>
                  <p className="text-gray-600 whitespace-pre-line">{global.phone || '+91 98765 43210\n+91 98765 43211'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mr-4 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary mb-1">Email Us</h4>
                  <p className="text-gray-600 whitespace-pre-line">{global.email || 'info@pkproperties.com\nsales@pkproperties.com'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mr-4 flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary mb-1">Working Hours</h4>
                  <p className="text-gray-600 whitespace-pre-line">{global.workingHours || 'Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: 10:00 AM - 4:00 PM'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 shadow-lg">
            <h2 className="text-3xl font-serif text-primary mb-2">Send a Message</h2>
            <p className="text-gray-500 mb-8">Please fill out the form below and we will get back to you shortly.</p>
            
            {status === 'success' && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
                Thank you! Your message has been sent successfully. We will contact you soon.
              </div>
            )}
            
            {status === 'error' && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                There was an error sending your message. Please try again later.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-accent transition" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-accent transition" placeholder="+91 9000000000" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-accent transition" placeholder="john@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-accent transition resize-none" placeholder="I am interested in..."></textarea>
              </div>
              
              <button type="submit" disabled={status === 'loading'} className="w-full bg-primary text-white py-4 font-bold hover:bg-gray-900 transition flex justify-center items-center">
                {status === 'loading' ? 'Sending...' : <><Send size={18} className="mr-2"/> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
