import React, { useState, useEffect } from 'react';
import { Save, Plus, X, Trash2, Edit2 } from 'lucide-react';
import { updateHomepageContent, getHomepageContent } from '../services/firebaseService';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
}

interface CareerBenefit {
  id: string;
  title: string;
  description: string;
}

const AdminCMS: React.FC = () => {
  const [heroTitle, setHeroTitle] = useState('Healing Hands, Caring Hearts, Brighter Futures.');
  const [heroDescription, setHeroDescription] = useState('Experience world-class healthcare with a personal touch.');
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [careers, setCareers] = useState<CareerBenefit[]>([]);
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Doctor form states
  const [doctorForm, setDoctorForm] = useState({ name: '', specialty: '', image: '' });
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  // Service form states
  const [serviceForm, setServiceForm] = useState({ title: '', description: '' });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Career form states
  const [careerForm, setCareerForm] = useState({ title: '', description: '' });
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const content = await getHomepageContent();
    if (content) {
      setHeroTitle(content.heroTitle || heroTitle);
      setHeroDescription(content.heroDescription || heroDescription);
      setDoctors(content.doctors || []);
      setServices(content.services || []);
      setCareers(content.careers || []);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const success = await updateHomepageContent({
      heroTitle,
      heroDescription,
      doctors,
      services,
      careers
    });

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  // Doctor functions
  const addDoctor = () => {
    if (doctorForm.name && doctorForm.specialty) {
      const newDoctor = { ...doctorForm, id: Date.now().toString() };
      setDoctors([...doctors, newDoctor]);
      setDoctorForm({ name: '', specialty: '', image: '' });
    }
  };

  const updateDoctor = () => {
    if (editingDoctorId && doctorForm.name && doctorForm.specialty) {
      setDoctors(doctors.map(d => d.id === editingDoctorId ? { ...doctorForm, id: editingDoctorId } : d));
      setDoctorForm({ name: '', specialty: '', image: '' });
      setEditingDoctorId(null);
    }
  };

  const editDoctor = (doctor: Doctor) => {
    setDoctorForm(doctor);
    setEditingDoctorId(doctor.id);
    setActiveSection('doctors');
  };

  const deleteDoctor = (id: string) => {
    setDoctors(doctors.filter(d => d.id !== id));
  };

  // Service functions
  const addService = () => {
    if (serviceForm.title && serviceForm.description) {
      const newService = { ...serviceForm, id: Date.now().toString() };
      setServices([...services, newService]);
      setServiceForm({ title: '', description: '' });
    }
  };

  const updateService = () => {
    if (editingServiceId && serviceForm.title && serviceForm.description) {
      setServices(services.map(s => s.id === editingServiceId ? { ...serviceForm, id: editingServiceId } : s));
      setServiceForm({ title: '', description: '' });
      setEditingServiceId(null);
    }
  };

  const editService = (service: Service) => {
    setServiceForm(service);
    setEditingServiceId(service.id);
    setActiveSection('services');
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  // Career functions
  const addCareer = () => {
    if (careerForm.title && careerForm.description) {
      const newCareer = { ...careerForm, id: Date.now().toString() };
      setCareers([...careers, newCareer]);
      setCareerForm({ title: '', description: '' });
    }
  };

  const updateCareer = () => {
    if (editingCareerId && careerForm.title && careerForm.description) {
      setCareers(careers.map(c => c.id === editingCareerId ? { ...careerForm, id: editingCareerId } : c));
      setCareerForm({ title: '', description: '' });
      setEditingCareerId(null);
    }
  };

  const editCareer = (career: CareerBenefit) => {
    setCareerForm(career);
    setEditingCareerId(career.id);
    setActiveSection('careers');
  };

  const deleteCareer = (id: string) => {
    setCareers(careers.filter(c => c.id !== id));
  };

  return (
    <div className="p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Homepage Content Management</h1>
        <p className="text-gray-500 mt-1">Manage all homepage content including doctors, services, and careers</p>
      </header>

      {saveSuccess && (
        <div className="mb-6 bg-teal-50 border border-teal-200 text-teal-700 p-4 rounded-xl animate-bounce">
          ✓ All changes saved successfully!
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-3 mb-8 border-b border-gray-200 pb-4">
        {['hero', 'doctors', 'services', 'careers'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-2 font-bold rounded-lg capitalize transition-all ${
              activeSection === section 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* Hero Section */}
        {activeSection === 'hero' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Section</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Main Heading</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Enter main heading..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  placeholder="Enter description..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Doctors Section */}
        {activeSection === 'doctors' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Doctors</h2>
            
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-bold text-gray-900 mb-4">{editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}</h3>
              <div className="space-y-4">
                <input 
                  placeholder="Doctor Name"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                />
                <input 
                  placeholder="Specialty (e.g. Cardiologist)"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200"
                  value={doctorForm.specialty}
                  onChange={(e) => setDoctorForm({...doctorForm, specialty: e.target.value})}
                />
                <input 
                  placeholder="Image URL"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200"
                  value={doctorForm.image}
                  onChange={(e) => setDoctorForm({...doctorForm, image: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={editingDoctorId ? updateDoctor : addDoctor}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700"
                >
                  {editingDoctorId ? 'Update Doctor' : 'Add Doctor'}
                </button>
                {editingDoctorId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDoctorId(null);
                      setDoctorForm({ name: '', specialty: '', image: '' });
                    }}
                    className="w-full bg-gray-400 text-white py-2 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map(doctor => (
                <div key={doctor.id} className="bg-gray-50 p-4 rounded-2xl flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{doctor.name}</h4>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => editDoctor(doctor)}
                      className="p-2 text-teal-600 hover:bg-teal-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => deleteDoctor(doctor.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Section */}
        {activeSection === 'services' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Services</h2>
            
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-bold text-gray-900 mb-4">{editingServiceId ? 'Edit Service' : 'Add New Service'}</h3>
              <div className="space-y-4">
                <input 
                  placeholder="Service Title"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
                />
                <textarea 
                  rows={3}
                  placeholder="Service Description"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={editingServiceId ? updateService : addService}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700"
                >
                  {editingServiceId ? 'Update Service' : 'Add Service'}
                </button>
                {editingServiceId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingServiceId(null);
                      setServiceForm({ title: '', description: '' });
                    }}
                    className="w-full bg-gray-400 text-white py-2 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <div key={service.id} className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{service.title}</h4>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => editService(service)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => deleteService(service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Careers Section */}
        {activeSection === 'careers' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage "Why Join Us" Benefits</h2>
            
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-bold text-gray-900 mb-4">{editingCareerId ? 'Edit Benefit' : 'Add New Benefit'}</h3>
              <div className="space-y-4">
                <input 
                  placeholder="Benefit Title"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200"
                  value={careerForm.title}
                  onChange={(e) => setCareerForm({...careerForm, title: e.target.value})}
                />
                <textarea 
                  rows={3}
                  placeholder="Benefit Description"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200"
                  value={careerForm.description}
                  onChange={(e) => setCareerForm({...careerForm, description: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={editingCareerId ? updateCareer : addCareer}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700"
                >
                  {editingCareerId ? 'Update Benefit' : 'Add Benefit'}
                </button>
                {editingCareerId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCareerId(null);
                      setCareerForm({ title: '', description: '' });
                    }}
                    className="w-full bg-gray-400 text-white py-2 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careers.map(career => (
                <div key={career.id} className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{career.title}</h4>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => editCareer(career)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => deleteCareer(career.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{career.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <button 
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:bg-gray-400"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminCMS;
