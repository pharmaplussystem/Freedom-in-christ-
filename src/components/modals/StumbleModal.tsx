import React, { useState } from 'react';
import { 
  Heart, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { storage } from '../../services/storage';
import { StumbleLog, TriggerCategory } from '../../types';

interface StumbleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStumbleRecorded: () => void;
}

export const StumbleModal: React.FC<StumbleModalProps> = ({
  isOpen,
  onClose,
  onStumbleRecorded
}) => {
  const [step, setStep] = useState<number>(1);
  const [trigger, setTrigger] = useState<TriggerCategory>('Late-night phone use');
  const [location, setLocation] = useState('Bedroom / Alone');
  const [feeling, setFeeling] = useState('Stress & Fatigue');
  const [whatHappenedBefore, setWhatHappenedBefore] = useState('');
  const [whatToChange, setWhatToChange] = useState('');
  const [recoveryPlan, setRecoveryPlan] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const triggerOptions: TriggerCategory[] = [
    'Late-night phone use',
    'Loneliness',
    'Stress',
    'Boredom',
    'Anger',
    'Anxiety',
    'Social media',
    'Being alone',
    'Certain websites',
    'Fatigue',
    'Other'
  ];

  const handleFinish = async () => {
    setSaving(true);
    try {
      const log: StumbleLog = {
        id: `stumble_${Date.now()}`,
        date: new Date().toISOString(),
        trigger,
        location,
        feeling,
        what_happened_before: whatHappenedBefore,
        what_to_change_next_time: whatToChange,
        recovery_plan: recoveryPlan || 'Begin again today in Christ. Keep phone outside bedroom tonight.',
        confession_made: true,
        received_grace: true,
        created_at: new Date().toISOString()
      };
      await storage.recordStumble(log);
      onStumbleRecorded();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl text-slate-100 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 p-6 border-b border-amber-500/30 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                You stumbled. Return to Christ.
              </h2>
              <p className="text-xs text-amber-300/90 mt-0.5">
                Begin again today. A stumble does not define your identity or your salvation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <span
                key={s}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s
                    ? 'bg-amber-500 text-slate-950'
                    : step > s
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
          <span className="text-amber-400">Step {step} of 7</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* STEP 1: COME INTO THE LIGHT */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="text-amber-400">01.</span> Come Into the Light
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                When Adam sinned, he ran into the trees to hide in shame. Secrecy gives sin its power, but bringing it into the light of Christ destroys that power.
              </p>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-sm text-amber-200/90 font-serif italic">
                "If we walk in the light, as he is in the light, we have fellowship with one another, and the blood of Jesus his Son cleanses us from all sin."
                <div className="text-xs font-sans text-slate-400 not-italic mt-2">— 1 John 1:7</div>
              </div>
              <p className="text-xs text-slate-400">
                You do not have to hide or pretend. Speak to God with total transparency right now.
              </p>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>I STEP INTO THE LIGHT — NEXT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: RECEIVE GRACE */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="text-amber-400">02.</span> Receive Grace
              </h3>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-amber-500/30 space-y-3">
                <p className="text-base sm:text-lg font-serif italic text-amber-100">
                  "If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness."
                </p>
                <p className="text-xs font-bold text-amber-400 text-right">— 1 John 1:9</p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Notice: God is faithful and <em>just</em>. Christ already paid the debt for this sin at Calvary. God does not demand payment twice. Forgiveness is not based on how long your streak was; it is based on the cross.
              </p>
              <button
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>I RECEIVE GOD'S CLEANSING — NEXT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: DO NOT REMAIN IN SHAME */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="text-amber-400">03.</span> Do Not Remain in Shame
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl">
                  <h4 className="font-bold text-red-300 uppercase tracking-wider mb-1">Enemy Condemnation</h4>
                  <p className="text-slate-300">
                    "You're disgusting. You'll never change. You're a fake. Stay away from God."
                  </p>
                </div>
                <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl">
                  <h4 className="font-bold text-emerald-300 uppercase tracking-wider mb-1">Holy Spirit Conviction</h4>
                  <p className="text-slate-300">
                    "This sin is deadly, but I love you. Come to My throne for mercy and get back up."
                  </p>
                </div>
              </div>
              <p className="text-sm text-amber-200 font-serif italic text-center py-1">
                "There is therefore now no condemnation for those who are in Christ Jesus." (Romans 8:1)
              </p>
              <button
                onClick={() => setStep(4)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>I REJECT ACCUSATION — NEXT: EXAMINE TRIGGERS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: IDENTIFY WHAT HAPPENED */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="text-amber-400">04.</span> Identify What Happened
              </h3>
              <p className="text-xs text-slate-400">
                Lust is rarely an isolated impulse; it feeds on specific environmental and emotional doorways:
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Primary Trigger:</label>
                  <select
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value as TriggerCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    {triggerOptions.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Location / Context:</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Bedroom in bed with phone"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Emotional State:</label>
                    <input
                      type="text"
                      value={feeling}
                      onChange={(e) => setFeeling(e.target.value)}
                      placeholder="e.g. Lonely, stressed, exhausted"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">What happened immediately before?</label>
                  <textarea
                    rows={2}
                    value={whatHappenedBefore}
                    onChange={(e) => setWhatHappenedBefore(e.target.value)}
                    placeholder="e.g. Mindlessly scrolled on social media late at night after a hard day..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(5)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>TRIGGERS IDENTIFIED — NEXT: RECOVERY PLAN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 5: CREATE A RECOVERY PLAN */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="text-amber-400">05.</span> Create a Concrete Recovery Plan
              </h3>
              <p className="text-xs text-slate-400">
                Romans 13:14 commands us to "make no provision for the flesh." What door must be shut?
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">What will you change next time?</label>
                  <input
                    type="text"
                    value={whatToChange}
                    onChange={(e) => setWhatToChange(e.target.value)}
                    placeholder="e.g. Charge phone in the living room; delete tempting app"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Positive commitment for the next 24 hours:</label>
                  <input
                    type="text"
                    value={recoveryPlan}
                    onChange={(e) => setRecoveryPlan(e.target.value)}
                    placeholder="e.g. Spend 15 minutes in the Word; text my accountability partner"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(6)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>PLAN READY — NEXT: PRAYER OF RESTORATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 6: PRAY */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="text-amber-400">06.</span> Restoration Prayer
              </h3>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-amber-500/30 text-slate-200 text-sm font-serif leading-relaxed space-y-3">
                <p>
                  "Lord God, I confess this stumble directly to You. I do not minimize it, nor do I hide in shame. I thank You that the blood of Jesus Christ cleanses me right now from all unrighteousness.
                </p>
                <p>
                  I refuse the enemy's condemnation. You are the God who restores my soul. Holy Spirit, repair the breastplate of practical righteousness in me. Close the doors I left open, and grant me strength to walk forward in purity. In Jesus' name, Amen."
                </p>
              </div>

              <button
                onClick={() => setStep(7)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>AMEN — PROCEED TO WALK IN VICTORY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 7: CONTINUE FORWARD */}
          {step === 7 && (
            <div className="space-y-5 text-center animate-in fade-in duration-150">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">
                You are forgiven. Stand firm.
              </h3>
              <blockquote className="italic text-base text-amber-200 font-serif max-w-md mx-auto">
                "For the righteous falls seven times and rises again."
                <div className="not-italic text-xs font-sans text-slate-400 mt-1">— Proverbs 24:16</div>
              </blockquote>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Your journey does not restart from zero; you are carrying forward wisdom, humility, and deeper dependence on Christ. Stand up and walk in the Spirit.
              </p>

              <button
                disabled={saving}
                onClick={handleFinish}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs tracking-wider shadow-lg shadow-emerald-950/40 transition cursor-pointer mx-auto flex items-center justify-center gap-2"
              >
                <span>{saving ? 'RECORDING RESTORATION...' : 'BEGIN AGAIN TODAY IN CHRIST'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
