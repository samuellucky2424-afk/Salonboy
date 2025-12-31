
import React, { useState, useEffect } from 'react';
import { Upload, FileText, UserCircle, CheckCircle2, Briefcase } from 'lucide-react';
import { JOB_ROLES } from '../constants';
import { submitJobApplication, getHomepageContent } from '../services/firebaseService';
import { JobApplication } from '../types';

const CareersPage: React.FC = () => {
  const [careerBenefits, setCareerBenefits] = useState<any[]>([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const data = await getHomepageContent();
    if (data?.careers) {
      setCareerBenefits(data.careers);
    }
  };
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    yearsOfExperience: 0,
    passportPhoto: null as File | null,
    cv: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'passportPhoto' | 'cv') => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.position) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!formData.passportPhoto || !formData.cv) {
      alert('Please upload both passport photo and CV');
      return;
    }
    
    setIsSubmitting(true);
    
    // Construct valid application object
    const application: any = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      yearsOfExperience: formData.yearsOfExperience,
      passportPhoto: formData.passportPhoto,
      cv: formData.cv,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      // Use a timeout - max 3 seconds to submit
      const result = await Promise.race([
        submitJobApplication(application),
        new Promise<boolean>((_, reject) => 
          setTimeout(() => reject(new Error('Submission timeout')), 3000)
        )
      ]);
      
      if (result) {
        setIsSuccess(true);
        // Clean up form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          position: '',
          yearsOfExperience: 0,
          passportPhoto: null as File | null,
          cv: null as File | null
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an issue submitting your application. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md animate-bounceIn">
          <CheckCircle2 className="w-20 h-20 text-teal-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Received!</h2>
          <p className="text-gray-600 mb-8">
            Our HR department will review your profile and get back to you if you are a good match for the role.
          </p>
          <button onClick={() => setIsSuccess(false)} className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors">
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Become part of a world-class healthcare institution. We are always looking for passionate and skilled professionals across 15+ different departments to help us deliver excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Why join us */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why LuminaHealth?</h3>
            {(careerBenefits.length > 0 ? careerBenefits : [
              { title: 'Global Recognition', desc: 'Work with the best in the industry with global standards.' },
              { title: 'Continuous Growth', desc: 'Training and development programs for every staff member.' },
              { title: 'Modern Facilities', desc: 'Access to the latest medical technology and equipment.' },
              { title: 'Inclusive Culture', desc: 'A diverse and supportive work environment for all.' }
            ]).map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-teal-600 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input 
                      required
                      type="email"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                    <input 
                      required
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Position Applied For</label>
                    <select 
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      value={formData.position}
                      onChange={e => setFormData({...formData, position: e.target.value})}
                    >
                      <option value="">Select a Role</option>
                      {JOB_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                  <input 
                    required
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    value={formData.yearsOfExperience}
                    onChange={e => setFormData({...formData, yearsOfExperience: parseInt(e.target.value) || 0})}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Passport Photo</label>
                    <div className="relative group cursor-pointer">
                      <input 
                        required
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'passportPhoto')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${
                        formData.passportPhoto ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-gray-200 text-gray-400 group-hover:border-teal-500 group-hover:bg-teal-50'
                      }`}>
                        {formData.passportPhoto ? (
                          <div className="flex flex-col items-center">
                            <UserCircle className="w-10 h-10 mb-2" />
                            <span className="text-xs font-bold truncate max-w-[150px]">{formData.passportPhoto.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 mb-2" />
                            <span className="text-xs font-medium">Upload Image</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Curriculum Vitae (PDF)</label>
                    <div className="relative group cursor-pointer">
                      <input 
                        required
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, 'cv')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${
                        formData.cv ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-gray-200 text-gray-400 group-hover:border-teal-500 group-hover:bg-teal-50'
                      }`}>
                        {formData.cv ? (
                          <div className="flex flex-col items-center">
                            <FileText className="w-10 h-10 mb-2" />
                            <span className="text-xs font-bold truncate max-w-[150px]">{formData.cv.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 mb-2" />
                            <span className="text-xs font-medium">Upload CV</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
