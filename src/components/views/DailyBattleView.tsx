import React, { useState } from 'react';
import { 
  Swords, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  AlertTriangle,
  Heart,
  Volume2,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { TriggerCategory } from '../../types';
import { storage } from '../../services/storage';

interface DailyBattleViewProps {
  onOpenPrayerCenter: () => void;
  onTemptationResisted: () => void;
}

export const DailyBattleView: React.FC<DailyBattleViewProps> = ({
  onOpenPrayerCenter,
  onTemptationResisted
}) => {
  const [selectedTriggers, setSelectedTriggers] = useState<TriggerCategory[]>([]);
  const [entertainingThought, setEntertainingThought] = useState('');
  const [lieBehindIt, setLieBehindIt] = useState('');
  const [godsWordSays, setGodsWordSays] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [battleCompleted, setBattleCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const triggersList: TriggerCategory[] = [
    'Loneliness',
    'Stress',
    'Boredom',
    'Anger',
    'Anxiety',
    'Social media',
    'Being alone',
    'Late-night phone use',
    'Certain websites',
    'Certain thoughts',
    'Other'
  ];

  const actionList = [
    'Leave the room',
    'Put the phone away in another room',
    'Go outside for fresh air',
    'Exercise / pushups / brisk walk',
    'Pray aloud right now',
    'Read Scripture aloud',
    'Call or message an accountability partner',
    'Take a cold shower',
    'Start a physical household task'
  ];

  const toggleTrigger = (t: TriggerCategory) => {
    if (selectedTriggers.includes(t)) {
      setSelectedTriggers(selectedTriggers.filter(item => item !== t));
    } else {
      setSelectedTriggers([...selectedTriggers, t]);
    }
  };

  const toggleAction = (act: string) => {
    if (selectedActions.includes(act)) {
      setSelectedActions(selectedActions.filter(item => item !== act));
    } else {
      setSelectedActions([...selectedActions, act]);
    }
  };

  const handleCompleteBattle = async () => {
    setIsSaving(true);
    try {
      // Save trigger record
      if (selectedTriggers.length > 0) {
        await storage.saveTrigger({
          id: `trig_${Date.now()}`,
          trigger_type: selectedTriggers.join(', '),
          description: `Daily Battle Plan: Captured thought "${entertainingThought || 'Lustful suggestion'}" and pledged action "${selectedActions.join(', ') || 'Prayer'}".`,
          resisted: true,
          date: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
      }
      await storage.incrementStat('armor');
      setBattleCompleted(true);
      onTemptationResisted();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Title Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Swords className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Daily Spiritual Battle Plan</h2>
            <p className="text-xs text-slate-400">
              Proactive spiritual warfare: dismantle temptation before it conceives (James 1:14-15).
            </p>
          </div>
        </div>
      </div>

      {battleCompleted ? (
        <div className="rounded-3xl bg-slate-900 border border-emerald-500/40 p-8 text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Battle Plan Enacted!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            "We destroy arguments and every lofty opinion raised against the knowledge of God, and take every thought captive to obey Christ." (2 Corinthians 10:5)
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setBattleCompleted(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              Update Battle Plan
            </button>
            <button
              onClick={onOpenPrayerCenter}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 transition cursor-pointer"
            >
              Continue in Prayer Center
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">

          {/* 1. SURRENDER */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <span>Section 1</span>
              <span>·</span>
              <span>Surrender</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">Declare Your Dependence on Jesus</h3>
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-amber-500/30 font-serif italic text-amber-200 text-base leading-relaxed">
              "Lord Jesus, I depend on You rather than my own strength. You are my strong tower. I cannot defeat this in my human willpower; I yield my thoughts, eyes, and desires to Your Holy Spirit right now."
            </div>
          </div>

          {/* 2. SCRIPTURE */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <BookOpen className="w-4 h-4" />
              <span>Section 2</span>
              <span>·</span>
              <span>Today's Battle Scripture</span>
            </div>
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <p className="text-base text-slate-200 font-serif italic">
                "No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape, that you may be able to endure it."
              </p>
              <p className="text-xs font-bold text-amber-400 text-right">— 1 Corinthians 10:13</p>
            </div>
          </div>

          {/* 3. IDENTIFY THE TRIGGER */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Section 3</span>
              <span>·</span>
              <span>Identify Your Vulnerability or Trigger</span>
            </div>
            <p className="text-xs text-slate-400">
              Which door is the enemy trying to exploit right now? Select all that apply:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {triggersList.map((t) => {
                const isSelected = selectedTriggers.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTrigger(t)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. TAKE THE THOUGHT CAPTIVE */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Section 4</span>
              <span>·</span>
              <span>Take the Thought Captive (2 Corinthians 10:5)</span>
            </div>
            <p className="text-xs text-slate-400">
              Arrest rogue thoughts before they conceive into actions:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  What thought or fantasy am I entertaining?
                </label>
                <input
                  type="text"
                  value={entertainingThought}
                  onChange={(e) => setEntertainingThought(e.target.value)}
                  placeholder="e.g. 'Just checking this once won't hurt...'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  What is the lie behind this temptation?
                </label>
                <input
                  type="text"
                  value={lieBehindIt}
                  onChange={(e) => setLieBehindIt(e.target.value)}
                  placeholder="e.g. 'This will relieve my stress and satisfy me.'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  What does God's Word say?
                </label>
                <input
                  type="text"
                  value={godsWordSays}
                  onChange={(e) => setGodsWordSays(e.target.value)}
                  placeholder="e.g. 'Psalm 16:11: In Your presence is fullness of joy; sin delivers emptiness.'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 5. TAKE ACTION */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <span>Section 5</span>
              <span>·</span>
              <span>Take Decisive Action</span>
            </div>
            <p className="text-xs text-slate-400">
              Romans 13:14: "Make no provision for the flesh." Commit to physical and environmental actions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {actionList.map((act) => {
                const isSelected = selectedActions.includes(act);
                return (
                  <button
                    key={act}
                    onClick={() => toggleAction(act)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{act}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. PRAY */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Heart className="w-4 h-4" />
              <span>Section 6</span>
              <span>·</span>
              <span>Seal the Battle with Prayer</span>
            </div>
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-amber-500/20 text-slate-200 text-sm font-serif leading-relaxed space-y-2">
              <p>
                "Father, by the authority of Jesus Christ, I slam the door shut on every provision for the flesh. I take up the Shield of Faith and extinguish every flaming arrow of lust. My body belongs to the Lord Jesus. Lead me in paths of righteousness for Your name's sake. Amen."
              </p>
            </div>

            <button
              disabled={isSaving}
              onClick={handleCompleteBattle}
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>{isSaving ? 'SEALING BATTLE PLAN...' : 'SEAL THIS BATTLE PLAN (STAND FIRM)'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
