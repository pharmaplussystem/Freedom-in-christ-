import React, { useState } from 'react';
import { 
  Home, 
  Swords, 
  BookOpen, 
  HeartHandshake, 
  Shield, 
  Menu, 
  X,
  BookMarked,
  TrendingUp,
  Crosshair,
  CheckSquare,
  Users,
  Library,
  Settings,
  RotateCcw
} from 'lucide-react';
import { ViewMode } from '../../types';

interface MobileNavProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenStumbleModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onSelectView,
  onOpenStumbleModal
}) => {
  const [showDrawer, setShowDrawer] = useState(false);

  const mainTabs: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'daily-battle', label: 'Battle', icon: Swords },
    { id: 'scripture', label: 'Scripture', icon: BookOpen },
    { id: 'prayer', label: 'Altar & Pray', icon: HeartHandshake },
    { id: 'armor', label: 'Armor', icon: Shield },
  ];

  const drawerItems: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'journal', label: 'Private Journal', icon: BookMarked },
    { id: 'progress', label: 'Progress & Streaks', icon: TrendingUp },
    { id: 'triggers', label: 'Trigger Tracker', icon: Crosshair },
    { id: 'habits', label: 'Daily Spiritual Habits', icon: CheckSquare },
    { id: 'accountability', label: 'Accountability Contact', icon: Users },
    { id: 'resources', label: 'Biblical Foundations & Teachings', icon: Library },
    { id: 'settings', label: 'Settings & Cloud Sync', icon: Settings },
  ];

  const handleSelect = (view: ViewMode) => {
    onSelectView(view);
    setShowDrawer(false);
  };

  return (
    <>
      {/* Mobile Drawer Menu Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div 
            className="w-full bg-slate-900 border-t border-slate-800 rounded-t-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">All Sections</h3>
              <button 
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium text-left transition ${
                      isActive 
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' 
                        : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Stumble Grace Button inside Drawer */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowDrawer(false);
                  onOpenStumbleModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-semibold border border-amber-500/20"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>I Stumbled (Grace & Restoration Flow)</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                "There is therefore now no condemnation for those in Christ Jesus."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-slate-800/90 bg-slate-950/95 backdrop-blur-lg px-2 py-1 safe-area-pb">
        <div className="flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectView(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[54px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}

          {/* More Drawer Button */}
          <button
            onClick={() => setShowDrawer(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[54px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
              showDrawer ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5 text-slate-400" />
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
