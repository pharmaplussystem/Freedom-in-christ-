import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  RotateCcw,
  BookOpen,
  Volume2,
  VolumeX,
  Bookmark,
  Check,
  Swords,
  AlertTriangle,
  Flame,
  Layers,
  Copy,
  Info,
  Hammer,
  Cross,
  Crosshair,
  Award,
  Zap,
  Eye,
  HelpCircle
} from 'lucide-react';
import { ARMOR_PIECES, GUIDED_ARMOR_PRAYER_STEPS } from '../../data/armorOfGod';
import { ArmorPiece } from '../../types';
import { storage } from '../../services/storage';

export const ArmorView: React.FC = () => {
  const [selectedPiece, setSelectedPiece] = useState<ArmorPiece>(ARMOR_PIECES[0]);
  const [activeSubTab, setActiveSubTab] = useState<
    'theology' | 'anatomy' | 'christ' | 'lies' | 'scenarios' | 'rhema' | 'drills' | 'prayer' | 'flashcard'
  >('theology');
  const [isGuidedMode, setIsGuidedMode] = useState<boolean>(false);
  const [guidedStepIndex, setGuidedStepIndex] = useState<number>(0);
  const [guidedCompleted, setGuidedCompleted] = useState<boolean>(false);
  const [savedFavorite, setSavedFavorite] = useState<boolean>(false);
  const [copiedRhemaIndex, setCopiedRhemaIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState<boolean>(false);

  // Daily Equipping Checklist State (stored per day)
  const todayStr = new Date().toISOString().split('T')[0];
  const [equippedPieces, setEquippedPieces] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`fic_armor_equipped_${todayStr}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleEquip = (pieceId: string) => {
    let updated: string[];
    if (equippedPieces.includes(pieceId)) {
      updated = equippedPieces.filter(id => id !== pieceId);
    } else {
      updated = [...equippedPieces, pieceId];
    }
    setEquippedPieces(updated);
    try {
      localStorage.setItem(`fic_armor_equipped_${todayStr}`, JSON.stringify(updated));
    } catch {}
  };

  const handleStartGuidedPrayer = () => {
    setIsGuidedMode(true);
    setGuidedStepIndex(0);
    setGuidedCompleted(false);
  };

  const handleNextGuidedStep = async () => {
    if (guidedStepIndex < GUIDED_ARMOR_PRAYER_STEPS.length - 1) {
      setGuidedStepIndex(guidedStepIndex + 1);
    } else {
      await storage.incrementStat('armor');
      setGuidedCompleted(true);
      const allIds = ARMOR_PIECES.map(p => p.id);
      setEquippedPieces(allIds);
      localStorage.setItem(`fic_armor_equipped_${todayStr}`, JSON.stringify(allIds));
    }
  };

  const handleSaveFavoritePrayer = async () => {
    await storage.toggleFavorite('Ephesians 6:10-18 - Full Armor Prayer');
    setSavedFavorite(true);
    setTimeout(() => setSavedFavorite(false), 2000);
  };

  const handleCopyRhema = (declaration: string, index: number) => {
    navigator.clipboard.writeText(declaration);
    setCopiedRhemaIndex(index);
    setTimeout(() => setCopiedRhemaIndex(null), 2000);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*_#"`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const equipPercentage = Math.round((equippedPieces.length / ARMOR_PIECES.length) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>Ephesians 6:10–18 Comprehensive Military Commentary</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            The Full Armor of God
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            The armor is not a program of self-improvement for the morally tidy; it is the tactical battle equipment of the redeemed believer fighting from Christ's already-won victory.
          </p>
        </div>

        <button
          onClick={handleStartGuidedPrayer}
          className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>START GUIDED ARMOR PRAYER</span>
        </button>
      </div>

      {/* DAILY ARMOR EQUIPPING READINESS */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Daily Spiritual Readiness Checklist
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tap each piece to mentally and spiritually put it on in prayer today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div 
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${equipPercentage}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">
              {equippedPieces.length}/{ARMOR_PIECES.length} Armed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {ARMOR_PIECES.map((piece) => {
            const isEquipped = equippedPieces.includes(piece.id);
            return (
              <button
                key={piece.id}
                onClick={() => toggleEquip(piece.id)}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isEquipped
                    ? 'bg-amber-500/20 border-amber-400/80 text-amber-200 font-bold shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="text-[11px] truncate w-full">{piece.name.split(' ')[0]}</div>
                {isEquipped ? (
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-700 block" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* GUIDED PRAYER MODAL / VIEW */}
      {isGuidedMode && (
        <div className="rounded-3xl bg-slate-900 border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-150">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Daily Armor Ceremony
              </span>
              <h3 className="text-lg font-bold text-slate-100">
                {GUIDED_ARMOR_PRAYER_STEPS[guidedStepIndex].title}
              </h3>
            </div>
            <button
              onClick={() => setIsGuidedMode(false)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 cursor-pointer"
            >
              Exit Prayer
            </button>
          </div>

          {!guidedCompleted ? (
            <div className="space-y-6">
              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {GUIDED_ARMOR_PRAYER_STEPS.map((s, idx) => (
                  <div
                    key={s.step}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      idx === guidedStepIndex
                        ? 'bg-amber-400'
                        : idx < guidedStepIndex
                        ? 'bg-emerald-500'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              <div className="bg-slate-950/80 p-6 rounded-2xl border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300">
                    {GUIDED_ARMOR_PRAYER_STEPS[guidedStepIndex].subtitle}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {GUIDED_ARMOR_PRAYER_STEPS[guidedStepIndex].scripture}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-serif italic text-slate-100 leading-relaxed">
                  "{GUIDED_ARMOR_PRAYER_STEPS[guidedStepIndex].prayer}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={guidedStepIndex === 0}
                  onClick={() => setGuidedStepIndex(i => i - 1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakText(GUIDED_ARMOR_PRAYER_STEPS[guidedStepIndex].prayer)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    title="Audible Read-Aloud"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isSpeaking ? 'Mute' : 'Listen'}</span>
                  </button>

                  <button
                    onClick={handleNextGuidedStep}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center gap-2"
                  >
                    <span>
                      {guidedStepIndex === GUIDED_ARMOR_PRAYER_STEPS.length - 1
                        ? 'CONCLUDE & SAY AMEN'
                        : 'NEXT PIECE'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-5 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-100 tracking-tight">AMEN!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                You step into this day fully armed. Greater is He that is in you than he that is in the world. Sin shall not have dominion over you!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
                <button
                  onClick={handleSaveFavoritePrayer}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {savedFavorite ? <Check className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
                  <span>{savedFavorite ? 'Saved to Favorites' : 'Save as Favorite'}</span>
                </button>
                <button
                  onClick={() => setIsGuidedMode(false)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider cursor-pointer"
                >
                  Back to Armor Manual
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* INTERACTIVE WARRIOR'S ARMORY DIAGRAM */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Interactive Warrior's Anatomy
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any piece of armor below to inspect its engineering, theology, lies defeated, and combat scenarios.
            </p>
          </div>
          <span className="text-[11px] text-amber-400/90 font-mono">
            Selected: {selectedPiece.name}
          </span>
        </div>

        {/* Tactical Armor Strip with Hotspot Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {ARMOR_PIECES.map((piece) => {
            const isSelected = selectedPiece.id === piece.id;
            const isEquipped = equippedPieces.includes(piece.id);

            const iconMap: Record<string, string> = {
              salvation: '🪖',
              righteousness: '🛡️',
              truth: '🥋',
              peace: '🥾',
              faith: '🚪',
              sword: '⚔️',
              prayer: '🕊️'
            };

            return (
              <button
                key={piece.id}
                onClick={() => {
                  setSelectedPiece(piece);
                  setIsFlashcardFlipped(false);
                }}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">{iconMap[piece.id] || '🛡️'}</span>
                <div>
                  <h4 className="text-xs font-bold leading-tight">{piece.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{piece.scripture_ref}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  {isEquipped ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Armed
                    </span>
                  ) : (
                    <span className="text-slate-500">Unarmed</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILED ARMOR DEEP-DIVE MANUAL */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* Header & Linguistic Background */}
        <div className="space-y-3 pb-4 border-b border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              {selectedPiece.scripture_ref}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-amber-300 font-mono">
                {selectedPiece.greek_term}
              </span>
              <button
                onClick={() => toggleEquip(selectedPiece.id)}
                className={`text-xs px-3 py-1 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  equippedPieces.includes(selectedPiece.id)
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                }`}
              >
                {equippedPieces.includes(selectedPiece.id) ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Equipped Today</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Equip This Piece</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-100">
            {selectedPiece.name}
          </h3>
          <p className="text-xs sm:text-sm font-serif italic text-amber-200/90 leading-relaxed">
            "{selectedPiece.scripture_text}"
          </p>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar border-b border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('theology')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'theology'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Theology & Warfare Context
          </button>

          <button
            onClick={() => setActiveSubTab('anatomy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'anatomy'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Anatomy & Construction</span>
          </button>

          <button
            onClick={() => setActiveSubTab('christ')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'christ'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cross className="w-3.5 h-3.5" />
            <span>Christological Reality</span>
          </button>

          {selectedPiece.lies_and_counter_truths && (
            <button
              onClick={() => setActiveSubTab('lies')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeSubTab === 'lies'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Lies vs Truths ({selectedPiece.lies_and_counter_truths.length})</span>
            </button>
          )}

          {selectedPiece.battleground_scenarios && (
            <button
              onClick={() => setActiveSubTab('scenarios')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeSubTab === 'scenarios'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Combat Scenarios</span>
            </button>
          )}

          {selectedPiece.rhema_arsenal && (
            <button
              onClick={() => setActiveSubTab('rhema')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeSubTab === 'rhema'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Rhema Thrusts</span>
            </button>
          )}

          <button
            onClick={() => setActiveSubTab('drills')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'drills'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Combat Drills</span>
          </button>

          <button
            onClick={() => setActiveSubTab('prayer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'prayer'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Dedicated Prayer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('flashcard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'flashcard'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Memory Card</span>
          </button>
        </div>

        {/* SUB-TAB 1: THEOLOGY & WARFARE CONTEXT */}
        {activeSubTab === 'theology' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed animate-in fade-in duration-150">
            {/* Roman Military Parallel */}
            <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-amber-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" />
                Roman Legionary Warfare Parallel
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {selectedPiece.roman_parallel}
              </p>
            </div>

            {/* Combat Function in Sexual Sin */}
            <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-amber-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Function in the Battle Against Lust & Impurity
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {selectedPiece.battle_function}
              </p>
            </div>

            {/* The Enemy's Targeted Strategy */}
            <div className="bg-red-950/20 p-4 sm:p-5 rounded-2xl border border-red-900/40 space-y-1">
              <h4 className="font-bold text-red-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                The Enemy's Specific Strategy
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {selectedPiece.enemy_strategy}
              </p>
            </div>

            {/* Full Theological Commentary */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                Biblical Exposition & Victory Anchor
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                {selectedPiece.theological_depth}
              </p>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: ANATOMY & CONSTRUCTION */}
        {activeSubTab === 'anatomy' && selectedPiece.anatomical_engineering && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Hammer className="w-4 h-4 text-amber-400" />
                Historical Metallurgical & Physical Construction
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="font-bold text-slate-100 block mb-1">Authentic Materials:</span>
                  <p className="text-slate-400 leading-relaxed">
                    {selectedPiece.anatomical_engineering.material}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="font-bold text-slate-100 block mb-1">Combat Design Details:</span>
                  <p className="text-slate-400 leading-relaxed">
                    {selectedPiece.anatomical_engineering.design_details}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-950/20 p-5 rounded-2xl border border-red-900/30 space-y-2">
              <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Lethal Vulnerability If This Piece Is Missing
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedPiece.anatomical_engineering.vulnerability_if_missing}
              </p>
            </div>
          </div>
        )}

        {/* SUB-TAB 3: CHRISTOLOGICAL FULFILLMENT */}
        {activeSubTab === 'christ' && selectedPiece.christological_fulfillment && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 p-6 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <Cross className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                  How Jesus Christ Is This Armor For You
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedPiece.christological_fulfillment}
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs text-amber-300/80 italic">
                "Put on the Lord Jesus Christ, and make no provision for the flesh, to gratify its desires." — Romans 13:14
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 4: LIES VS TRUTHS */}
        {activeSubTab === 'lies' && selectedPiece.lies_and_counter_truths && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <p className="text-xs text-slate-400">
              Satan’s attacks against your purity rely entirely on these specific rationalizations. Compare the lie to God’s objective Word:
            </p>

            <div className="space-y-3">
              {selectedPiece.lies_and_counter_truths.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-slate-950 border border-slate-800/80 p-4 sm:p-5 space-y-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                      The Enemy's Lie #{index + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      "{item.lie}"
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-800/70">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      The Biblical Counter-Truth ({item.counter_scripture})
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.truth}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 5: COMBAT SCENARIOS */}
        {activeSubTab === 'scenarios' && selectedPiece.battleground_scenarios && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <p className="text-xs text-slate-400">
              Real-world battleground situations where this armor piece saves your life. Follow the exact tactical counter-move:
            </p>

            <div className="space-y-4">
              {selectedPiece.battleground_scenarios.map((scene, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">{scene.title}</h4>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-amber-400 block">Trigger Context:</span>
                    <p>{scene.trigger_context}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-emerald-400 block">Immediate Counter-Move:</span>
                    <p>{scene.counter_strategy}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-amber-400 block">Spoken Battle Declaration:</span>
                      <p className="font-serif italic font-medium">{scene.declaration}</p>
                    </div>
                    <button
                      onClick={() => speakText(scene.declaration)}
                      className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 shrink-0 cursor-pointer"
                      title="Listen to declaration"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 6: RHEMA SWORD THRUSTS */}
        {activeSubTab === 'rhema' && selectedPiece.rhema_arsenal && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Wield the spoken Word aloud like Jesus in Matthew 4: "It is written!"
              </p>
              <button
                onClick={() => speakText(selectedPiece.rhema_arsenal?.map(r => r.declaration).join('. ') || '')}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear All Declarations</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedPiece.rhema_arsenal.map((rhema, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-5 space-y-2 hover:border-amber-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400">
                      Target: {rhema.attack}
                    </span>
                    <span className="text-xs font-mono text-amber-300">
                      {rhema.verse}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-serif italic text-slate-100 font-medium leading-relaxed">
                    "{rhema.declaration}"
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => speakText(rhema.declaration)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Speak</span>
                    </button>
                    <button
                      onClick={() => handleCopyRhema(rhema.declaration, idx)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedRhemaIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedRhemaIndex === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 7: COMBAT DRILLS */}
        {activeSubTab === 'drills' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Field Tactics & Muscle Memory
            </h4>

            <div className="space-y-3">
              {selectedPiece.practical_drills.map((drill, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800">
                      {drill.phase}
                    </span>
                    <h5 className="text-xs font-bold text-slate-200">{drill.title}</h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-1">
                    {drill.action}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Daily Discipline Summary
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
                {selectedPiece.daily_practice.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* SUB-TAB 8: DEDICATED PRAYER */}
        {activeSubTab === 'prayer' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-slate-400 font-serif italic">
                Pray this prayer aloud with holy conviction to actively put on {selectedPiece.name}.
              </span>
              <button
                onClick={() => speakText(selectedPiece.prayer_text)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Stop Reading' : 'Listen Read-Aloud'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs sm:text-sm font-serif leading-relaxed text-slate-200 whitespace-pre-line">
              {selectedPiece.prayer_text}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedPiece.prayer_text);
                  alert('Prayer text copied to clipboard!');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Prayer</span>
              </button>

              <button
                onClick={() => toggleEquip(selectedPiece.id)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider cursor-pointer"
              >
                CONCLUDE & MARK ARMED
              </button>
            </div>
          </div>
        )}

        {/* SUB-TAB 9: MEMORIZATION FLASHCARD */}
        {activeSubTab === 'flashcard' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-center py-4">
            <p className="text-xs text-slate-400">
              Test your tactical memory of this armor piece. Tap the card to flip between Greek/Military Context and Scripture Application!
            </p>

            <div
              onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
              className="w-full max-w-lg mx-auto min-h-64 rounded-3xl bg-slate-950 border-2 border-amber-500/40 p-8 flex flex-col justify-between items-center cursor-pointer shadow-2xl hover:border-amber-400 transition"
            >
              <div className="flex items-center justify-between w-full text-xs text-slate-400">
                <span className="font-mono text-amber-400 uppercase font-bold">
                  {selectedPiece.name}
                </span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                  {isFlashcardFlipped ? 'Back (Biblical Declaration)' : 'Front (Terminology & Function)'}
                </span>
              </div>

              {!isFlashcardFlipped ? (
                <div className="space-y-3 py-4">
                  <span className="text-3xl font-serif text-amber-300 font-bold block">
                    {selectedPiece.greek_term}
                  </span>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    {selectedPiece.meaning}
                  </p>
                  <span className="text-[11px] text-amber-400/80 font-mono block">
                    (Click to Reveal Scripture & Battle Thrust)
                  </span>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <span className="text-sm font-mono text-amber-300 font-bold block">
                    {selectedPiece.scripture_ref}
                  </span>
                  <p className="text-sm font-serif italic text-slate-100 max-w-sm mx-auto">
                    "{selectedPiece.scripture_text}"
                  </p>
                  <p className="text-xs text-emerald-400 font-sans font-medium">
                    Tactical Function: {selectedPiece.battle_function}
                  </p>
                </div>
              )}

              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Tap anywhere on card to flip</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
