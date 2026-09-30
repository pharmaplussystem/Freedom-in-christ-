import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Swords, 
  BookOpen, 
  HeartHandshake, 
  BookMarked, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  Copy,
  Check,
  TrendingUp,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ViewMode, ProgressSummary, Habit, HabitCompletion, PrayerAltarWatch } from '../../types';
import { DAILY_FOCUS_LIST, SCRIPTURE_LIBRARY } from '../../data/scriptures';
import { PRAYER_COLLECTION } from '../../data/prayers';
import { storage } from '../../services/storage';
import { Clock, Bell } from 'lucide-react';

interface HomeViewProps {
  onSelectView: (view: ViewMode) => void;
  onOpenEmergency: () => void;
  onOpenStumble: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectView,
  onOpenEmergency,
  onOpenStumble
}) => {
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayCompletions, setTodayCompletions] = useState<HabitCompletion[]>([]);
  const [altars, setAltars] = useState<PrayerAltarWatch[]>([]);
  const [copiedVerse, setCopiedVerse] = useState(false);

  // Daily deterministic index based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const dailyFocus = DAILY_FOCUS_LIST[dayOfYear % DAILY_FOCUS_LIST.length];
  const dailyScripture = SCRIPTURE_LIBRARY[dayOfYear % SCRIPTURE_LIBRARY.length];
  const dailyPrayer = PRAYER_COLLECTION[0]; // Foundational Surrender Prayer

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await storage.getProgressSummary();
    setProgress(p);
    const h = await storage.getHabits();
    setHabits(h.filter(item => item.active));
    const c = await storage.getHabitCompletions(todayStr);
    setTodayCompletions(c);
    const a = await storage.getPrayerAltars();
    setAltars(a);
  };

  const getNextAltar = () => {
    const activeList = altars.filter(a => a.active);
    if (activeList.length === 0) return null;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    let best = null;
    let minDiff = Infinity;
    for (const alt of activeList) {
      const [h, m] = alt.time.split(':').map(Number);
      let diff = (h * 60 + m) - currentMins;
      if (diff <= 0) diff += 1440;
      if (diff < minDiff) {
        minDiff = diff;
        best = { altar: alt, diffMins: diff };
      }
    }
    return best;
  };

  const nextWatch = getNextAltar();

  const toggleHabit = async (habitId: string) => {
    await storage.toggleHabitCompletion(habitId, todayStr);
    const updated = await storage.getHabitCompletions(todayStr);
    setTodayCompletions(updated);
  };

  const copyScripture = () => {
    navigator.clipboard.writeText(`"${dailyScripture.text}" — ${dailyScripture.reference}`);
    setCopiedVerse(true);
    setTimeout(() => setCopiedVerse(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* TODAY'S FOCUS BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today's Spiritual Focus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {dailyFocus.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif italic">
              "{dailyFocus.text}"
            </p>
            <div className="text-xs font-semibold text-amber-300/80">
              — {dailyFocus.verse}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onSelectView('daily-battle')}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>OPEN DAILY BATTLE PLAN</span>
            </button>
            <button
              onClick={onOpenEmergency}
              className="px-5 py-3 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-red-200" />
              <span>I'M BEING TEMPTED</span>
            </button>
          </div>
        </div>
      </div>

      {/* STREAK & THEOLOGICAL CLARITY CARD */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Progress Milestones
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              One day, one hour, one moment at a time in the power of the Holy Spirit.
            </p>
          </div>
          <button
            onClick={onOpenStumble}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-amber-300 transition cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>I Stumbled (Grace Flow)</span>
          </button>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
              {progress?.streak_porn_days ?? 0}
            </span>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">
              Days Free (Porn)
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
              {progress?.streak_masturbation_days ?? 0}
            </span>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">
              Days Free (Habits)
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {progress?.total_temptations_resisted ?? 0}
            </span>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">
              Temptations Overcome
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">
              {progress?.total_armor_prayers_completed ?? 0}
            </span>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">
              Armor Prayers
            </p>
          </div>
        </div>

        {/* CRITICAL THEOLOGICAL DISCLAIMER */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <strong>Biblical Reminder:</strong> A streak is a tracking tool, not a measure of your salvation, God’s love, or your personal worth. Your righteousness is in Jesus Christ alone (Romans 8:1).
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onOpenEmergency}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/40 text-center transition cursor-pointer group"
        >
          <ShieldAlert className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform mb-2" />
          <span className="text-xs font-bold text-red-200">I'm Tempted</span>
          <span className="text-[10px] text-red-300/70 mt-0.5">Emergency SOS</span>
        </button>

        <button
          onClick={() => onSelectView('prayer')}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition cursor-pointer group"
        >
          <Flame className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
          <span className="text-xs font-bold text-slate-200">Prayer Altar</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Watches & Alarms</span>
        </button>

        <button
          onClick={() => onSelectView('scripture')}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition cursor-pointer group"
        >
          <BookOpen className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform mb-2" />
          <span className="text-xs font-bold text-slate-200">Read Scripture</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Renew your mind</span>
        </button>

        <button
          onClick={() => onSelectView('journal')}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition cursor-pointer group"
        >
          <BookMarked className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform mb-2" />
          <span className="text-xs font-bold text-slate-200">Private Journal</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Reflect in the light</span>
        </button>
      </div>

      {/* PRAYER ALTAR & WATCH HIGHLIGHT */}
      {nextWatch && (
        <div className="rounded-3xl bg-slate-900/90 border border-amber-500/30 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Clock className="w-4 h-4" />
              <span>Next Consecrated Prayer Altar Watch</span>
            </div>
            <div className="flex items-baseline gap-2.5">
              <h4 className="text-lg sm:text-xl font-bold text-slate-100">
                {nextWatch.altar.title}
              </h4>
              <span className="text-sm sm:text-base font-mono font-bold text-amber-300">
                {nextWatch.altar.time} ({Math.floor(nextWatch.diffMins / 60) > 0 ? `${Math.floor(nextWatch.diffMins / 60)}h ` : ''}{nextWatch.diffMins % 60}m)
              </span>
              {nextWatch.altar.alarm_enabled && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-semibold">
                  <Bell className="w-3 h-3" /> Alarm ON
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-serif italic line-clamp-1">
              "{nextWatch.altar.scripture_text}" — {nextWatch.altar.scripture_ref}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectView('prayer')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Enter Altar Sanctuary</span>
            </button>
          </div>
        </div>
      )}

      {/* SCRIPTURE & PRAYER DUAL SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TODAY'S SCRIPTURE */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Today's Scripture
              </span>
              <button
                onClick={copyScripture}
                className="text-slate-400 hover:text-amber-300 transition p-1 cursor-pointer"
                title="Copy verse"
              >
                {copiedVerse ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <blockquote className="mt-4 text-base text-slate-200 font-serif italic leading-relaxed">
              "{dailyScripture.text}"
            </blockquote>
            <p className="text-xs font-bold text-amber-300 text-right mt-2">
              — {dailyScripture.reference} ({dailyScripture.translation})
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-normal">
              <span className="font-semibold text-amber-400">Application: </span>
              {dailyScripture.application}
            </div>
          </div>
          <button
            onClick={() => onSelectView('scripture')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <span>Explore Scripture Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TODAY'S PRAYER */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5" />
                Today's Prayer
              </span>
              <span className="text-[11px] text-slate-400 font-serif italic">Declaration of Dependence</span>
            </div>
            <div className="mt-4 text-xs sm:text-sm text-slate-200 font-serif leading-relaxed line-clamp-6 space-y-2">
              <p className="italic">
                "Lord Jesus Christ, I come before You right now, not in my own strength, not in my own righteousness, but in complete and utter dependence on You. I am weak, but You are strong. I am not fighting for victory; I am fighting from victory..."
              </p>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
              <span className="font-semibold text-amber-400">Daily Challenge: </span>
              {dailyFocus.challenge}
            </div>
          </div>
          <button
            onClick={() => onSelectView('prayer')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <span>Open Prayer Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* DAILY SPIRITUAL HABITS QUICK CHECK */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Today's Spiritual Disciplines
            </h3>
            <p className="text-xs text-slate-400">
              {todayCompletions.length} of {habits.length} habits completed today
            </p>
          </div>
          <button
            onClick={() => onSelectView('habits')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Habits</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {habits.map((habit) => {
            const isCompleted = todayCompletions.some(c => c.habit_id === habit.id);
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800/90 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <div className="truncate">
                  <p className="text-xs font-semibold truncate">{habit.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{habit.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
