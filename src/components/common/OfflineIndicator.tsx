import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { syncOfflineQueue } from '../../services/supabase';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isOnline) {
      triggerSync();
    }
  }, [isOnline]);

  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncOfflineQueue();
      if (res.syncedCount > 0) {
        setSyncStatus(`Synced (${res.syncedCount} items)`);
      } else {
        setSyncStatus('Data Saved Locally');
      }
      setTimeout(() => setSyncStatus(null), 4000);
    } catch {
      setSyncStatus('Local Safe Mode');
      setTimeout(() => setSyncStatus(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
        <WifiOff className="w-3 h-3 text-amber-400" />
        <span>Offline Mode (IndexedDB Active)</span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium">
        <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
        <span>Syncing...</span>
      </div>
    );
  }

  if (syncStatus) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>{syncStatus}</span>
      </div>
    );
  }

  return (
    <button 
      onClick={triggerSync}
      title="Click to trigger cloud synchronization"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400 text-xs transition cursor-pointer"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span>Online</span>
    </button>
  );
};
