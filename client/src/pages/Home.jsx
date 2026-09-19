import React, { useState, useEffect } from 'react';
import { MapPin, Trees, Building2, Waves, Maximize, Droplets, Trophy, CheckCircle, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Icon Map for dynamic rendering
const IconMap = {
  Trees, Building2, Waves, Maximize, Droplets, Trophy, Star, MapPin
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const Home = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobileNo: ''
  });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/content`);
        setContent(data);
      } catch (error) {
        console.error('Error fetching site content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const leadData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.mobileNo,
      type: 'Site Visit',
      source: 'Website Form'
    };

    try {
      await axios.post('/api/leads', leadData);
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', mobileNo: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting EOI:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-sattva-bg"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sattva-btn"></div></div>;
  }

  // Deep fallback to prevent crashes if nested objects are undefined
  const data = {
    global: content?.global || {},
    hero: content?.hero || {},
    highlights: content?.highlights || { items: [] },
    amenities: content?.amenities || { slides: [] },
    gallery: content?.gallery || { images: [] },
    floorPlans: content?.floorPlans || {},
    vision: content?.vision || {},
    location: content?.location || { items: [] },
    faqs: content?.faqs || { items: [] }
  };

  // Maintenance Mode Blocker
  if (data.global.maintenanceMode) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">We'll be back shortly</h1>
        <p className="text-gray-500">The website is currently undergoing maintenance.</p>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-sattva-bg font-sans pt-20 overflow-hidden">
      
      {/* Floating Action Buttons (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
        {/* WhatsApp Button */}
        <motion.a 
          href={`https://wa.me/${data.global.whatsapp?.number?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(data.global.whatsapp?.defaultMessage || '')}`}
          target="_blank" rel="noopener noreferrer"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: 'spring' }}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition hover:scale-110 flex items-center justify-center w-14 h-14"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
        </motion.a>
        {/* Book Site Visit Pulsing Button */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring' }}>
          <motion.a 
            href="#eoi-form"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-primary text-white py-3 px-6 rounded-full shadow-lg font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-primary-light flex items-center origin-center block"
          >
            Book Your Site Visit
          </motion.a>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section id="overview" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
            src={data.hero.backgroundImage} alt="Hero" className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 w-full max-w-4xl pt-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex justify-center items-end space-x-2 mb-6">
            <div className="flex space-x-1.5 items-end mb-2">
              <div className="w-3 h-12 bg-[#3AB0E2]"></div>
              <div className="w-3 h-16 bg-[#8BC53F]"></div>
              <div className="w-3 h-24 bg-[#F8981D]"></div>
              <div className="w-3 h-32 bg-[#ED1C24]"></div>
            </div>
            <div className="flex flex-col items-start ml-6">
               <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-1">{data.hero.logoTitleFirst}</h1>
               <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter leading-none text-gold">{data.hero.logoTitleSecond}</h1>
            </div>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-white text-xl md:text-3xl mt-8 font-medium tracking-wide flex items-center justify-center">
            <MapPin className="mr-2" /> {data.hero.mainTitle}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }} className="text-gray-300 text-base md:text-xl mt-4 font-light tracking-[0.3em]">
            {data.hero.subtitle}
          </motion.p>
        </div>

      </section>

      {/* EOI Form Overlay */}
      <section id="eoi-form" className="relative z-30 -mt-24 mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto glass-card p-8 md:p-10 border-t-4 border-accent"
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-center text-primary mb-4">{data.eoi?.title || "EOI's Open Now"}</h3>
          <p className="text-sm md:text-base text-center text-gray-700 mb-8 font-medium max-w-2xl mx-auto">
            {data.eoi?.subtitle || "To express your interest and receive priority access, please fill out the form below. Our property experts will contact you shortly."}
          </p>
          
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-6 flex flex-col items-center justify-center text-center">
              <CheckCircle size={48} className="mb-4 text-green-500" />
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p>Your interest has been registered. Our property experts will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First Name" className="w-full px-2 py-3 border-b-2 border-gray-200 focus:border-sattva-btn focus:outline-none bg-transparent transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last Name" className="w-full px-2 py-3 border-b-2 border-gray-200 focus:border-sattva-btn focus:outline-none bg-transparent transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full px-2 py-3 border-b-2 border-gray-200 focus:border-sattva-btn focus:outline-none bg-transparent transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Mobile No</label>
                <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required placeholder="Mobile No" className="w-full px-2 py-3 border-b-2 border-gray-200 focus:border-sattva-btn focus:outline-none bg-transparent transition-colors" />
              </div>
              <div className="md:col-span-2 pt-2">
                <button type="submit" disabled={status === 'loading'} className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 text-sm uppercase tracking-widest transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md rounded-md">
                  {status === 'loading' ? 'Submitting...' : 'Express Your Interest'}
                </button>
                {status === 'error' && <p className="text-red-500 text-center mt-3 text-sm font-medium">An error occurred. Please try again.</p>}
              </div>
            </form>
          )}
        </motion.div>
      </section>

      {/* Featured Projects & Properties Links */}
      {(data.global.visibility?.projects !== false || data.global.visibility?.properties !== false) && (
        <section className="py-12 bg-white relative z-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {data.global.visibility?.projects !== false && (
                <Link to="/projects" className="group block relative overflow-hidden rounded-2xl shadow-xl h-64">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" alt="Projects" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-3xl font-serif font-bold text-white mb-2">Explore Projects</h3>
                    <p className="text-accent flex items-center font-medium">View our ongoing developments <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span></p>
                  </div>
                </Link>
              )}
              {data.global.visibility?.properties !== false && (
                <Link to="/properties" className="group block relative overflow-hidden rounded-2xl shadow-xl h-64">
                  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" alt="Properties" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-3xl font-serif font-bold text-white mb-2">Explore Properties</h3>
                    <p className="text-accent flex items-center font-medium">Find your dream home <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span></p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Heading */}
      <section className="text-center py-20 px-4 bg-sattva-bg overflow-hidden relative">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-4 tracking-tight"
        >
          Homes designed like a destination
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl font-bold text-black uppercase tracking-wider"
        >
          TGRERA NO. P02400010916
        </motion.p>
      </section>

      {/* Project Highlights */}
      <section className="relative py-24 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={data.highlights.backgroundImage} alt="Highlights Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.6 }}
            className="text-white text-5xl font-extrabold mb-12 drop-shadow-md"
          >
            {data.highlights.title}
          </motion.h2>
          
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.highlights.items.map((highlight, index) => {
              const IconComponent = IconMap[highlight.iconName] || Star;
              return (
                <motion.div variants={fadeInUp} key={index} className="glass-dark p-10 flex flex-col items-center justify-center text-center min-h-[220px] transition duration-300 hover:-translate-y-2 cursor-pointer">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-primary mb-6 shadow-lg">
                    <IconComponent size={36} strokeWidth={1.5}/>
                  </div>
                  <h3 className="text-white font-serif font-bold text-xl leading-snug px-2">{highlight.text}</h3>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Amenities Slider */}
      {data.amenities.slides.length > 0 && (
        <section id="amenities" className="py-20 bg-sattva-bg overflow-hidden">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-black mb-12 container mx-auto px-6"
          >
            {data.amenities.title}
          </motion.h2>
          
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.8 }} className="w-full relative px-4 md:px-12">
            <Swiper
              modules={[Navigation, Pagination, EffectFade, Autoplay]} effect="fade" navigation pagination={{ clickable: true }} autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="w-full h-[60vh] md:h-[80vh] rounded-md shadow-2xl"
            >
              {data.amenities.slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-12 left-12 md:bottom-24 md:left-24 max-w-2xl text-white">
                      <h3 className="text-4xl md:text-5xl font-bold mb-6">{slide.title}</h3>
                      <p className="text-lg md:text-xl font-medium leading-relaxed">{slide.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </section>
      )}

      {/* Gallery Section */}
      {data.gallery?.images?.length > 0 && (
        <section id="gallery" className="py-24 bg-white overflow-hidden">
          <motion.h2 
            initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-black text-center mb-16 tracking-tight"
          >
            {data.gallery.title || "Gallery"}
          </motion.h2>
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.gallery.images.slice(0, 2).map((img, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.6, delay: idx * 0.2 }} className="relative h-[60vh] w-full overflow-hidden group">
                  <img src={img.src} alt={img.category} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floor Plans */}
      {data.global.visibility?.plans !== false && (
        <section id="plans" className="py-24 bg-sattva-bg overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-12">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.8 }} className="md:w-1/2 relative">
               <img src={data.floorPlans.backgroundImage} alt="Master Plan" className="w-full object-cover shadow-lg" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.8 }} className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-6 leading-tight">{data.floorPlans.titleLine1} <br/>{data.floorPlans.titleLine2}</h2>
              <p className="text-gray-800 font-medium text-base leading-relaxed mb-6">{data.floorPlans.description1}</p>
              <p className="text-gray-800 font-medium text-base leading-relaxed mb-10">{data.floorPlans.description2}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-primary text-white px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-primary-light transition rounded-full shadow-md">Download Brochure</button>
                <a href="#eoi-form" className="bg-accent text-primary px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-yellow-400 transition text-center rounded-full shadow-md">Schedule A Site Visit</a>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Vision Section */}
      <section id="vision" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-16">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.8 }} className="md:w-1/2">
            <h2 className="text-5xl md:text-6xl font-extrabold text-black mb-6 leading-tight">{data.vision.titleLine1} <br/>{data.vision.titleLine2}</h2>
            <p className="text-gray-800 font-medium text-base leading-relaxed mb-6">{data.vision.description}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.8 }} className="md:w-1/2 relative">
             <img src={data.vision.image} alt="Vision" className="w-full object-cover shadow-lg" />
          </motion.div>
        </div>
      </section>

      {/* Location Highlights */}
      <section id="location" className="py-24 bg-sattva-bg overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-start gap-16">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.6 }} className="md:w-1/2">
             <img src={data.location.image} alt="Location" className="w-full object-cover h-[400px]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.6 }} className="md:w-1/2 pt-4">
            <h2 className="text-4xl font-extrabold text-black mb-8">{data.location.title}</h2>
            <div className="space-y-6">
              {data.location.items.map((loc, i) => (
                <div key={i} className="flex justify-between items-end text-sm md:text-base font-bold text-black border-b border-black pb-2">
                  <span className="bg-sattva-bg pr-2 relative top-2">{loc.name}</span>
                  <span className="bg-sattva-bg pl-2 relative top-2">{loc.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      {data.faqs && data.faqs.items && data.faqs.items.length > 0 && (
        <section id="faqs" className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-start gap-12">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.6 }} className="md:w-1/2">
              <h2 className="text-4xl font-extrabold text-black mb-8">{data.faqs.title || "FAQ's"}</h2>
              <div className="space-y-4">
                {data.faqs.items.map((faq, i) => (
                  <details key={i} className="group border-b border-gray-300 pb-4 cursor-pointer">
                    <summary className="flex justify-between items-center font-bold text-sm md:text-base text-black list-none">
                      {faq.question}
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.6 }} className="md:w-1/2">
               <img src={data.faqs.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'} alt="FAQs" className="w-full object-cover shadow-lg" />
            </motion.div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
