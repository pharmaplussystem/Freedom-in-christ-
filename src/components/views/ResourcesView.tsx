import React, { useState } from 'react';
import { 
  Library, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  Heart,
  Scale
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>('grand-design');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? '' : id);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
          <Library className="w-4 h-4" />
          <span>Biblical Teaching & Theology</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          Biblical Foundations & Teachings
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          Derived from the foundational teaching manuscript <em>"Fighting the Battle of Sexual Sin with the Armour of God."</em> Ground your mind in sound doctrine, biblical nuance, and victorious grace.
        </p>
      </div>

      {/* Accordion Modules */}
      <div className="space-y-4">
        
        {/* MODULE 1: THE GRAND DESIGN */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('grand-design')}
            className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">👑</span>
              <div>
                <h3 className="text-base font-bold text-slate-100">1. God's Original Purpose for Sexuality</h3>
                <p className="text-xs text-slate-400">Before understanding the perversion, we must understand the sacred design.</p>
              </div>
            </div>
            {openSection === 'grand-design' ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'grand-design' && (
            <div className="p-6 pt-0 border-t border-slate-800 text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
              <p>
                Sexual sin is not an arbitrary prohibition; it is a corruption of something sacred, holy, and beautiful. Sex was God’s idea, existing before the Fall in a state of perfect innocence (Genesis 2:24-25).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <h4 className="font-bold text-amber-300">Permanence</h4>
                  <p className="text-slate-400">"Hold fast" speaks of a lifelong, unbreakable covenant bond between one man and one woman.</p>
                </div>
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <h4 className="font-bold text-amber-300">Intimacy</h4>
                  <p className="text-slate-400">"One flesh" refers to a union that is emotional, spiritual, and physical—not a casual recreational commodity.</p>
                </div>
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <h4 className="font-bold text-amber-300">Vulnerability Without Shame</h4>
                  <p className="text-slate-400">"Naked and not ashamed"—complete openness without fear, hiding, or objectification.</p>
                </div>
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <h4 className="font-bold text-amber-300">Living Picture of the Gospel</h4>
                  <p className="text-slate-400">Ephesians 5:32: Marriage mirrors Christ’s self-giving, exclusive, sacrificial love for His bride.</p>
                </div>
              </div>
              <p>
                When we understand this, the distortion becomes clear: sexual sin takes what was designed for self-giving covenant intimacy and drags it into selfish isolation and counterfeit exploitation.
              </p>
            </div>
          )}
        </div>

        {/* MODULE 2: THEOLOGICAL NUANCE (EXPLICIT SCRIPTURE VS PRINCIPLES) */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('theology-nuance')}
            className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition"
          >
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100">2. Theological Nuance: Scripture, Lust & Masturbation</h3>
                <p className="text-xs text-slate-400">Distinguishing explicit commands from broader biblical principles.</p>
              </div>
            </div>
            {openSection === 'theology-nuance' ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'theology-nuance' && (
            <div className="p-6 pt-0 border-t border-slate-800 text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-200">
                <strong>Important Biblical Distinction:</strong> The Bible does not explicitly mention "masturbation" by name. The story of Onan (Genesis 38:8-10) is about refusing his levirate family duty, not solo sexual release. We must never falsely claim a verse says what it does not explicitly say.
              </div>

              <h4 className="font-bold text-slate-100 text-sm">
                How Biblical Principles Evaluate the Issue:
              </h4>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-amber-300 mb-1">1. Inextricably Linked with Lust</h5>
                  <p className="text-slate-400">
                    Matthew 5:28 condemns looking with lustful intent as adultery of the heart. For those battling pornography and sexual fantasy, masturbation rarely happens in a vacuum; it almost universally depends on internal or digital fantasy. If the act requires lust to function, it is sin.
                  </p>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-amber-300 mb-1">2. Sin Against One's Own Body (1 Corinthians 6:18-20)</h5>
                  <p className="text-slate-400">
                    Sex was designed as a relational covenant uniting two persons. Masturbation turns sexuality inward—sex with yourself, for yourself. It trains neural pathways in self-gratification rather than Christlike, other-centered love.
                  </p>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-amber-300 mb-1">3. The Call to Self-Control (1 Thessalonians 4:3-5)</h5>
                  <p className="text-slate-400">
                    God calls every believer to "control his own body in holiness and honor, not in the passion of lust." Surrendering bodily control to impulsive physical cravings violates the discipline of sanctification.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODULE 3: ANATOMY OF SIN & NEUROPLASTICITY */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('anatomy')}
            className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition"
          >
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100">3. The Anatomy of Sin & Neuroplasticity</h3>
                <p className="text-xs text-slate-400">How temptation conceives in James 1:13-15 and the neurological habit loop.</p>
              </div>
            </div>
            {openSection === 'anatomy' ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'anatomy' && (
            <div className="p-6 pt-0 border-t border-slate-800 text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
              <p>
                James 1:13-15 outlines the exact progression:
              </p>
              <ol className="space-y-2 list-decimal list-inside bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
                <li><strong>External Stimulus:</strong> An image or intrusive thought appears. (This is temptation, not sin; Jesus was tempted yet without sin).</li>
                <li><strong>Enticement (Epithymia):</strong> The external bait hooks an internal craving. This is where the battle is won or lost.</li>
                <li><strong>Conception:</strong> The fantasy is entertained and welcomed in the mind.</li>
                <li><strong>Birth of Sin:</strong> The physical click or act is committed.</li>
                <li><strong>Growth of Sin:</strong> Repetition builds a habit, pattern, and spiritual bondage.</li>
              </ol>

              <h4 className="font-bold text-slate-100 text-sm pt-2">The Neurochemical Reality</h4>
              <p>
                Repeated sexual consumption releases massive surges of dopamine, creating rigid neural pathways that link boredom, fatigue, or late-night scrolling to sexual arousal.
              </p>
              <p className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-amber-300 italic">
                "Do not be conformed to this world, but be transformed by the renewal of your mind." (Romans 12:2). Just as the brain learned destructive pathways, the Holy Spirit and Scripture meditation literally rebuild pathways of purity.
              </p>
            </div>
          )}
        </div>

        {/* MODULE 4: BREAKING THE GUILT-SHAME-FAILURE CYCLE */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('shame-cycle')}
            className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100">4. Breaking the Cycle of Guilt, Vows, and Despair</h3>
                <p className="text-xs text-slate-400">Why willpower alone fails and how Christ's deliverance works.</p>
              </div>
            </div>
            {openSection === 'shame-cycle' ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'shame-cycle' && (
            <div className="p-6 pt-0 border-t border-slate-800 text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
              <p>
                In Romans 7:15–24, the Apostle Paul describes the futility of human resolutions: <em>"For I do not do what I want, but I do the very thing I hate... Wretched man that I am! Who will deliver me?"</em>
              </p>
              <p>
                The trap is the <strong>Guilt-Vow-Failure-Despair cycle:</strong>
              </p>
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>1. Sin occurs → Remorse and self-loathing flood in ("How could I? I'm disgusting").</p>
                <p>2. Emotional Vow → "I swear I will never do this again!" (Relying on white-knuckled pride).</p>
                <p>3. Vulnerability → Stress or loneliness returns, willpower drains, and relapse happens.</p>
                <p>4. Despair → "I can't change. I'm a fake."</p>
              </div>
              <p>
                <strong>The Biblical Answer:</strong> The answer is not more willpower; it is a Deliverer: <em>"Thanks be to God through Jesus Christ our Lord!"</em> (Romans 7:25). Stop making desperate vows in your own power. Surrender to Christ every single morning.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
