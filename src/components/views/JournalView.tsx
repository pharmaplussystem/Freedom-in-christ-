import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Bookmark, 
  X, 
  Calendar,
  Lock,
  Sparkles
} from 'lucide-react';
import { JournalEntry, TriggerCategory } from '../../types';
import { storage } from '../../services/storage';

export const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('peaceful');
  const [trigger, setTrigger] = useState<TriggerCategory | string>('');
  const [scripture, setScripture] = useState('');
  const [prayer, setPrayer] = useState('');
  const [whatLearned, setWhatLearned] = useState('');
  const [nextStep, setNextStep] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const list = await storage.getJournalEntries();
    setEntries(list);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('peaceful');
    setTrigger('');
    setScripture('');
    setPrayer('');
    setWhatLearned('');
    setNextStep('');
    setEditingId(null);
    setShowEditor(false);
  };

  const handleOpenEditor = (entry?: JournalEntry) => {
    if (entry) {
      setEditingId(entry.id);
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood);
      setTrigger(entry.trigger || '');
      setScripture(entry.scripture || '');
      setPrayer(entry.prayer || '');
      setWhatLearned(entry.what_learned || '');
      setNextStep(entry.next_step || '');
    } else {
      resetForm();
    }
    setShowEditor(true);
  };

  const handleSaveEntry = async () => {
    if (!title.trim() || !content.trim()) return;

    const entry: JournalEntry = {
      id: editingId || `journal_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      mood,
      trigger: trigger || undefined,
      scripture: scripture.trim() || undefined,
      prayer: prayer.trim() || undefined,
      what_learned: whatLearned.trim() || undefined,
      next_step: nextStep.trim() || undefined,
      is_favorite: false,
      created_at: editingId ? (entries.find(e => e.id === editingId)?.created_at || new Date().toISOString()) : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await storage.saveJournalEntry(entry);
    await loadEntries();
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this private journal reflection?')) {
      await storage.deleteJournalEntry(id);
      await loadEntries();
    }
  };

  const toggleFavorite = async (entry: JournalEntry) => {
    const updated = { ...entry, is_favorite: !entry.is_favorite };
    await storage.saveJournalEntry(updated);
    await loadEntries();
  };

  const filteredEntries = entries.filter((e) => {
    const matchesMood = selectedMood === 'all' || e.mood === selectedMood;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q);
    return matchesMood && matchesSearch;
  });

  const moods: { id: JournalEntry['mood']; label: string; icon: string }[] = [
    { id: 'peaceful', label: 'Peaceful', icon: '🕊️' },
    { id: 'victorious', label: 'Victorious', icon: '🛡️' },
    { id: 'hopeful', label: 'Hopeful', icon: '🌅' },
    { id: 'struggling', label: 'Struggling', icon: '⚔️' },
    { id: 'anxious', label: 'Anxious', icon: '🌧️' },
    { id: 'grieving', label: 'Grieving', icon: '💔' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted & Confidential</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Private Spiritual Journal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Bring every thought into the light of Christ. Reflect on your triggers, what you learned, and God's faithfulness.
          </p>
        </div>

        <button
          onClick={() => handleOpenEditor()}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>NEW JOURNAL ENTRY</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by title or reflection..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 custom-scrollbar">
          <button
            onClick={() => setSelectedMood('all')}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer ${
              selectedMood === 'all'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-400'
                : 'bg-slate-900 border border-slate-800 text-slate-400'
            }`}
          >
            All Moods
          </button>
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedMood === m.id
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-400'
                  : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-12 text-center space-y-3">
          <BookMarked className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Journal Entries Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Take a moment to record your thoughts, honest struggles, or thanksgiving to Jesus.
          </p>
          <button
            onClick={() => handleOpenEditor()}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Write Your First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-lg hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {moods.find(m => m.id === entry.mood)?.icon || '📝'}
                    </span>
                    <h3 className="text-base font-bold text-slate-100">{entry.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{new Date(entry.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {entry.trigger && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400">Trigger: {entry.trigger}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(entry)}
                    className={`p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer ${
                      entry.is_favorite ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditor(entry)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {entry.content}
              </p>

              {/* Reflection Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                {entry.what_learned && (
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-semibold text-amber-300 block mb-0.5">What I Learned:</span>
                    <span className="text-slate-300">{entry.what_learned}</span>
                  </div>
                )}
                {entry.next_step && (
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-semibold text-emerald-300 block mb-0.5">Next Step in Christ:</span>
                    <span className="text-slate-300">{entry.next_step}</span>
                  </div>
                )}
                {entry.scripture && (
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-semibold text-blue-300 block mb-0.5">Scripture Anchor:</span>
                    <span className="text-slate-300 italic">{entry.scripture}</span>
                  </div>
                )}
                {entry.prayer && (
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-semibold text-amber-400 block mb-0.5">My Prayer:</span>
                    <span className="text-slate-300 italic">{entry.prayer}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100">
                {editingId ? 'Edit Journal Entry' : 'New Journal Entry'}
              </h3>
              <button
                onClick={resetForm}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Evening Reflection & Standing Fast"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Current Spiritual Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    {moods.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Associated Trigger (if any)</label>
                  <input
                    type="text"
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                    placeholder="e.g. Late-night fatigue, Stress at work"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">What happened / Honest reflection</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write honestly before the Lord. What happened? What thoughts were you wrestling with?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">What did I learn?</label>
                  <input
                    type="text"
                    value={whatLearned}
                    onChange={(e) => setWhatLearned(e.target.value)}
                    placeholder="e.g. I need to avoid taking my phone to bed."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Next Step / Commitment</label>
                  <input
                    type="text"
                    value={nextStep}
                    onChange={(e) => setNextStep(e.target.value)}
                    placeholder="e.g. Charge phone in hallway; pray 1 Cor 10:13"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Scripture Anchor</label>
                  <input
                    type="text"
                    value={scripture}
                    onChange={(e) => setScripture(e.target.value)}
                    placeholder="e.g. Romans 12:2"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Prayer</label>
                  <input
                    type="text"
                    value={prayer}
                    onChange={(e) => setPrayer(e.target.value)}
                    placeholder="e.g. 'Lord, hold my heart steadfast in Your love.'"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEntry}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
