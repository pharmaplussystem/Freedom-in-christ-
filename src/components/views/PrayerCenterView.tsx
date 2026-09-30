import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Copy, 
  Check, 
  Plus, 
  Sparkles, 
  Bookmark, 
  X, 
  Volume2, 
  Maximize2,
  Bell,
  BellOff,
  Clock,
  Flame,
  Play,
  Pause,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Compass,
  Music
} from 'lucide-react';
import { PRAYER_COLLECTION } from '../../data/prayers';
import { PrayerItem, PrayerAltarWatch } from '../../types';
import { storage } from '../../services/storage';
import { 
  playAltarChime, 
  ChimeType, 
  requestNotificationPermission, 
  triggerAltarNotification 
} from '../../services/chime';

export const PrayerCenterView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'altar'>('altar');
  const [prayers, setPrayers] = useState<PrayerItem[]>(PRAYER_COLLECTION);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [focusPrayer, setFocusPrayer] = useState<PrayerItem | null>(null);

  // Prayer Altar State
  const [altars, setAltars] = useState<PrayerAltarWatch[]>([]);
  const [showAddAltarModal, setShowAddAltarModal] = useState(false);
  const [isAltarSanctuaryOpen, setIsAltarSanctuaryOpen] = useState(false);
  const [activeSanctuaryWatch, setActiveSanctuaryWatch] = useState<PrayerAltarWatch | null>(null);

  // Altar Timer (seconds)
  const [altarDuration, setAltarDuration] = useState<number>(300); // 5 min default
  const [altarSecondsLeft, setAltarSecondsLeft] = useState<number>(300);
  const [isAltarTimerRunning, setIsAltarTimerRunning] = useState<boolean>(false);
  const [altarRungMessage, setAltarRungMessage] = useState<string | null>(null);

  // New Altar Form
  const [newAltarTitle, setNewAltarTitle] = useState('');
  const [newAltarTime, setNewAltarTime] = useState('06:00');
  const [newAltarScriptureRef, setNewAltarScriptureRef] = useState('Psalm 5:3');
  const [newAltarScriptureText, setNewAltarScriptureText] = useState('In the morning, LORD, You hear my voice; in the morning I lay my requests before You and wait expectantly.');
  const [newAltarFocus, setNewAltarFocus] = useState('Morning surrender and guarding the eyes');
  const [newAltarSound, setNewAltarSound] = useState<ChimeType>('cathedral-bell');
  const [newAltarAlarmEnabled, setNewAltarAlarmEnabled] = useState(true);

  // Custom prayer modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('custom');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    loadAltars();
  }, []);

  // Alarm Clock Listener: Checks every 20 seconds for altar match
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const currentSecond = now.getSeconds();

      // Trigger within the first 25 seconds of the minute
      if (currentSecond < 25) {
        altars.forEach((altar) => {
          if (altar.active && altar.alarm_enabled && altar.time === currentTimeStr) {
            playAltarChime(altar.sound_type);
            triggerAltarNotification(`Prayer Altar: ${altar.title}`, altar.focus);
            setAltarRungMessage(`Altar Watch: ${altar.title} (${altar.time}) is calling you to prayer.`);
          }
        });
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [altars]);

  // Altar Sanctuary Countdown
  useEffect(() => {
    let t: any = null;
    if (isAltarSanctuaryOpen && isAltarTimerRunning && altarSecondsLeft > 0) {
      t = setInterval(() => {
        setAltarSecondsLeft((prev) => {
          if (prev <= 1) {
            playAltarChime(activeSanctuaryWatch?.sound_type || 'cathedral-bell');
            setIsAltarTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [isAltarSanctuaryOpen, isAltarTimerRunning, altarSecondsLeft, activeSanctuaryWatch]);

  const loadAltars = async () => {
    const list = await storage.getPrayerAltars();
    setAltars(list);
  };

  const handleToggleAlarm = async (id: string) => {
    await storage.togglePrayerAltarAlarm(id);
    await loadAltars();
  };

  const handleToggleActive = async (id: string) => {
    await storage.togglePrayerAltarActive(id);
    await loadAltars();
  };

  const handleDeleteAltar = async (id: string) => {
    if (confirm('Delete this prayer altar watch?')) {
      await storage.deletePrayerAltar(id);
      await loadAltars();
    }
  };

  const handleUpdateTime = async (id: string, newTime: string) => {
    const altar = altars.find(a => a.id === id);
    if (!altar) return;
    const updated = { ...altar, time: newTime };
    await storage.savePrayerAltar(updated);
    await loadAltars();
  };

  const handleUpdateSound = async (id: string, newSound: ChimeType) => {
    const altar = altars.find(a => a.id === id);
    if (!altar) return;
    const updated = { ...altar, sound_type: newSound };
    await storage.savePrayerAltar(updated);
    await loadAltars();
  };

  const quickPresets: { title: string; time: string; scripture_ref: string; scripture_text: string; focus: string; sound: ChimeType }[] = [
    {
      title: 'Dawn Watch (First Fruits)',
      time: '06:00',
      scripture_ref: 'Psalm 5:3',
      scripture_text: 'In the morning, LORD, You hear my voice; in the morning I lay my requests before You and wait expectantly.',
      focus: 'Morning surrender: presenting eyes, hands, and thoughts to Christ.',
      sound: 'cathedral-bell'
    },
    {
      title: 'Midday Defense Watch',
      time: '12:00',
      scripture_ref: 'Psalm 55:17',
      scripture_text: 'Evening, morning and noon I cry out in distress, and He hears my voice.',
      focus: 'Midday check-in: extinguishing workplace stress & isolation arrows.',
      sound: 'temple-chime'
    },
    {
      title: 'Afternoon 9th Hour Watch',
      time: '15:00',
      scripture_ref: 'Acts 3:1',
      scripture_text: 'Peter and John were going up to the temple at the hour of prayer, the ninth hour.',
      focus: 'Mid-afternoon spiritual alertness: breaking mental fatigue.',
      sound: 'temple-chime'
    },
    {
      title: 'Sunset Protection Watch',
      time: '18:00',
      scripture_ref: 'Psalm 141:2',
      scripture_text: 'Let my prayer be counted as incense before You, and the lifting up of my hands as the evening sacrifice.',
      focus: 'Transitioning home: shutting down work stress and guarding evening hours.',
      sound: 'sacred-harp'
    },
    {
      title: 'Night Perimeter Watch',
      time: '21:30',
      scripture_ref: 'Psalm 4:8',
      scripture_text: 'In peace I will lie down and sleep, for You alone, LORD, make me dwell in safety.',
      focus: 'Digital boundary: moving devices out of bedroom; resting in grace.',
      sound: 'sacred-harp'
    },
    {
      title: 'Midnight Intercession Watch',
      time: '00:00',
      scripture_ref: 'Psalm 119:62',
      scripture_text: 'At midnight I rise to give You thanks for Your righteous rules.',
      focus: 'Spiritual vigilance: breaking nighttime torment and praying for brothers.',
      sound: 'gentle-gong'
    }
  ];

  const handleAddPreset = async (preset: typeof quickPresets[0]) => {
    const newAltar: PrayerAltarWatch = {
      id: `altar_${Date.now()}`,
      title: preset.title,
      time: preset.time,
      scripture_ref: preset.scripture_ref,
      scripture_text: preset.scripture_text,
      focus: preset.focus,
      alarm_enabled: true,
      sound_type: preset.sound,
      active: true,
      created_at: new Date().toISOString()
    };
    await storage.savePrayerAltar(newAltar);
    await loadAltars();
  };

  const handleSaveAltar = async () => {
    if (!newAltarTitle.trim() || !newAltarTime) return;

    if (newAltarAlarmEnabled) {
      await requestNotificationPermission();
    }

    const newAltar: PrayerAltarWatch = {
      id: `altar_${Date.now()}`,
      title: newAltarTitle.trim(),
      time: newAltarTime,
      scripture_ref: newAltarScriptureRef.trim() || 'Romans 12:1',
      scripture_text: newAltarScriptureText.trim() || 'Present your bodies as a living sacrifice, holy and acceptable to God.',
      focus: newAltarFocus.trim() || 'Dedicated time of prayer, repentance, and communion with Jesus.',
      alarm_enabled: newAltarAlarmEnabled,
      sound_type: newAltarSound,
      active: true,
      created_at: new Date().toISOString()
    };

    await storage.savePrayerAltar(newAltar);
    await loadAltars();
    setShowAddAltarModal(false);
    setNewAltarTitle('');
    setNewAltarFocus('');
  };

  const handleEnterAltarSanctuary = (altar?: PrayerAltarWatch) => {
    const selected = altar || altars[0];
    setActiveSanctuaryWatch(selected);
    setAltarSecondsLeft(altarDuration);
    setIsAltarTimerRunning(true);
    setIsAltarSanctuaryOpen(true);
    playAltarChime(selected?.sound_type || 'cathedral-bell');
  };

  const handleConcludeAltar = async () => {
    await storage.incrementStat('prayer');
    setIsAltarSanctuaryOpen(false);
    setIsAltarTimerRunning(false);
    alert('Altar prayer completed! Stored in your spiritual progress.');
  };

  // Find next upcoming altar watch
  const getNextAltarWatch = () => {
    if (altars.length === 0) return null;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const activeList = altars.filter(a => a.active);
    if (activeList.length === 0) return null;

    let nextWatch = null;
    let minDiff = Infinity;

    for (const a of activeList) {
      const [h, m] = a.time.split(':').map(Number);
      const altarMins = h * 60 + m;
      let diff = altarMins - currentMins;
      if (diff <= 0) diff += 1440; // Next day
      if (diff < minDiff) {
        minDiff = diff;
        nextWatch = { altar: a, diffMins: diff };
      }
    }

    return nextWatch;
  };

  const nextWatchInfo = getNextAltarWatch();

  const formatCountdown = (diffMins: number) => {
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours === 0) return `in ${mins}m`;
    return `in ${hours}h ${mins}m`;
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const categories = [
    { id: 'all', label: 'All Prayers' },
    { id: 'morning', label: 'Morning' },
    { id: 'temptation', label: 'In Temptation' },
    { id: 'after-fall', label: 'After a Fall (Grace)' },
    { id: 'repentance', label: 'Repentance' },
    { id: 'strength', label: 'Strength' },
    { id: 'renewal', label: 'Mind Renewal' },
    { id: 'self-control', label: 'Self-Control' },
    { id: 'sleep', label: 'Before Sleep' },
    { id: 'thanksgiving', label: 'Thanksgiving' }
  ];

  const handleCopy = (prayer: PrayerItem) => {
    navigator.clipboard.writeText(`${prayer.title}\n\n${prayer.content}`);
    setCopiedId(prayer.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreatePrayer = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const customPrayer: PrayerItem = {
      id: `custom_prayer_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      is_custom: true,
      created_at: new Date().toISOString()
    };

    setPrayers([customPrayer, ...prayers]);
    setShowAddModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const filteredPrayers = prayers.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <HeartHandshake className="w-4 h-4" />
            <span>Sacred Sanctuary</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Prayer Altar & Daily Watches
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            "Watch and pray that you may not enter into temptation." Build an unshakeable prayer altar throughout your day with sacred chime alarms.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('altar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'altar'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Prayer Altar & Alarms</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Prayer Catalog</span>
          </button>
        </div>
      </div>

      {/* Alarm Rung Notification Banner */}
      {altarRungMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-lg">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
            <span className="font-semibold">{altarRungMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAltarRungMessage(null);
                handleEnterAltarSanctuary();
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Enter Altar
            </button>
            <button
              onClick={() => setAltarRungMessage(null)}
              className="p-1 rounded-md text-amber-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 1: PRAYER ALTAR & ALARMS ================= */}
      {activeTab === 'altar' && (
        <div className="space-y-6">

          {/* UPCOMING ALTAR WATCH HERO CARD */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Clock className="w-4 h-4" />
                <span>Next Consecrated Watch</span>
              </div>
              {nextWatchInfo ? (
                <>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                      {nextWatchInfo.altar.title}
                    </h3>
                    <span className="text-base sm:text-lg font-mono font-bold text-amber-400">
                      {nextWatchInfo.altar.time} ({formatCountdown(nextWatchInfo.diffMins)})
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-serif italic max-w-xl">
                    "{nextWatchInfo.altar.scripture_text}" — {nextWatchInfo.altar.scripture_ref}
                  </p>
                </>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-slate-100">No Active Altar Watches</h3>
                  <p className="text-xs text-slate-400">Enable an altar watch below to receive scheduled prayer chimes.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => handleEnterAltarSanctuary(nextWatchInfo?.altar)}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                <span>ENTER PRAYER ALTAR NOW</span>
              </button>
              <button
                onClick={() => setShowAddAltarModal(true)}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>SET UP NEW ALTAR WATCH</span>
              </button>
            </div>
          </div>

          {/* QUICK BIBLICAL WATCH PRESETS */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Quick-Add Biblical Watch Presets
              </span>
              <span className="text-[11px] text-slate-400">Tap to instantly create an altar watch & alarm</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {quickPresets.map((preset) => (
                <button
                  key={preset.title}
                  onClick={() => handleAddPreset(preset)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900 text-left transition flex flex-col justify-between gap-1 cursor-pointer group"
                >
                  <span className="text-xs font-mono font-bold text-amber-300 group-hover:text-amber-200">
                    {preset.time}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-200 truncate">
                    {preset.title.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate">
                    {preset.scripture_ref}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ALTAR WATCHES & ALARMS LIST */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  Configured Altar Watches & Alarms
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set consecrated prayer alarms for any time of the day. You can edit the alarm time directly on each card below.
                </p>
              </div>
              <button
                onClick={() => playAltarChime('cathedral-bell')}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
                title="Test sacred audio chime"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Chime</span>
              </button>
            </div>

            <div className="space-y-3">
              {altars.map((altar) => (
                <div
                  key={altar.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    altar.active
                      ? 'bg-slate-950/70 border-slate-800/90 text-slate-200'
                      : 'bg-slate-950/30 border-slate-900 text-slate-500'
                  }`}
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Direct Inline Time Edit Input */}
                      <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800" title="Click to adjust alarm time directly">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <input
                          type="time"
                          value={altar.time}
                          onChange={(e) => handleUpdateTime(altar.id, e.target.value)}
                          className="bg-transparent text-sm font-mono font-bold text-amber-400 focus:outline-none cursor-pointer w-20"
                        />
                      </div>
                      <h4 className="text-sm font-bold text-slate-100">{altar.title}</h4>
                      
                      {/* Chime selector */}
                      <select
                        value={altar.sound_type}
                        onChange={(e) => handleUpdateSound(altar.id, e.target.value as ChimeType)}
                        className="text-[10px] uppercase font-mono px-2 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 focus:outline-none cursor-pointer"
                        title="Change chime sound for this watch"
                      >
                        <option value="cathedral-bell">Bell</option>
                        <option value="temple-chime">Chime</option>
                        <option value="sacred-harp">Harp</option>
                        <option value="gentle-gong">Gong</option>
                      </select>
                    </div>

                    <p className="text-xs text-slate-300 font-serif italic">
                      "{altar.scripture_text}" — <span className="font-sans font-semibold text-amber-300/90">{altar.scripture_ref}</span>
                    </p>

                    <p className="text-[11px] text-slate-400">
                      <strong>Focus:</strong> {altar.focus}
                    </p>
                  </div>

                  {/* Actions / Toggles */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                    <button
                      onClick={() => playAltarChime(altar.sound_type)}
                      className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition cursor-pointer"
                      title="Play Altar Sound Preview"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleAlarm(altar.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        altar.alarm_enabled
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                          : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                      }`}
                      title={altar.alarm_enabled ? 'Alarm is active at this time' : 'Alarm is currently muted'}
                    >
                      {altar.alarm_enabled ? <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> : <BellOff className="w-3.5 h-3.5" />}
                      <span>{altar.alarm_enabled ? 'Alarm: ON' : 'Alarm: OFF'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleActive(altar.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        altar.active
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      {altar.active ? 'Active' : 'Disabled'}
                    </button>

                    <button
                      onClick={() => handleEnterAltarSanctuary(altar)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer"
                    >
                      Enter Altar
                    </button>

                    {altars.length > 1 && (
                      <button
                        onClick={() => handleDeleteAltar(altar.id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-red-400 transition cursor-pointer"
                        title="Delete Altar Watch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* THEOLOGICAL TEACHING ON THE PRAYER ALTAR */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Why Establish a Consecrated Prayer Altar?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-300">1. Eliminating Vulnerable Gaps</span>
                <p className="text-slate-400">
                  Lust thrives in unplanned, idle moments. Consecrating specific watch times preemptively fills your schedule with holy incense.
                </p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-300">2. Living Altar of Worship</span>
                <p className="text-slate-400">
                  Romans 12:1 calls you to present your body as a living sacrifice. The altar is where personal appetites die and Christ’s life is received.
                </p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-300">3. Spiritual Perimeter Defense</span>
                <p className="text-slate-400">
                  David prayed evening, morning, and noon (Psalm 55:17). Frequent check-ins maintain unbroken communion with the Holy Spirit.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: PRAYER CATALOG ================= */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400 font-bold'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0 ml-3"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Prayer</span>
            </button>
          </div>

          {/* Prayers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrayers.map((prayer) => {
              const isCopied = copiedId === prayer.id;
              return (
                <div
                  key={prayer.id}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-800/80">
                      <div>
                        <h3 className="text-base font-bold text-slate-100">{prayer.title}</h3>
                        {prayer.scripture_anchor && (
                          <p className="text-[11px] font-mono text-amber-400/90 mt-0.5">
                            {prayer.scripture_anchor}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 capitalize whitespace-nowrap">
                        {prayer.category.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                      {prayer.content}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setFocusPrayer(prayer)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Focus Mode</span>
                    </button>

                    <button
                      onClick={() => handleCopy(prayer)}
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL-SCREEN IMMERSIVE PRAYER ALTAR SANCTUARY */}
      {isAltarSanctuaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl text-slate-100 my-auto space-y-6 text-center">
            
            {/* Top Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-widest flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                The Consecrated Prayer Altar
              </span>
              <button
                onClick={() => setIsAltarSanctuaryOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Holy Altar Ambience & Scripture */}
            <div className="space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <Flame className="w-8 h-8 animate-pulse text-amber-400" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                {activeSanctuaryWatch?.title || 'Consecrated Altar Watch'}
              </h3>

              <blockquote className="bg-slate-950/80 p-5 rounded-2xl border border-amber-500/20 text-sm sm:text-base font-serif italic text-amber-100 leading-relaxed max-w-lg mx-auto">
                "{activeSanctuaryWatch?.scripture_text}"
                <div className="text-xs font-sans text-amber-400 not-italic font-bold mt-2">
                  — {activeSanctuaryWatch?.scripture_ref}
                </div>
              </blockquote>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Quiet your soul. Disconnect from screens and noise. Present your body, eyes, and affections as a living sacrifice to Jesus Christ.
              </p>
            </div>

            {/* Countdown Clock */}
            <div className="py-2">
              <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-amber-400/40 bg-slate-950 shadow-inner">
                <span className="text-3xl font-mono font-black text-amber-300 tracking-wider">
                  {formatTimer(altarSecondsLeft)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                  Holy Silence
                </span>
              </div>
            </div>

            {/* Timer Duration Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {[180, 300, 600, 900].map((durationSecs) => (
                <button
                  key={durationSecs}
                  onClick={() => {
                    setAltarDuration(durationSecs);
                    setAltarSecondsLeft(durationSecs);
                    setIsAltarTimerRunning(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    altarDuration === durationSecs
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {durationSecs / 60} Min
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsAltarTimerRunning(!isAltarTimerRunning)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAltarTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isAltarTimerRunning ? 'Pause Timer' : 'Resume Silence'}</span>
              </button>

              <button
                onClick={() => playAltarChime(activeSanctuaryWatch?.sound_type || 'cathedral-bell')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ring Bell</span>
              </button>

              <button
                onClick={handleConcludeAltar}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                CONCLUDE ALTAR & SEAL WITH AMEN
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SET UP NEW PRAYER ALTAR MODAL */}
      {showAddAltarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Set Up Prayer Altar Watch
              </h3>
              <button
                onClick={() => setShowAddAltarModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Watch Time of Day</label>
                  <input
                    type="time"
                    value={newAltarTime}
                    onChange={(e) => setNewAltarTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Altar Watch Title</label>
                  <input
                    type="text"
                    value={newAltarTitle}
                    onChange={(e) => setNewAltarTitle(e.target.value)}
                    placeholder="e.g. Afternoon Warfare Watch"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Spiritual Focus & Intention</label>
                <input
                  type="text"
                  value={newAltarFocus}
                  onChange={(e) => setNewAltarFocus(e.target.value)}
                  placeholder="e.g. Breaking afternoon fatigue & renewing thoughts"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Scripture Reference</label>
                  <input
                    type="text"
                    value={newAltarScriptureRef}
                    onChange={(e) => setNewAltarScriptureRef(e.target.value)}
                    placeholder="e.g. Psalm 119:62"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Alarm Chime Tone</label>
                  <div className="flex gap-2">
                    <select
                      value={newAltarSound}
                      onChange={(e) => setNewAltarSound(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                    >
                      <option value="cathedral-bell">Cathedral Bell (Harmonic)</option>
                      <option value="temple-chime">Temple Wind Chime (Celestial)</option>
                      <option value="sacred-harp">Sacred Harp (Arpeggio)</option>
                      <option value="gentle-gong">Gentle Bronze Gong</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => playAltarChime(newAltarSound)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300"
                      title="Preview chime"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Scripture Verse Text</label>
                <textarea
                  rows={2}
                  value={newAltarScriptureText}
                  onChange={(e) => setNewAltarScriptureText(e.target.value)}
                  placeholder="Paste or write the verse text..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none font-serif"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="alarmCheckbox"
                  checked={newAltarAlarmEnabled}
                  onChange={(e) => setNewAltarAlarmEnabled(e.target.checked)}
                  className="accent-amber-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="alarmCheckbox" className="font-semibold text-slate-300 cursor-pointer">
                  Sound chime alarm and send notification at this time
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddAltarModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAltar}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Set Altar Watch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRAYER FOCUS MODAL */}
      {focusPrayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-10 shadow-2xl text-slate-100 my-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-amber-200">{focusPrayer.title}</h3>
                {focusPrayer.scripture_anchor && (
                  <p className="text-xs text-slate-400 mt-1">{focusPrayer.scripture_anchor}</p>
                )}
              </div>
              <button
                onClick={() => setFocusPrayer(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-base sm:text-lg font-serif italic text-slate-200 leading-relaxed whitespace-pre-line max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {focusPrayer.content}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setFocusPrayer(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider cursor-pointer"
              >
                AMEN (CLOSE)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WRITE CUSTOM PRAYER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">Write a Personal Prayer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Prayer Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My Evening Protection Prayer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                >
                  <option value="morning">Morning</option>
                  <option value="temptation">Temptation</option>
                  <option value="after-fall">After a Fall</option>
                  <option value="strength">Strength</option>
                  <option value="renewal">Mind Renewal</option>
                  <option value="sleep">Before Sleep</option>
                  <option value="custom">Personal</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Your Prayer Words</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Pour out your heart before God..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none font-serif"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePrayer}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Save Prayer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
