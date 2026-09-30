import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Smartphone, 
  Compass, 
  Sparkles,
  X
} from 'lucide-react';
import { TriggerLog, TriggerCategory } from '../../types';
import { storage } from '../../services/storage';

export const TriggerTrackerView: React.FC = () => {
  const [triggers, setTriggers] = useState<TriggerLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [triggerType, setTriggerType] = useState<TriggerCategory>('Late-night phone use');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Bedroom');
  const [device, setDevice] = useState('Smartphone');
  const [emotion, setEmotion] = useState('Boredom / Fatigue');
  const [intensity, setIntensity] = useState<number>(3);
  const [resisted, setResisted] = useState(true);

  useEffect(() => {
    loadTriggers();
  }, []);

  const loadTriggers = async () => {
    const list = await storage.getTriggers();
    setTriggers(list);
  };

  const handleSaveTrigger = async () => {
    const item: TriggerLog = {
      id: `trig_${Date.now()}`,
      trigger_type: triggerType,
      description: description.trim() || `Encountered temptation via ${device} in ${location}.`,
      location,
      device,
      emotion,
      intensity,
      resisted,
      date: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    await storage.saveTrigger(item);
    await loadTriggers();
    setShowAddModal(false);
    setDescription('');
  };

  // Compute pattern statistics
  const triggerCounts: Record<string, number> = {};
  for (const t of triggers) {
    const key = t.trigger_type;
    triggerCounts[key] = (triggerCounts[key] || 0) + 1;
  }

  let mostCommonTrigger = 'Late-night phone use';
  let maxCount = 0;
  for (const [k, v] of Object.entries(triggerCounts)) {
    if (v > maxCount) {
      maxCount = v;
      mostCommonTrigger = k;
    }
  }

  const resistedCount = triggers.filter(t => t.resisted).length;
  const resistedPct = triggers.length > 0 ? Math.round((resistedCount / triggers.length) * 100) : 100;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <Crosshair className="w-4 h-4" />
            <span>Spiritual Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Trigger Tracker & Pattern Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Understand the anatomy of temptation before it strikes. Discover high-risk times, devices, and emotional states so you can close the doors.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>LOG A TRIGGER / TEMPTATION</span>
        </button>
      </div>

      {/* Analytics Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Most Common Trigger</span>
          </div>
          <p className="text-lg font-bold text-slate-100 pt-1">
            {triggers.length > 0 ? mostCommonTrigger : 'Late-night phone use'}
          </p>
          <p className="text-[11px] text-slate-400">
            {triggers.length > 0 ? `${maxCount} incidents logged` : 'Sample insight: charge phone outside bedroom'}
          </p>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Resistance Victory Rate</span>
          </div>
          <p className="text-2xl font-mono font-bold text-emerald-300 pt-1">
            {resistedPct}%
          </p>
          <p className="text-[11px] text-slate-400">
            {resistedCount} of {triggers.length} recorded attacks resisted in Christ
          </p>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Strategic Action</span>
          </div>
          <p className="text-xs font-semibold text-slate-200 pt-1 leading-snug">
            Proactive Defense (Romans 13:14)
          </p>
          <p className="text-[11px] text-slate-400 leading-normal">
            Eliminate provisions. A trigger unaddressed is an open door for the adversary.
          </p>
        </div>

      </div>

      {/* Trigger History List */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Logged Triggers & Encounters
        </h3>

        {triggers.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <Compass className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-300 font-medium">No triggers recorded yet.</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Whenever you feel an urge or notice a vulnerable situation, log it here to identify patterns and prepare your defenses.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {triggers.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300 text-sm">{t.trigger_type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      t.resisted ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/60 text-red-300 border border-red-500/30'
                    }`}>
                      {t.resisted ? 'Resisted ✓' : 'Stumbled (Restored)'}
                    </span>
                  </div>
                  <p className="text-slate-300">{t.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    {t.location && <span>📍 {t.location}</span>}
                    {t.device && <span>📱 {t.device}</span>}
                    {t.emotion && <span>💭 {t.emotion}</span>}
                    <span>⚡ Intensity: {t.intensity || 3}/5</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 shrink-0 sm:text-right">
                  {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Trigger Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">Log Trigger / Temptation</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Trigger Category</label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                >
                  <option value="Late-night phone use">Late-night phone use</option>
                  <option value="Loneliness">Loneliness</option>
                  <option value="Stress">Stress</option>
                  <option value="Boredom">Boredom</option>
                  <option value="Anger">Anger</option>
                  <option value="Anxiety">Anxiety</option>
                  <option value="Social media">Social media</option>
                  <option value="Being alone">Being alone</option>
                  <option value="Certain websites">Certain websites</option>
                  <option value="Fatigue">Fatigue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Living room, Bedroom"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Device in Hand</label>
                  <input
                    type="text"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    placeholder="e.g. Phone, Laptop, Tablet"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Emotional State</label>
                <input
                  type="text"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder="e.g. Overwhelmed with tasks, feeling isolated"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Notes / Observations</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What specifically happened? What was the escape route taken?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Urge Intensity (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-[10px] text-amber-300 text-right">Level {intensity} of 5</div>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="resistedCheckbox"
                    checked={resisted}
                    onChange={(e) => setResisted(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="resistedCheckbox" className="font-semibold text-emerald-300 cursor-pointer">
                    I resisted this temptation in Christ
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTrigger}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Save Trigger Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
