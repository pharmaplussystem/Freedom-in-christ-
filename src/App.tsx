import React, { useState, useEffect } from 'react';
import { ViewMode, AppSettings } from './types';
import { storage } from './services/storage';
import { applyTheme } from './services/theme';

// Layout
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Modals
import { EmergencyTemptationModal } from './components/emergency/EmergencyTemptationModal';
import { StumbleModal } from './components/modals/StumbleModal';

// Views
import { HomeView } from './components/views/HomeView';
import { DailyBattleView } from './components/views/DailyBattleView';
import { ArmorView } from './components/views/ArmorView';
import { ScriptureView } from './components/views/ScriptureView';
import { PrayerCenterView } from './components/views/PrayerCenterView';
import { JournalView } from './components/views/JournalView';
import { TriggerTrackerView } from './components/views/TriggerTrackerView';
import { ProgressView } from './components/views/ProgressView';
import { HabitsView } from './components/views/HabitsView';
import { AccountabilityView } from './components/views/AccountabilityView';
import { ResourcesView } from './components/views/ResourcesView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isStumbleOpen, setIsStumbleOpen] = useState(false);
  const [appName, setAppName] = useState('Freedom in Christ');

  useEffect(() => {
    storage.getSettings().then((s) => {
      if (s?.app_name) setAppName(s.app_name);
      if (s?.theme) applyTheme(s.theme);
    });
  }, []);

  const refreshSettings = () => {
    storage.getSettings().then((s) => {
      if (s?.app_name) setAppName(s.app_name);
      if (s?.theme) applyTheme(s.theme);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Emergency Temptation SOS Full-Screen Protocol */}
      <EmergencyTemptationModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onTemptationResisted={() => {
          // If user was in home or progress, refresh
          setIsEmergencyOpen(false);
        }}
      />

      {/* "I Stumbled" Grace-Based Restoration Protocol */}
      <StumbleModal
        isOpen={isStumbleOpen}
        onClose={() => setIsStumbleOpen(false)}
        onStumbleRecorded={() => {
          setIsStumbleOpen(false);
        }}
      />

      <div className="flex flex-1 w-full">
        {/* Desktop Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenStumbleModal={() => setIsStumbleOpen(true)}
          appName={appName}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            currentView={currentView}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            appName={appName}
          />

          <main className="flex-1 px-4 py-6 sm:px-8 max-w-7xl w-full mx-auto overflow-y-auto">
            {currentView === 'home' && (
              <HomeView
                onSelectView={setCurrentView}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
                onOpenStumble={() => setIsStumbleOpen(true)}
              />
            )}

            {currentView === 'daily-battle' && (
              <DailyBattleView
                onOpenPrayerCenter={() => setCurrentView('prayer')}
                onTemptationResisted={() => {}}
              />
            )}

            {currentView === 'armor' && (
              <ArmorView />
            )}

            {currentView === 'scripture' && (
              <ScriptureView />
            )}

            {currentView === 'prayer' && (
              <PrayerCenterView />
            )}

            {currentView === 'journal' && (
              <JournalView />
            )}

            {currentView === 'triggers' && (
              <TriggerTrackerView />
            )}

            {currentView === 'progress' && (
              <ProgressView
                onOpenStumble={() => setIsStumbleOpen(true)}
              />
            )}

            {currentView === 'habits' && (
              <HabitsView />
            )}

            {currentView === 'accountability' && (
              <AccountabilityView />
            )}

            {currentView === 'resources' && (
              <ResourcesView />
            )}

            {currentView === 'settings' && (
              <SettingsView
                onSettingsUpdated={refreshSettings}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenStumbleModal={() => setIsStumbleOpen(true)}
      />

    </div>
  );
}
