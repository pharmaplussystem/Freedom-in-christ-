import React from 'react';
import { ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { ViewMode } from '../../types';

interface HeaderProps {
  currentView: ViewMode;
  onOpenEmergency: () => void;
  appName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onOpenEmergency,
  appName
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Brand / View Title */}
        <div className="flex items-center gap-3 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
            <span className="text-amber-400 font-serif font-bold text-sm">✝</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-100 tracking-tight">{appName}</h1>
            <p className="text-[10px] text-slate-400 capitalize">{currentView.replace('-', ' ')}</p>
          </div>
        </div>

        {/* Desktop View Banner */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-amber-400/90 font-medium">
            Walk By The Spirit
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">
            Galatians 5:16
          </span>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <OfflineIndicator />
          <PWAInstallButton />

          {/* HIGH-PRIORITY PROMINENT "I'M BEING TEMPTED" BUTTON */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-950/50 border border-red-400/40 transition-all transform hover:scale-[1.02] cursor-pointer animate-pulse"
          >
            <ShieldAlert className="w-4 h-4 text-red-200" />
            <span className="whitespace-nowrap">I'M BEING TEMPTED</span>
          </button>
        </div>
      </div>
    </header>
  );
};
