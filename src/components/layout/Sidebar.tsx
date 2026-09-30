import React from 'react';
import { 
  Home, 
  Swords, 
  BookOpen, 
  HeartHandshake, 
  Shield, 
  BookMarked, 
  TrendingUp, 
  Crosshair, 
  CheckSquare, 
  Users, 
  Library, 
  Settings, 
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { ViewMode } from '../../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenEmergency: () => void;
  onOpenStumbleModal: () => void;
  appName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenEmergency,
  onOpenStumbleModal,
  appName
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'daily-battle', label: 'Daily Battle', icon: Swords },
    { id: 'scripture', label: 'Scripture', icon: BookOpen },
    { id: 'prayer', label: 'Prayer & Altar', icon: HeartHandshake },
    { id: 'armor', label: 'Armor of God', icon: Shield },
    { id: 'journal', label: 'Journal', icon: BookMarked },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'triggers', label: 'Trigger Tracker', icon: Crosshair },
    { id: 'habits', label: 'Daily Habits', icon: CheckSquare },
    { id: 'accountability', label: 'Accountability', icon: Users },
    { id: 'resources', label: 'Biblical Foundations', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800/80 bg-slate-950/90 p-4 shrink-0 h-screen sticky top-0 justify-between select-none">
      {/* Top Branding */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/40 flex items-center justify-center shadow-inner">
            <span className="text-amber-400 font-serif font-black text-xl">✝</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 tracking-tight leading-snug">{appName}</h2>
            <p className="text-[11px] text-amber-400/80 font-medium">Purity & Self-Control</p>
          </div>
        </div>

        {/* Emergency Button in Sidebar */}
        <div className="mb-4 px-1">
          <button
            onClick={onOpenEmergency}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-600/90 hover:bg-red-600 active:bg-red-700 text-white font-bold text-xs tracking-wider shadow-md shadow-red-950/40 border border-red-500/40 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-red-100 animate-bounce" />
            <span>I'M BEING TEMPTED</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-200 border-l-2 border-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Grace & Recovery Button */}
      <div className="pt-3 border-t border-slate-900 px-1">
        <button
          onClick={onOpenStumbleModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 text-xs font-medium transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>I Stumbled (Grace Flow)</span>
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          "Return to Christ. Begin again today."
        </p>
      </div>
    </aside>
  );
};
