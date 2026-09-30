import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  X, 
  ArrowRight, 
  CheckCircle, 
  PhoneCall, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  Heart,
  Clock,
  Play,
  Pause
} from 'lucide-react';
import { SCRIPTURE_LIBRARY } from '../../data/scriptures';
import { storage } from '../../services/storage';
import { AccountabilityContact } from '../../types';

interface EmergencyTemptationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemptationResisted: () => void;
}

export const EmergencyTemptationModal: React.FC<EmergencyTemptationModalProps> = ({
  isOpen,
  onClose,
  onTemptationResisted
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [contacts, setContacts] = useState<AccountabilityContact[]>([]);
  
  // Timer State (5 minutes = 300 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [encouragementIndex, setEncouragementIndex] = useState<number>(0);

  // Pick random sword verses
  const swordVerses = SCRIPTURE_LIBRARY.filter(v => v.is_sword_rhema);
  const currentVerse = swordVerses[encouragementIndex % swordVerses.length] || swordVerses[0];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSecondsRemaining(300);
      setTimerRunning(true);
      setActiveAction(null);
      storage.getContacts().then(setContacts);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isOpen && timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          if (prev % 45 === 0) {
            setEncouragementIndex(i => i + 1);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timerRunning, secondsRemaining]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleFinishVictory = async () => {
    await storage.saveTrigger({
      id: `trig_${Date.now()}`,
      trigger_type: 'Emergency Mode - Overcome',
      description: 'Used Emergency Temptation Protocol and stood firm in Christ.',
      resisted: true,
      date: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
    onTemptationResisted();
    onClose();
  };

  const environmentOptions = [
    { label: 'Leave the room', icon: '🚪' },
    { label: 'Put down my phone', icon: '📱' },
    { label: 'Go where other people are', icon: '👥' },
    { label: 'Exercise or do 20 pushups', icon: '💪' },
    { label: 'Take a brisk walk outside', icon: '🚶' },
    { label: 'Start another focused task', icon: '✍️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-red-500/60 shadow-2xl text-slate-100 overflow-hidden my-auto">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-red-900/90 via-red-800/80 to-amber-950/80 p-5 sm:p-6 border-b border-red-500/40 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-400/60 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7 text-red-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider">STOP</h2>
              <p className="text-xs sm:text-sm font-semibold text-red-200 mt-0.5">
                You do not have to obey this temptation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-red-300 hover:text-white hover:bg-red-800/50 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Pill Indicator */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-slate-800 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <button
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition cursor-pointer ${
                  currentStep === stepNum
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : currentStep > stepNum
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800/60 text-slate-400'
                }`}
              >
                {stepNum}
              </button>
            ))}
          </div>
          <span className="text-amber-400 font-medium text-xs">
            Step {currentStep} of 5
          </span>
        </div>

        {/* Dynamic Step Content */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* STEP 1: GET AWAY */}
          {currentStep === 1 && (
            <div className="space-y-6 text-center py-2 animate-in fade-in duration-200">
              <div className="inline-block p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2">
                <span className="text-2xl">🏃‍♂️</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
                Step 1: Get Away Immediately
              </h3>
              <blockquote className="italic text-base sm:text-lg text-amber-200 font-serif max-w-lg mx-auto bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                "Flee from sexual immorality. Every other sin a person commits is outside the body, but the sexually immoral person sins against his own body."
                <div className="not-italic text-xs font-sans text-slate-400 mt-2 font-medium">
                  — 1 Corinthians 6:18
                </div>
              </blockquote>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Do not debate with this urge. Physical removal breaks the neurological loop immediately. Stand up right now.
              </p>
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <span>I'M MOVING AWAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: PRAY NOW */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100">Step 2: Pray Aloud Right Now</h3>
                  <p className="text-xs text-slate-400">Speak this aloud with your voice. Sound breaks mental trance.</p>
                </div>
              </div>

              <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-amber-500/30 text-slate-200 text-sm sm:text-base leading-relaxed space-y-3 font-serif">
                <p>
                  "Lord Jesus, help me right now! I depend on You rather than my own strength.
                </p>
                <p>
                  I renounce this temptation in Your holy name. You promised in 1 Corinthians 10:13 that You would provide a way of escape. I take that escape door now.
                </p>
                <p>
                  Fill my mind with Your Holy Spirit. Quench every flaming arrow of lust. My body is Your sacred temple. Amen!"
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>PRAYED — NEXT: WIELD SCRIPTURE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SCRIPTURE SWORD */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100">Step 3: The Sword of the Spirit</h3>
                  <p className="text-xs text-slate-400">Say: "It is written..."</p>
                </div>
                <button
                  onClick={() => setEncouragementIndex(i => i + 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Next Sword Verse</span>
                </button>
              </div>

              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 p-6 rounded-2xl border border-amber-500/40 space-y-4">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                  Target: {currentVerse.sword_attack_target || 'Against sexual temptation'}
                </div>
                <p className="text-base sm:text-lg text-amber-100 font-serif italic leading-relaxed">
                  "{currentVerse.text}"
                </p>
                <div className="text-xs font-bold text-amber-400/90 text-right">
                  — {currentVerse.reference} ({currentVerse.translation})
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Jesus defeated Satan in the wilderness with specific spoken scripture. Speak this verse three times aloud before advancing.
              </p>

              <button
                onClick={() => setCurrentStep(4)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>SPOKEN — NEXT: CHANGE ENVIRONMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: CHANGE ENVIRONMENT */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">Step 4: Change Your Environment</h3>
                <p className="text-xs text-slate-400">Pick at least one concrete physical action to take right now:</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {environmentOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setActiveAction(opt.label)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${
                      activeAction === opt.label
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold shadow-inner'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>

              {/* Optional Accountability Quick Action */}
              {contacts.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-200">Accountability Partner</p>
                      <p className="text-[11px] text-slate-400">{contacts[0].name} ({contacts[0].relationship})</p>
                    </div>
                  </div>
                  {contacts[0].phone && (
                    <a
                      href={`tel:${contacts[0].phone}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                    >
                      Call Now
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={() => setCurrentStep(5)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>ACTION CHOSEN — START 5-MINUTE RE-CENTERING</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 5: WAIT & RE-CENTER (5 MIN TIMER) */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">Step 5: Hold the Line (5 Minutes)</h3>
                <p className="text-xs text-slate-400">
                  Intense neurochemical dopamine cravings typically crest and subside within 3 to 5 minutes if not fed. Breathe slowly.
                </p>
              </div>

              {/* Timer Display */}
              <div className="relative w-40 h-40 mx-auto flex flex-col items-center justify-center rounded-full border-4 border-amber-500/40 bg-slate-950/90 shadow-2xl">
                <Clock className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-3xl font-mono font-bold text-amber-200 tracking-wider">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                  Remaining
                </span>
              </div>

              {/* Gentle Breathing & Prayer Prompts */}
              <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Meditation Focus</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 italic font-serif leading-relaxed">
                  "{currentVerse.text}"
                </p>
                <p className="text-[11px] text-slate-400">
                  Breathe in: "The Lord is my strength." Breathe out: "Sin has no dominion."
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{timerRunning ? 'Pause Timer' : 'Resume Timer'}</span>
                </button>

                <button
                  onClick={handleFinishVictory}
                  className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs tracking-wider shadow-lg shadow-emerald-950/50 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>I'M SAFE NOW — TEMPTATION OVERCOME</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
