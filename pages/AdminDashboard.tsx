
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  Eye, 
  FileText, 
  Clock, 
  ChevronRight,
  User,
  ExternalLink,
  ShieldAlert,
  Settings
} from 'lucide-react';
import { fetchAppointments, fetchApplications, updateApplicationStatus } from '../services/firebaseService';
import { sendApprovalEmail } from '../services/emailService';
import { Appointment, JobApplication } from '../types';
import AdminCMS from './AdminCMS';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'applications' | 'cms'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Approval Form State
  const [approvalForm, setApprovalForm] = useState({
    approvedPosition: '',
    amount: '',
    startDate: '',
    department: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    // Show local data immediately if available to reduce perceived loading time
    const localApps = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    if (localApps.length > 0) {
      setApplications(localApps);
    }
    
    setLoading(true);
    try {
      const [appsData, jobsData] = await Promise.all([
        fetchAppointments(),
        fetchApplications()
      ]);
      setAppointments(appsData);
      setApplications(jobsData);
    } catch (err) {
      console.error("Data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const openApproval = (app: JobApplication) => {
    setSelectedApp(app);
    setApprovalForm({
      ...approvalForm,
      approvedPosition: app.position
    });
    setIsApprovalModalOpen(true);
  };

  const [approvalMessage, setApprovalMessage] = useState('');

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSubmitting(true);
    setApprovalMessage('');
    
    // 1. Update Firestore
    const success = await updateApplicationStatus(selectedApp.id!, 'Approved', approvalForm);
    
    if (success) {
      // 2. Send Email Notification
      const emailResult = await sendApprovalEmail(selectedApp, approvalForm);
      
      // Show email status message
      setApprovalMessage(emailResult.message);
      
      // 3. Reset and Refresh
      setTimeout(async () => {
        setIsApprovalModalOpen(false);
        setSelectedApp(null);
        setApprovalMessage('');
        await loadData();
      }, 1500);
    } else {
      setApprovalMessage('Failed to update application status');
    }
    setSubmitting(false);
  };

  const handleReject = async (id: string) => {
    if (window.confirm('Are you sure you want to reject this applicant?')) {
      await updateApplicationStatus(id, 'Rejected');
      await loadData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex animate-fadeIn">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center space-x-2 mb-12">
          <div className="bg-teal-600 p-2 rounded-lg text-white">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-900">Admin</span>
        </div>

        <nav className="flex-grow space-y-2">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'appointments' ? 'bg-teal-50 text-teal-600 shadow-sm shadow-teal-600/10' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Appointments</span>
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'applications' ? 'bg-teal-50 text-teal-600 shadow-sm shadow-teal-600/10' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Job Applications</span>
          </button>
          <button 
            onClick={() => setActiveTab('cms')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'cms' ? 'bg-teal-50 text-teal-600 shadow-sm shadow-teal-600/10' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Content Manager</span>
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {activeTab === 'appointments' ? 'Patient Appointments' : 'Career Applications'}
            </h1>
            <p className="text-gray-500 mt-1">Management dashboard for LuminaHealth Hospital</p>
          </div>
          <div className="flex items-center space-x-4">
             <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-medium text-gray-600">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
             </div>
          </div>
        </header>

        {loading && activeTab !== 'cms' ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'cms' ? (
          <AdminCMS />
        ) : activeTab === 'appointments' ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Doctor ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold">
                          {app.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{app.fullName}</div>
                          <div className="text-xs text-gray-400">ID: {app.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-700">{app.date}</div>
                      <div className="text-xs text-gray-400">{app.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{app.email}</div>
                      <div className="text-sm text-gray-600">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">DOC#{app.doctorId}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-teal-600">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative group">
                <div className="absolute top-6 right-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Approved' ? 'bg-teal-50 text-teal-600' : 
                    app.status === 'Rejected' ? 'bg-red-50 text-red-600' : 
                    'bg-yellow-50 text-yellow-600'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                    <img 
                      src={typeof app.passportPhoto === 'string' ? app.passportPhoto : 'https://via.placeholder.com/150'} 
                      alt="Passport" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{app.fullName}</h3>
                    <p className="text-teal-600 font-semibold text-sm">{app.position}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{app.yearsOfExperience} years experience</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="w-4 h-4 mr-2" />
                    <a href={typeof app.cv === 'string' ? app.cv : '#'} target="_blank" className="text-sky-600 hover:underline flex items-center">
                      View CV <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

                {app.status === 'Pending' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => openApproval(app)}
                      className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => handleReject(app.id!)}
                      className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}

                {app.status === 'Approved' && app.approvalDetails && (
                  <div className="mt-4 p-4 bg-teal-50 rounded-2xl border border-teal-100 text-xs">
                    <div className="font-bold text-teal-700 mb-1">Approved Placement</div>
                    <div className="grid grid-cols-2 gap-2 text-teal-600">
                      <div><span className="font-semibold">Dept:</span> {app.approvalDetails.department}</div>
                      <div><span className="font-semibold">Start:</span> {app.approvalDetails.startDate}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Approval Modal */}
      {isApprovalModalOpen && selectedApp && (
        <div className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-zoomIn">
            <div className="bg-teal-600 p-8 text-white">
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-2xl font-bold">Approve Application</h2>
                 <button onClick={() => setIsApprovalModalOpen(false)}><XCircle className="w-6 h-6" /></button>
              </div>
              <p className="opacity-90">Review and finalize employment for {selectedApp.fullName}</p>
            </div>

            {approvalMessage && (
              <div className={`p-4 border-b ${approvalMessage.includes('success') || approvalMessage.includes('sent') ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                {approvalMessage}
              </div>
            )}

            <form onSubmit={handleApprove} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Approved Position</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                    value={approvalForm.approvedPosition}
                    onChange={e => setApprovalForm({...approvalForm, approvedPosition: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Salary / Fees</label>
                  <input 
                    required
                    placeholder="$50,000 / Year"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                    value={approvalForm.amount}
                    onChange={e => setApprovalForm({...approvalForm, amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                  <input 
                    required
                    type="date"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                    value={approvalForm.startDate}
                    onChange={e => setApprovalForm({...approvalForm, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                  <input 
                    required
                    placeholder="E.g. Cardiology"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                    value={approvalForm.department}
                    onChange={e => setApprovalForm({...approvalForm, department: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Additional Notes</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                  placeholder="Orientation details, HR requirements..."
                  value={approvalForm.notes}
                  onChange={e => setApprovalForm({...approvalForm, notes: e.target.value})}
                ></textarea>
              </div>

              <button 
                disabled={submitting}
                className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-all disabled:bg-gray-400"
              >
                {submitting ? 'Processing Approval...' : 'Confirm Approval & Send Email'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
