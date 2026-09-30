import React, { useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-200 shadow-sm hover:bg-amber-500/30 transition-all cursor-pointer"
        title="Install Freedom in Christ to your device"
      >
        <Download className="w-3.5 h-3.5 text-amber-400" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-lg bg-slate-800/80 border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700/80 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-semibold text-amber-200 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-amber-400" />
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Add <strong>Freedom in Christ</strong> to your home screen for private, instant offline access:
              </p>
              <ol className="mt-3 space-y-2 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">1.</span>
                  <span>Tap the <strong>Share</strong> icon in the bottom Safari toolbar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">2.</span>
                  <span>Scroll down and select <strong>"Add to Home Screen"</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">3.</span>
                  <span>Tap <strong>Add</strong> in the top right corner.</span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-xs font-medium text-slate-950 font-semibold hover:bg-amber-400 transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
