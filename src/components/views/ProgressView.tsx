import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  RotateCcw, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ProgressSummary, StumbleLog } from '../../types';
import { storage } from '../../services/storage';

interface ProgressViewProps {
  onOpenStumble: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onOpenStumble }) => {
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [stumbles, setStumbles] = useState<StumbleLog[]>([]);
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await storage.getProgressSummary();
    setProgress(p);
    const s = await storage.getStumbles();
    setStumbles(s);
    const j = await storage.getJournalEntries();
    setJournalCount(j.length);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" />
            <span>Sanctification Journey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Progress & Spiritual Growth
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            "He who began a good work in you will bring it to completion at the day of Jesus Christ." (Philippians 1:6).
          </p>
        </div>

        <button
          onClick={onOpenStumble}
          className="px-6 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>I STUMBLED (GRACE FLOW)</span>
        </button>
      </div>

      {/* CORE THEOLOGICAL CLARITY BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Grace Foundation (Must Read)</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-serif italic">
          "Progress is not the same thing as righteousness or salvation. If you have been clean for 1 day or 1,000 days, your acceptance before God is rooted 100% in the blood of Jesus Christ, never in your personal score. You fight from victory, not for victory."
        </p>
      </div>

      {/* Major Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-mono font-extrabold text-amber-300">
            {progress?.streak_porn_days ?? 0}
          </span>
          <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Days Free (Porn)
          </p>
          <p className="text-[10px] text-slate-400">Eyes & mind guarded</p>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-mono font-extrabold text-amber-300">
            {progress?.streak_masturbation_days ?? 0}
          </span>
          <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Days Free (Habits)
          </p>
          <p className="text-[10px] text-slate-400">Body in self-control</p>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-mono font-extrabold text-emerald-400">
            {progress?.total_temptations_resisted ?? 0}
          </span>
          <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Attacks Overcome
          </p>
          <p className="text-[10px] text-slate-400">Arrows extinguished</p>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-mono font-extrabold text-blue-400">
            {progress?.total_armor_prayers_completed ?? 0}
          </span>
          <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Armor Prayers
          </p>
          <p className="text-[10px] text-slate-400">Armed in Christ</p>
        </div>

      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Scripture Meditation Days</span>
            <span className="text-xl font-bold text-slate-100 font-mono">
              {progress?.total_scripture_reading_days ?? 1}
            </span>
          </div>
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Daily Prayer Days</span>
            <span className="text-xl font-bold text-slate-100 font-mono">
              {progress?.total_prayer_days ?? 1}
            </span>
          </div>
          <Heart className="w-5 h-5 text-amber-400" />
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Private Journal Entries</span>
            <span className="text-xl font-bold text-slate-100 font-mono">{journalCount}</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>

      </div>

      {/* STUMBLE & RESTORATION HISTORY */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Restoration Logs & Lessons Learned
            </h3>
            <p className="text-xs text-slate-400">
              Proverbs 24:16 — "The righteous falls seven times and rises again."
            </p>
          </div>
          <span className="text-xs text-amber-400/90 font-medium">
            {stumbles.length} instances forgiven & restored
          </span>
        </div>

        {stumbles.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No stumbles logged. If you ever stumble, remember to bring it into the light immediately without shame.
          </div>
        ) : (
          <div className="space-y-3">
            {stumbles.map((stumble) => (
              <div
                key={stumble.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">
                    Restored in Christ on {new Date(stumble.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-emerald-400 font-semibold">1 John 1:9 Cleansed</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Identified Trigger: </span>
                  {stumble.trigger} ({stumble.feeling})
                </div>
                {stumble.what_to_change_next_time && (
                  <div className="text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-semibold text-amber-300 block mb-0.5">Lesson / Change:</span>
                    {stumble.what_to_change_next_time}
                  </div>
                )}
                {stumble.recovery_plan && (
                  <div className="text-slate-300">
                    <span className="text-emerald-400 font-semibold">Commitment: </span>
                    {stumble.recovery_plan}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
