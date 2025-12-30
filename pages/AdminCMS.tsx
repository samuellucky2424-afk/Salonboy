import React, { useState, useEffect } from 'react';
import { Save, Plus, X, Image as ImageIcon, FileText } from 'lucide-react';
import { updateHomepageContent, getHomepageContent } from '../services/firebaseService';

const AdminCMS: React.FC = () => {
  const [heroTitle, setHeroTitle] = useState('Healing Hands, Caring Hearts, Brighter Futures.');
  const [heroDescription, setHeroDescription] = useState('Experience world-class healthcare with a personal touch.');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const content = await getHomepageContent();
    if (content) {
      setHeroTitle(content.heroTitle || heroTitle);
      setHeroDescription(content.heroDescription || heroDescription);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const success = await updateHomepageContent({
      heroTitle,
      heroDescription
    });

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Homepage Content Management</h1>
        <p className="text-gray-500 mt-1">Manage and customize your homepage content</p>
      </header>

      {saveSuccess && (
        <div className="mb-6 bg-teal-50 border border-teal-200 text-teal-700 p-4 rounded-xl">
          ✓ Changes saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-12">
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
              <p className="text-xs text-gray-500 mt-2">This appears as the large headline on the homepage</p>
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
              <p className="text-xs text-gray-500 mt-2">Supporting text under the main heading</p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Management</h2>
          <p className="text-gray-600 mb-4">Services are currently managed through the constants file. Contact your developer to add more services.</p>
          <p className="text-sm text-gray-500">In a full CMS, you would be able to add/edit/delete services here.</p>
        </div>

        {/* Doctors Section */}
        <div className="mb-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctors Management</h2>
          <p className="text-gray-600 mb-4">Doctors are currently managed through the constants file. Contact your developer to add more doctors.</p>
          <p className="text-sm text-gray-500">In a full CMS, you would be able to add/edit/delete doctor profiles here.</p>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:bg-gray-400"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCMS;
