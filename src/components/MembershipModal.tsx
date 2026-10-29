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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="neo-box-lg bg-[#FFFDF7] rounded-2xl max-w-xl w-full p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        
        <button
          onClick={handleReset}
          className="neo-btn absolute top-5 right-5 bg-white text-black p-1.5 rounded-lg cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#10B981] border-2 border-black text-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_#000]">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black text-black mb-2 uppercase">Registration Submitted!</h3>
            <p className="text-slate-800 text-sm max-w-md mx-auto mb-6 font-medium">
              Thank you, <span className="font-black text-black">{formData.name}</span>! Your application for SPI IT Club has been saved. The executive committee will contact you via WhatsApp/Phone soon.
            </p>
            <button
              onClick={handleReset}
              className="neo-btn bg-[#FFE600] text-black font-black px-6 py-2.5 rounded-xl text-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#FFE600] border-2 border-black text-black rounded-xl flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0px_#000]">
                <Sparkles className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-black text-black uppercase">Membership Joining Form</h3>
              <p className="text-xs text-slate-700 font-bold mt-1">Shariatpur Polytechnic Institute • Computer Department (CST)</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#FF5A5F]/20 border-2 border-black text-black text-xs rounded-lg font-black shadow-[2px_2px_0px_#000]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-black absolute left-3 top-3 stroke-[2.5]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sourov Saha"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-2 border-black rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm bg-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">Roll Number *</label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-black absolute left-3 top-3 stroke-[2.5]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 581234"
                      value={formData.roll}
                      onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                      className="w-full border-2 border-black rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 15020..."
                    value={formData.reg}
                    onChange={(e) => setFormData({ ...formData, reg: e.target.value })}
                    className="w-full border-2 border-black rounded-lg px-3 py-2.5 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm bg-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full border-2 border-black rounded-lg px-3 py-2.5 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm bg-white font-bold"
                  >
                    {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'].map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full border-2 border-black rounded-lg px-3 py-2.5 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm bg-white font-bold"
                  >
                    <option value="1st Shift">1st Shift</option>
                    <option value="2nd Shift">2nd Shift</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">WhatsApp / Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-black absolute left-3 top-3 stroke-[2.5]" />
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border-2 border-black rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-black absolute left-3 top-3 stroke-[2.5]" />
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border-2 border-black rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Primary Tech Interest</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-black absolute left-3 top-3 stroke-[2.5]" />
                  <select
                    value={formData.interestDomain}
                    onChange={(e) => setFormData({ ...formData, interestDomain: e.target.value })}
                    className="w-full border-2 border-black rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm bg-white font-bold"
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
                <label className="block text-xs font-black text-black uppercase mb-1">Why do you want to join? (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Share your goals or skills you want to learn..."
                  value={formData.whyJoin}
                  onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                  className="w-full border-2 border-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:shadow-[3px_3px_0px_#000] bg-white font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="neo-btn w-full bg-[#FFE600] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Submitting Application...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2.5]" />
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
