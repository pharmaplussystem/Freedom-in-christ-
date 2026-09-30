import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Circle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Play, 
  Square,
  X
} from 'lucide-react';
import { Habit, HabitCompletion, FastingRecord } from '../../types';
import { storage } from '../../services/storage';

export const HabitsView: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [fastingRecords, setFastingRecords] = useState<FastingRecord[]>([]);
  
  // New habit modal state
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDesc, setNewHabitDesc] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<Habit['category']>('spiritual');

  // Fasting Tracker State
  const [fastIntention, setFastIntention] = useState('');
  const [fastNotes, setFastNotes] = useState('');
  const [activeFast, setActiveFast] = useState<FastingRecord | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const h = await storage.getHabits();
    setHabits(h);
    const c = await storage.getHabitCompletions(todayStr);
    setCompletions(c);
    const f = await storage.getFastingRecords();
    setFastingRecords(f);
    const currentActive = f.find(r => r.is_active);
    setActiveFast(currentActive || null);
  };

  const handleToggleHabit = async (habitId: string) => {
    await storage.toggleHabitCompletion(habitId, todayStr);
    const c = await storage.getHabitCompletions(todayStr);
    setCompletions(c);
  };

  const handleCreateHabit = async () => {
    if (!newHabitName.trim()) return;

    const newH: Habit = {
      id: `habit_${Date.now()}`,
      name: newHabitName.trim(),
      description: newHabitDesc.trim() || 'Daily spiritual discipline',
      frequency: 'daily',
      category: newHabitCategory,
      icon: 'shield',
      active: true,
      created_at: new Date().toISOString()
    };

    await storage.saveHabit(newH);
    await loadData();
    setShowAddHabit(false);
    setNewHabitName('');
    setNewHabitDesc('');
  };

  const handleStartFast = async () => {
    const record: FastingRecord = {
      id: `fast_${Date.now()}`,
      start_time: new Date().toISOString(),
      intention: fastIntention.trim() || 'Spiritual clarity and victory over temptation',
      notes: fastNotes.trim(),
      is_active: true,
      created_at: new Date().toISOString()
    };
    await storage.saveFastingRecord(record);
    await loadData();
    setFastIntention('');
    setFastNotes('');
  };

  const handleEndFast = async () => {
    if (!activeFast) return;
    const updated: FastingRecord = {
      ...activeFast,
      end_time: new Date().toISOString(),
      is_active: false
    };
    await storage.saveFastingRecord(updated);
    await loadData();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <CheckSquare className="w-4 h-4" />
            <span>Spiritual Disciplines</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Daily Habits & Fasting
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            "Train yourself for godliness; for while bodily training is of some value, godliness is of value in every way." (1 Timothy 4:7-8).
          </p>
        </div>

        <button
          onClick={() => setShowAddHabit(true)}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW HABIT</span>
        </button>
      </div>

      {/* HABITS CHECKLIST */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Today's Discipline Checklist
            </h3>
            <p className="text-xs text-slate-400">
              {completions.length} of {habits.length} completed for {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">
            {habits.length > 0 ? Math.round((completions.length / habits.length) * 100) : 0}% Complete
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {habits.map((habit) => {
            const isCompleted = completions.some(c => c.habit_id === habit.id);
            return (
              <div
                key={habit.id}
                onClick={() => handleToggleHabit(habit.id)}
                className={`p-4 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100 shadow-inner'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold">{habit.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{habit.description}</p>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                  {habit.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FASTING & PRAYER SECTION */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Flame className="w-4 h-4" />
              <span>Biblical Fasting & Prayer</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mt-1">Spiritual Fasting Tracker</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Humbling the soul, breaking stubborn strongholds, and seeking God with undivided focus.
            </p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-[10px] text-amber-300">
            Spiritual tracking only (not medical instructions)
          </div>
        </div>

        {activeFast ? (
          <div className="rounded-2xl bg-amber-950/30 border border-amber-500/40 p-6 text-center space-y-4">
            <div className="inline-block p-3 rounded-full bg-amber-500/20 text-amber-300 animate-pulse">
              <Flame className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-amber-200">Active Spiritual Fast in Progress</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Started: {new Date(activeFast.start_time).toLocaleString()}
            </p>
            <div className="bg-slate-950/80 p-4 rounded-xl max-w-md mx-auto border border-slate-800 text-xs text-amber-100 italic font-serif">
              "{activeFast.intention}"
            </div>

            <button
              onClick={handleEndFast}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Square className="w-4 h-4" />
              <span>CONCLUDE FAST WITH PRAYER</span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="text-xs text-slate-300">
              <h4 className="font-bold text-slate-200 mb-1">Begin a Spiritual Fast</h4>
              <p className="text-slate-400 leading-relaxed">
                Whether skipping one meal for prayer or a designated digital fast, dedicate this time specifically to seeking Christ and interceding for freedom.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Prayer Intention</label>
                <input
                  type="text"
                  value={fastIntention}
                  onChange={(e) => setFastIntention(e.target.value)}
                  placeholder="e.g. Breakthrough against late-night temptation"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Notes / Duration Plan</label>
                <input
                  type="text"
                  value={fastNotes}
                  onChange={(e) => setFastNotes(e.target.value)}
                  placeholder="e.g. Lunchtime dedicated to Psalm 51 prayer"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleStartFast}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>START FAST</span>
            </button>
          </div>
        )}

        {/* Fasting History */}
        {fastingRecords.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Past Spiritual Fasts
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {fastingRecords.filter(r => !r.is_active).map(r => (
                <div key={r.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-amber-300">{r.intention}</span>
                    <p className="text-[11px] text-slate-400">{new Date(r.start_time).toLocaleDateString()}</p>
                  </div>
                  <span className="text-emerald-400 text-[10px] font-bold">Completed</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ADD HABIT MODAL */}
      {showAddHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">Add Spiritual Habit</h3>
              <button
                onClick={() => setShowAddHabit(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Habit Name</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g. 15-Minute Worship Before Bed"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Description</label>
                <input
                  type="text"
                  value={newHabitDesc}
                  onChange={(e) => setNewHabitDesc(e.target.value)}
                  placeholder="e.g. Listen to psalms and hymns to quiet my mind"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Category</label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                >
                  <option value="spiritual">Spiritual (Scripture, Prayer, Fasting)</option>
                  <option value="physical">Physical (Exercise, Sleep boundary)</option>
                  <option value="mental">Mental (Meditation, Reading)</option>
                  <option value="accountability">Accountability (Check-ins)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddHabit(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateHabit}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Save Habit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
