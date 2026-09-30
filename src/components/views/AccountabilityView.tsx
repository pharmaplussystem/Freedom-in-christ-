import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  MessageSquare, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  Copy, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { AccountabilityContact } from '../../types';
import { storage } from '../../services/storage';

export const AccountabilityView: React.FC = () => {
  const [contacts, setContacts] = useState<AccountabilityContact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Pastor / Mentor');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const list = await storage.getContacts();
    setContacts(list);
  };

  const handleSaveContact = async () => {
    if (!name.trim()) return;

    const contact: AccountabilityContact = {
      id: `contact_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      relationship,
      notes: notes.trim(),
      created_at: new Date().toISOString()
    };

    await storage.saveContact(contact);
    await loadContacts();
    setShowAddModal(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this accountability contact?')) {
      await storage.deleteContact(id);
      await loadContacts();
    }
  };

  const templates = [
    {
      title: 'Urgent Temptation Prayer Request',
      text: 'Brother, please pray for me right now. I am facing intense temptation and need to stand firm in Christ. Standing on 1 Corinthians 10:13.'
    },
    {
      title: 'Honest Victory Check-In',
      text: 'Praising God today! By His grace, stood firm and resisted temptation this week. Walking in the light.'
    },
    {
      title: 'Honest Stumble & Repentance',
      text: 'Brother, I want to keep everything in the light. I stumbled yesterday, but I have repented before the Lord, received His grace, and got back up. Would appreciate your prayer today.'
    }
  ];

  const handleCopyTemplate = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(title);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <Users className="w-4 h-4" />
            <span>Ecclesiastes 4:9–12</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Accountability & Brotherhood
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            "Two are better than one... if they fall, one will lift up his fellow." Secrecy is the nursery of sin; light brings freedom.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ADD ACCOUNTABILITY PARTNER</span>
        </button>
      </div>

      {/* PRIVACY GUARANTEE */}
      <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 flex items-start gap-3 text-xs text-slate-300">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-100">Strict Privacy Guarantee:</strong> Adding a partner is 100% optional. The app will <em>never</em> automatically contact anyone or reveal your personal data without your explicit action. You control every message and call.
        </p>
      </div>

      {/* CONTACTS LIST */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Your Trusted Circle
        </h3>

        {contacts.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-300 font-medium">No accountability contacts added yet.</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Consider asking a trusted pastor, mature Christian friend, or mentor to stand with you in prayer and truth.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-100">{contact.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800">
                      {contact.relationship}
                    </span>
                  </div>
                  {contact.notes && (
                    <p className="text-xs text-slate-400">{contact.notes}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>Call</span>
                      </a>
                    )}
                    {contact.phone && (
                      <a
                        href={`sms:${contact.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-3 h-3 text-blue-400" />
                        <span>Text</span>
                      </a>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Mail className="w-3 h-3 text-amber-400" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK MESSAGE TEMPLATES */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Quick Accountability Templates
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Copy and send to your brother in moments when typing is difficult:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templates.map((tpl) => (
            <div
              key={tpl.title}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-3"
            >
              <div>
                <h4 className="text-xs font-bold text-amber-300">{tpl.title}</h4>
                <p className="text-xs text-slate-300 mt-2 font-serif italic leading-relaxed">
                  "{tpl.text}"
                </p>
              </div>
              <button
                onClick={() => handleCopyTemplate(tpl.text, tpl.title)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {copiedTemplate === tpl.title ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ADD CONTACT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">Add Accountability Partner</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pastor David or John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Phone (Call/SMS)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                >
                  <option value="Pastor / Elder">Pastor / Elder</option>
                  <option value="Christian Mentor">Christian Mentor</option>
                  <option value="Mature Brother in Christ">Mature Brother in Christ</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Close Friend">Close Friend</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Notes / Availability</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Free after 6pm; check in weekly on Tuesdays"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContact}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
