import React, { useState } from 'react';
import { X, CheckCircle, User, Phone, Mail, Hash, BookOpen, Send, Sparkles } from 'lucide-react';
import { ApplicationItem } from '../types';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (app: Omit<ApplicationItem, 'id' | 'submittedAt'>) => Promise<boolean>;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    reg: '',
    semester: '1st Semester',
    shift: '1st Shift',
    phone: '',
    email: '',
    interestDomain: 'Web Development',
    whyJoin: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.roll.trim() || !formData.phone.trim()) {
      setError('Please provide your Name, Roll Number, and Phone Number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const ok = await onSubmit(formData);
      if (ok) {
        setSubmitted(true);
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      roll: '',
      reg: '',
      semester: '1st Semester',
      shift: '1st Shift',
      phone: '',
      email: '',
      interestDomain: 'Web Development',
      whyJoin: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[#003366] mb-2">Registration Submitted!</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
              Thank you, <span className="font-bold text-[#003366]">{formData.name}</span>! Your joining application for the SPI IT Club has been saved. The executive committee will contact you via WhatsApp/Phone soon.
            </p>
            <button
              onClick={handleReset}
              className="bg-[#003366] hover:bg-slate-800 text-[#F5B012] font-bold px-6 py-2.5 rounded-xl text-sm transition shadow cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#003366] text-[#F5B012] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#003366]">Membership Joining Form</h3>
              <p className="text-xs text-slate-500 mt-1">Shariatpur Polytechnic Institute • Computer Department (CST)</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sourov Saha"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number *</label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 581234"
                      value={formData.roll}
                      onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 15020..."
                    value={formData.reg}
                    onChange={(e) => setFormData({ ...formData, reg: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm bg-white"
                  >
                    {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'].map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm bg-white"
                  >
                    <option value="1st Shift">1st Shift</option>
                    <option value="2nd Shift">2nd Shift</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Tech Interest</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={formData.interestDomain}
                    onChange={(e) => setFormData({ ...formData, interestDomain: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm bg-white"
                  >
                    <option value="Web Development">Web Development (HTML/CSS/JS/React)</option>
                    <option value="App Development">App Development (Android / Flutter)</option>
                    <option value="Cyber Security">Cyber Security &amp; Ethical Hacking</option>
                    <option value="Data Science &amp; Python">Data Science &amp; Python</option>
                    <option value="Basic Computer &amp; Hardware">Basic Computer &amp; Hardware</option>
                    <option value="Python Programming">Python Programming &amp; Automation</option>
                    <option value="Java Programming">Java &amp; OOP Foundations</option>
                    <option value="Graphic Design">Graphic Design &amp; UI/UX</option>
                    <option value="Video Editing">Video Editing &amp; Content Creation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Why do you want to join? (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Share your goals or skills you want to learn..."
                  value={formData.whyJoin}
                  onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003366] hover:bg-slate-800 text-[#F5B012] font-black py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting Application...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Membership Application</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
