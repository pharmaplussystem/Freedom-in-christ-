import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Copy, 
  Check, 
  Share2, 
  Eye, 
  EyeOff, 
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Swords
} from 'lucide-react';
import { SCRIPTURE_LIBRARY } from '../../data/scriptures';
import { ScriptureVerse, MemoryVerseProgress } from '../../types';
import { storage } from '../../services/storage';

export const ScriptureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'memorization'>('library');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Memorization State
  const [memoryProgress, setMemoryProgress] = useState<Record<string, MemoryVerseProgress>>({});
  const [activeMemoryVerse, setActiveMemoryVerse] = useState<ScriptureVerse>(SCRIPTURE_LIBRARY[0]);
  const [wordsHidden, setWordsHidden] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const favs = await storage.getFavorites();
    setFavorites(favs);
    const mems = await storage.getMemoryProgress();
    setMemoryProgress(mems);
  };

  const toggleFavorite = async (ref: string) => {
    await storage.toggleFavorite(ref);
    const favs = await storage.getFavorites();
    setFavorites(favs);
  };

  const handleCopy = (verse: ScriptureVerse) => {
    navigator.clipboard.writeText(`"${verse.text}" — ${verse.reference} (${verse.translation})`);
    setCopiedId(verse.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (verse: ScriptureVerse) => {
    if (navigator.share) {
      navigator.share({
        title: 'Scripture for Freedom',
        text: `"${verse.text}" — ${verse.reference}`,
      }).catch(() => handleCopy(verse));
    } else {
      handleCopy(verse);
    }
  };

  const handleMarkMemorized = async (verseId: string) => {
    const existing = memoryProgress[verseId] || {
      verse_id: verseId,
      memorized: false,
      review_count: 0
    };
    const updated: MemoryVerseProgress = {
      ...existing,
      memorized: !existing.memorized,
      review_count: existing.review_count + 1,
      last_reviewed: new Date().toISOString()
    };
    await storage.saveMemoryProgress(updated);
    const mems = await storage.getMemoryProgress();
    setMemoryProgress(mems);
  };

  // Filter verses
  const filteredVerses = SCRIPTURE_LIBRARY.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory || (selectedCategory === 'favorites' && favorites.includes(v.reference));
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || v.reference.toLowerCase().includes(q) || v.text.toLowerCase().includes(q) || v.summary.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Scriptures' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'purity', label: 'Purity' },
    { id: 'self-control', label: 'Self-Control' },
    { id: 'temptation', label: 'Temptation' },
    { id: 'renewal-of-mind', label: 'Renewal of Mind' },
    { id: 'identity-in-christ', label: 'Identity in Christ' },
    { id: 'grace-and-forgiveness', label: 'Grace & Forgiveness' },
    { id: 'spiritual-warfare', label: 'Spiritual Warfare' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>The Sword of the Spirit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Scripture Arsenal & Memorization
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            "Your word I have hidden in my heart, that I might not sin against You." (Psalm 119:11). Soak your mind in truth.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'library'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scripture Library
          </button>
          <button
            onClick={() => setActiveTab('memorization')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'memorization'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Memorization Studio
          </button>
        </div>
      </div>

      {activeTab === 'library' ? (
        <div className="space-y-6">
          
          {/* Search & Category Filter Bar */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scripture by reference, keyword, or topic (e.g., flee, temple, escape)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-200 focus:border-amber-400 focus:outline-none shadow-inner"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
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
          </div>

          {/* Verses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVerses.map((verse) => {
              const isFav = favorites.includes(verse.reference);
              const isCopied = copiedId === verse.id;

              return (
                <div
                  key={verse.id}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <span className="text-xs font-bold text-amber-400 tracking-wider">
                        {verse.reference}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {verse.is_sword_rhema && (
                          <span 
                            title={verse.sword_attack_target}
                            className="px-2 py-0.5 rounded text-[10px] bg-red-950/60 border border-red-500/30 text-red-300 font-bold flex items-center gap-1"
                          >
                            <Swords className="w-2.5 h-2.5" />
                            Rhema
                          </span>
                        )}
                        <button
                          onClick={() => toggleFavorite(verse.reference)}
                          className={`p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer ${
                            isFav ? 'text-amber-400' : 'text-slate-400'
                          }`}
                          title="Favorite verse"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <blockquote className="text-sm sm:text-base font-serif italic text-slate-100 leading-relaxed">
                      "{verse.text}"
                    </blockquote>

                    <p className="text-xs text-slate-300 leading-normal">
                      <span className="font-semibold text-amber-300/90">Insight: </span>
                      {verse.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 capitalize">
                      {verse.category.replace(/-/g, ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(verse)}
                        className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 transition cursor-pointer"
                        title="Copy Scripture text"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => handleShare(verse)}
                        className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 transition cursor-pointer"
                        title="Share Scripture"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* MEMORIZATION STUDIO */
        <div className="space-y-6">
          
          {/* Active Memory Verse Card */}
          <div className="rounded-3xl bg-slate-900 border-2 border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Today's Memory Verse
              </span>
              <span className="text-xs text-slate-400">
                {memoryProgress[activeMemoryVerse.id]?.memorized ? 'Memorized ✓' : 'In Practice'}
              </span>
            </div>

            <div className="text-center space-y-4 py-4">
              <h3 className="text-xl sm:text-2xl font-bold text-amber-300">
                {activeMemoryVerse.reference}
              </h3>

              <div className="max-w-xl mx-auto p-6 rounded-2xl bg-slate-950/80 border border-slate-800 min-h-[140px] flex items-center justify-center">
                {wordsHidden ? (
                  <p className="text-base sm:text-lg font-serif italic text-slate-400 tracking-wider">
                    {activeMemoryVerse.text.split(' ').map((word, idx) => (
                      <span key={idx} className="inline-block mx-1 border-b border-amber-400/50 text-transparent select-none">
                        {word.replace(/[a-zA-Z]/g, '_')}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="text-base sm:text-lg font-serif italic text-slate-100 leading-relaxed">
                    "{activeMemoryVerse.text}"
                  </p>
                )}
              </div>

              {/* Memory Practice Controls */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setWordsHidden(!wordsHidden)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  {wordsHidden ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                  <span>{wordsHidden ? 'Reveal Words' : 'Hide Words to Test Memory'}</span>
                </button>

                <button
                  onClick={() => handleMarkMemorized(activeMemoryVerse.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    memoryProgress[activeMemoryVerse.id]?.memorized
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {memoryProgress[activeMemoryVerse.id]?.memorized ? 'Marked Memorized ✓' : 'Mark as Memorized'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Select Verse List to Memorize */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select a Verse to Practice
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SCRIPTURE_LIBRARY.slice(0, 9).map((v) => {
                const isSelected = activeMemoryVerse.id === v.id;
                const isMem = memoryProgress[v.id]?.memorized;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveMemoryVerse(v);
                      setWordsHidden(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">{v.reference}</p>
                      <p className="text-[11px] text-slate-400 truncate">{v.text}</p>
                    </div>
                    {isMem && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
