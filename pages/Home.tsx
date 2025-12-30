
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PhoneCall, ShieldCheck, Users, Clock, HeartPulse } from 'lucide-react';
import { SERVICES, DOCTORS, ICON_MAP } from '../constants';
import DoctorCard from '../components/DoctorCard';
import { getHomepageContent } from '../services/firebaseService';

const Home: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [heroTitle, setHeroTitle] = useState('Healing Hands, Caring Hearts, Brighter Futures.');
  const [heroDescription, setHeroDescription] = useState('Experience world-class healthcare with a personal touch.');
  const [managedDoctors, setManagedDoctors] = useState<any[]>([]);
  const [managedServices, setManagedServices] = useState<any[]>([]);
  const [managedCareers, setManagedCareers] = useState<any[]>([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const data = await getHomepageContent();
    if (data) {
      setContent(data);
      setHeroTitle(data.heroTitle || heroTitle);
      setHeroDescription(data.heroDescription || heroDescription);
      setManagedDoctors(data.doctors || []);
      setManagedServices(data.services || []);
      setManagedCareers(data.careers || []);
    }
  };

  const doctorsToDisplay = managedDoctors.length > 0 ? managedDoctors : DOCTORS;
  const servicesToDisplay = managedServices.length > 0 ? managedServices : SERVICES;
  const careersToDisplay = managedCareers.length > 0 ? managedCareers : [
    { title: 'Global Recognition', desc: 'Work with the best in the industry with global standards.' },
    { title: 'Continuous Growth', desc: 'Training and development programs for every staff member.' },
    { title: 'Modern Facilities', desc: 'Access to the latest medical technology and equipment.' },
    { title: 'Inclusive Culture', desc: 'A diverse and supportive work environment for all.' }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative bg-sky-50 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-bold tracking-wide uppercase mb-4">
                  Welcome to LuminaHealth
                </span>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                  {heroTitle.split('Caring Hearts').map((part, i) => (
                    <span key={i}>
                      {part}
                      {i === 0 && <span className="text-teal-600">Caring Hearts</span>}
                    </span>
                  ))}
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-lg leading-relaxed">
                  {heroDescription}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/book-appointment"
                  className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-teal-200 hover:bg-teal-700 transition-all flex items-center justify-center gap-2 group"
                >
                  Book Appointment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/careers"
                  className="bg-white text-teal-600 border-2 border-teal-600 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition-all text-center"
                >
                  Apply for Work
                </Link>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} className="w-12 h-12 rounded-full border-4 border-white object-cover" src={`https://picsum.photos/seed/face${i}/100/100`} alt="Avatar" />
                  ))}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">15k+</div>
                  <div className="text-sm text-gray-500">Happy Patients Yearly</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-teal-200/50 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-sky-200/50 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053" 
                alt="Hospital Interior" 
                className="relative z-10 rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, label: 'Quality Service', val: '100%' },
            { icon: Users, label: 'Professional Staff', val: '250+' },
            { icon: Clock, label: 'Years Experience', val: '28' },
            { icon: HeartPulse, label: 'Success Rate', val: '98%' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center space-x-4 p-4">
              <div className="bg-sky-50 p-3 rounded-2xl text-sky-600">
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.val}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-2">Our Services</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Specialized Medical Care</h3>
            <p className="text-gray-600">We provide a wide range of medical services tailored to meet the unique needs of every patient, using cutting-edge technology.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesToDisplay.map((service: any) => (
              <div key={service.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                  {ICON_MAP[service.icon] || <HeartPulse className="w-8 h-8" />}
                </div>
                <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
                <Link to="/doctors" className="text-teal-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Find Doctors <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/20">
            <div className="text-white text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-2">Need Emergency Assistance?</h2>
              <p className="text-teal-50 opacity-90">Our trauma centers are open 24/7. Your life is our priority.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <a 
                href="tel:123456789" 
                className="bg-white text-teal-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl hover:bg-gray-50 transition-colors"
              >
                <PhoneCall className="w-6 h-6 animate-pulse" />
                Call +1 (555) EMERGENCY
              </a>
              <Link 
                to="/contact" 
                className="text-white font-bold underline underline-offset-8 hover:text-teal-100"
              >
                Find Emergency Ward
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-2">Expert Team</h2>
              <h3 className="text-4xl font-extrabold text-gray-900">Featured Specialists</h3>
            </div>
            <Link to="/doctors" className="hidden sm:block text-teal-600 font-bold hover:underline">
              View All Doctors
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(managedDoctors.length > 0 ? managedDoctors : DOCTORS).slice(0, 4).map((doc: any) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
          <div className="mt-12 sm:hidden text-center">
            <Link to="/doctors" className="inline-block bg-teal-50 text-teal-600 px-8 py-3 rounded-xl font-bold">
              View All Doctors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
