# Freedom in Christ
> **A Biblical Journey Toward Purity, Self-Control, and Spiritual Victory in Jesus Christ**

---

## 1. Overview & Purpose

**Freedom in Christ** is a complete, private, compassionate, and Bible-centered Progressive Web Application (PWA) designed for individuals seeking freedom from pornography, masturbation, lust, sexual temptation, and related compulsions.

### Core Spiritual & Theological Principles
- **Christ-Centered Victory:** Believers fight *from* victory, not *for* victory. Jesus Christ broke the power of sin on the cross (Romans 6:6-14; Colossians 1:13-14).
- **Grace-Based Sanctification:** A purity streak is merely a personal tracking tool—never the measure of salvation, personal worth, or God's love.
- **Restoration Without Shame:** When a believer stumbles, the app rejects demonic condemnation and guides the user through honest confession (1 John 1:9), receiving forgiveness, identifying environmental triggers, and getting back up (Proverbs 24:16).
- **The Armor of God in Practice:** Practical, real-time application of Ephesians 6:10-18 (Belt of Truth exposing lies, Breastplate of Righteousness guarding the heart, Shoes of Peace, Shield of Faith extinguishing flaming arrows, Helmet of Salvation guarding the mind and neuroplastic renewal, and the Sword of the Spirit speaking the spoken *rhema* Word).
- **Theological Nuance:** The app carefully distinguishes between explicit biblical text (e.g., Matthew 5:28, 1 Corinthians 6:18) and applied principles regarding masturbation and self-gratification outside covenant marriage.

---

## 2. Project Architecture & File Structure

```text
freedom-in-christ/
├── index.html                   # HTML entry point with PWA meta & theme colors
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration with VitePWA
├── tsconfig.json                # TypeScript compiler configuration
├── metadata.json                # AI Studio application metadata
├── README.md                    # Complete deployment & architecture guide
│
├── public/
│   ├── manifest.json            # PWA Web App Manifest
│   ├── service-worker.js        # Offline asset caching service worker
│   ├── icon.svg                 # High-contrast golden cross & shield vector
│   ├── pwa-192x192.png          # 192px mobile icon
│   ├── pwa-512x512.png          # 512px desktop icon
│   ├── pwa-maskable-512x512.png # Maskable Android icon (safe-zone padded)
│   ├── apple-touch-icon.png     # iOS Safari home screen icon
│   └── favicon.ico              # Tab favicon
│
├── src/
│   ├── main.tsx                 # React DOM root
│   ├── App.tsx                  # Main layout orchestrator & views router
│   ├── index.css                # Global styles & Tailwind CSS
│   ├── types/
│   │   └── index.ts             # Complete TypeScript data schemas
│   ├── data/
│   │   ├── scriptures.ts        # Categorized biblical library & sword verses
│   │   ├── armorOfGod.ts        # In-depth armor commentary, lies vs truths, & guided prayer
│   │   └── prayers.ts           # Pre-written prayers for every battle stage
│   ├── services/
│   │   ├── storage.ts           # IndexedDB offline-first persistence engine
│   │   └── supabase.ts          # Supabase cloud auth & bidirectional synchronization
│   ├── hooks/
│   │   ├── usePWAInstall.ts     # PWA prompt & iOS Safari instructions hook
│   │   └── useOnlineStatus.ts   # Network connectivity listener
│   └── components/
│       ├── layout/              # Header, Desktop Sidebar, Mobile Bottom Nav
│       ├── emergency/           # 5-step Emergency Temptation Protocol (SOS)
│       ├── modals/              # "I Stumbled" 7-step Grace Restoration Modal
│       ├── common/              # PWAInstallButton, OfflineIndicator
│       └── views/               # Home, Daily Battle, Armor, Scripture, Prayer,
│                                # Journal, Triggers, Progress, Habits,
│                                # Accountability, Resources, Settings
│
└── supabase/
    └── database.sql             # Complete PostgreSQL schema with RLS security
```

---

## 3. Offline Mode & Synchronization

The application is built **Offline-First**:
1. **IndexedDB Local Storage:** All actions (journal entries, habit check-offs, triggers, stumbles, favorite verses) are saved immediately to local IndexedDB (`FreedomInChristDB`).
2. **Offline Queue:** When offline, changes are queued in the `sync_queue` object store.
3. **Automatic Online Sync:** As soon as connectivity is restored, the queue is synced to Supabase (if configured in Settings).
4. **No Network Reliance:** The dashboard, emergency mode, scriptures, prayers, and armor guides function 100% without an active internet connection.

---

## 4. Supabase Setup Guide

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, choose a region close to you, and set a database password.

### Step 2: Run the SQL Schema
1. In your Supabase Dashboard, navigate to the **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Copy the entire contents of `supabase/database.sql` from this repository.
4. Paste it into the editor and click **Run**.
5. This creates all 12 tables (`profiles`, `journal_entries`, `triggers`, `habits`, `habit_completions`, `progress`, `stumbles`, `scripture_favorites`, `prayers`, `accountability_contacts`, `fasting`, `settings`) and configures strict **Row Level Security (RLS)** so users can only access their own private data.

### Step 3: Configure Authentication
1. In your Supabase Dashboard, go to **Authentication** > **Providers** > **Email**.
2. Ensure **Email provider** is enabled.
3. (Optional) Under **URL Configuration**, set the **Site URL** to your Netlify or GitHub Pages domain.

### Step 4: Connect to the App
1. Go to **Project Settings** > **API**.
2. Copy your **Project URL** (`https://xyzcompany.supabase.co`).
3. Copy your **anon / public** key.
4. Open the web app, navigate to **Settings**, paste your credentials under **Supabase Configuration**, and click **Save Cloud Settings**.

---

## 5. Deployment Instructions

### A. Deploy to Netlify (Recommended)
1. Push this repository to your GitHub account.
2. Log into [Netlify](https://www.netlify.com).
3. Click **Add new site** > **Import an existing project**.
4. Choose **GitHub** and select your repository.
5. Set Build Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click **Deploy Site**. Netlify will provide an HTTPS URL with PWA support immediately!

### B. Deploy to GitHub Pages
1. In `vite.config.ts`, if your repository is hosted at `https://<username>.github.io/<repo>/`, set `base: '/<repo>/'`.
2. Run `npm run build`.
3. In GitHub, go to **Settings** > **Pages**.
4. Choose **GitHub Actions** as the source and use the standard static Vite deployment workflow.

---

## 6. How to Convert to an Android APK

Because this app adheres strictly to PWA standards (valid `manifest.json`, responsive viewport, 192px/512px/maskable icons, standalone display mode, and service worker):

### Option A: PWABuilder (Easiest - No Coding Required)
1. Deploy your app to Netlify with HTTPS.
2. Go to [https://www.pwabuilder.com](https://www.pwabuilder.com).
3. Enter your live Netlify URL and click **Start**.
4. PWABuilder will verify your PWA score (all requirements will pass).
5. Click **Package for Android** > **Download APK / AAB**.
6. Sign and install the APK on any Android phone or submit the AAB to the Google Play Store!

### Option B: Google Bubblewrap CLI (Official Google Tool)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://your-app.netlify.app/manifest.json
bubblewrap build
```

### Option C: Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Freedom in Christ" "com.freedominchrist.app" --web-dir dist
npm run build
npx cap add android
npx cap open android
```

---

## 7. Privacy & Security Assurance

- **Zero Telemetry / Zero Trackers:** We do not track browsing history, monitor other apps, or collect private metrics.
- **Zero Third-Party Advertising:** No ads or monetization scripts.
- **Safe Accountability:** Contacts added in the Accountability module are never alerted automatically. All calls and text messages require explicit user confirmation.
- **Complete Data Portability:** Users can export all journal entries, progress stats, and triggers to JSON and CSV formats at any time in **Settings**.
