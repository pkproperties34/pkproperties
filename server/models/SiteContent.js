import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
  // Singleton identifier
  isConfig: { type: Boolean, default: true, unique: true },
  
  global: {
    phone: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'info@pkproperties.com' },
    address: { type: String, default: 'Neopolis, Kokapet, Hyderabad' },
    socials: {
      instagram: { type: String, default: '#' },
      twitter: { type: String, default: '#' },
      youtube: { type: String, default: '#' },
      linkedin: { type: String, default: '#' },
      facebook: { type: String, default: '#' }
    },
    maintenanceMode: { type: Boolean, default: false },
    workingHours: { type: String, default: 'Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: 10:00 AM - 4:00 PM' }
  },

  hero: {
    backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80' },
    logoTitleFirst: { type: String, default: 'PK' },
    logoTitleSecond: { type: String, default: 'PROPERTIES' },
    mainTitle: { type: String, default: 'Neopolis, Kokapet' },
    subtitle: { type: String, default: '3, 3.5, and 4 BHK Residences' }
  },

  highlights: {
    backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80' },
    title: { type: String, default: 'Project Highlights' },
    items: {
      type: [{
        iconName: { type: String, default: 'Star' },
        text: { type: String, required: true }
      }],
      default: [
        { iconName: 'Star', text: 'Premium Location' },
        { iconName: 'Shield', text: '24/7 Security' },
        { iconName: 'TreePine', text: 'Lush Greenery' },
        { iconName: 'Coffee', text: 'Clubhouse' }
      ]
    }
  },

  amenities: {
    title: { type: String, default: 'Amenities' },
    slides: {
      type: [{
        image: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true }
      }],
      default: [
        { image: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=800&q=80', title: 'Swimming Pool', description: 'Olympic sized temperature controlled pool' },
        { image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', title: 'Fitness Center', description: 'State of the art gymnasium' },
        { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', title: 'Lounge', description: 'Exclusive resident lounge area' }
      ]
    }
  },

  gallery: {
    title: { type: String, default: 'Gallery' },
    images: {
      type: [{
        src: { type: String, required: true },
        category: { type: String, default: 'Projects' }
      }],
      default: [
        { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', category: 'Exteriors' },
        { src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80', category: 'Interiors' },
        { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', category: 'Projects' },
        { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', category: 'Interiors' },
        { src: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=800&q=80', category: 'Amenities' },
        { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', category: 'Interiors' }
      ]
    }
  },

  floorPlans: {
    titleLine1: { type: String, default: 'Crafted for comfort.' },
    titleLine2: { type: String, default: 'Designed for life.' },
    description1: { type: String, default: 'Every residence is thoughtfully planned to make daily life feel effortless. Generous living spaces, abundant natural light, cross ventilation, and intuitive layouts come together to create homes that are as practical as they are beautiful.' },
    description2: { type: String, default: 'Each square foot serves a purpose, ensuring comfort, privacy, and flexibility for every member of the family.' },
    backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
  },

  location: {
    title: { type: String, default: 'Location Highlights' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    items: [{
      name: { type: String, required: true },
      time: { type: String, required: true }
    }]
  },

  faqs: {
    title: { type: String, default: 'FAQ\'s' },
    items: {
      type: [{
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }],
      default: [
        { question: 'What is the RERA number for this project?', answer: 'The RERA number is P02400010916.' },
        { question: 'What are the amenities provided?', answer: 'We provide a clubhouse, swimming pool, fitness center, lounge, and more.' }
      ]
    },
    image: { type: String, default: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' }
  },

  vision: {
    titleLine1: { type: String, default: 'Where vision.' },
    titleLine2: { type: String, default: 'Meets design.' },
    description: { type: String, default: 'Sattva Lago draws inspiration from the gentle rhythm of ripples across Osman Sagar lake. Every curve, contour, and elevation reflects fluidity and calm. With uninterrupted lake views and a skyline shaped by thoughtful architecture, the design seamlessly merges nature with contemporary luxury. The result is a living experience that feels indulgent yet unhurried. A staycation that never asks you to check out.' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' }
  }

}, { timestamps: true });

export default mongoose.model('SiteContent', siteContentSchema);
