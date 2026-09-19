import axios from 'axios';

// ENABLE THIS TO BYPASS THE BACKEND
const DEMO_MODE = true;

if (DEMO_MODE) {
  console.log('DEMO MODE ENABLED: Intercepting all API requests');

  // Intercept requests and immediately reject to trigger response error handler
  axios.interceptors.request.use((config) => {
    return Promise.reject({
      isDemoMock: true,
      url: config.url || '',
      method: config.method || 'get'
    });
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.isDemoMock) {
        const url = error.url;
        const method = error.method.toLowerCase();
        
        console.log(`[DEMO MODE] Mocking ${method.toUpperCase()} ${url}`);

        // Mock Login
        if (url.includes('/login')) {
          return Promise.resolve({
            data: { 
              token: 'demo-token', 
              user: { name: 'Demo Admin', email: 'demo@pkproperties.com', role: { name: 'SUPER ADMIN' } } 
            }
          });
        }

        // Mock Content
        if (url.includes('/api/content')) {
          return Promise.resolve({
            data: {
              global: { 
                phone: '+91 98765 43210', 
                email: 'demo@pkproperties.com', 
                address: 'Demo Address, Hyderabad', 
                socials: {},
                workingHours: 'Mon-Sat 9AM-7PM'
              },
              hero: { 
                backgroundImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80', 
                logoTitleFirst: 'PK', 
                logoTitleSecond: 'PROPERTIES', 
                mainTitle: 'Luxury Redefined', 
                subtitle: 'Experience the pinnacle of modern living.' 
              },
              highlights: { 
                backgroundImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80',
                items: [
                  { iconName: 'Star', text: 'Premium Location' },
                  { iconName: 'Shield', text: '24/7 Security' },
                  { iconName: 'TreePine', text: 'Lush Greenery' },
                  { iconName: 'Coffee', text: 'Clubhouse' }
                ] 
              },
              amenities: { 
                slides: [
                  { image: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=800&q=80', title: 'Swimming Pool', description: 'Olympic sized temperature controlled pool' },
                  { image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', title: 'Fitness Center', description: 'State of the art gymnasium' },
                  { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', title: 'Lounge', description: 'Exclusive resident lounge area' }
                ] 
              },
              gallery: { 
                images: [
                  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', category: 'Exteriors' },
                  { src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80', category: 'Interiors' },
                  { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', category: 'Projects' },
                  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', category: 'Interiors' },
                  { src: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=800&q=80', category: 'Amenities' },
                  { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', category: 'Interiors' }
                ] 
              },
              faqs: {
                title: 'FAQ\'s',
                items: [
                  { question: 'What is the RERA number for this project?', answer: 'The RERA number is P02400010916. We comply with all regulatory standards.' },
                  { question: 'What is the price range of the apartments?', answer: 'The pricing varies based on the configuration and floor plan. Please contact our sales team for detailed pricing information.' },
                  { question: 'When is the expected possession date?', answer: 'The expected possession date for the first phase is December 2027.' },
                  { question: 'What are the payment plans available?', answer: 'We offer flexible payment plans linked to construction milestones. Our sales representatives can walk you through the details.' }
                ],
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
              }
            }
          });
        }

        // Mock Lists (Projects, Properties, Users, Leads)
        if (method === 'get' && (url.includes('/api/projects') || url.includes('/api/properties') || url.includes('/api/users') || url.includes('/api/leads'))) {
          return Promise.resolve({ data: [] });
        }

        // Mock POST/PUT/DELETE
        if (['post', 'put', 'delete'].includes(method)) {
          return Promise.resolve({ data: { success: true, message: 'Mock action successful' } });
        }
      }

      return Promise.reject(error);
    }
  );
}
