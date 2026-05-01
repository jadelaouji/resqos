import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Heart, Activity, Thermometer, Wind, Satellite, Shield, Zap, MapPin,
  AlertTriangle, ChevronDown, ArrowRight, Cpu, Radio, Globe, Users,
  Check, X, Play, Wifi, Battery, Signal
} from "lucide-react";
import teamImg from "./assets/team.png";
import envImg from "./assets/environmental.png";
import wearImg from "./assets/wearable.png";

// ── Utility ──────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } },
});

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, delay } },
});

function useSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return { ref, inView };
}

// ── Shared Components ─────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <motion.span
      variants={fadeIn(0)}
      className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-red-600 border border-red-300 bg-red-50 px-3 py-1 rounded-full mb-4"
    >
      {children}
    </motion.span>
  );
}

function VideoPlaceholder({ label, className = "" }) {
  return (
    <div className={`relative bg-[#EDE9E2] border border-[#DDD9D0] rounded-2xl overflow-hidden flex items-center justify-center group cursor-pointer ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-red-200/20 to-transparent" />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(0,0,0,0.05) 40px,rgba(0,0,0,0.05) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(0,0,0,0.05) 40px,rgba(0,0,0,0.05) 41px)" }} />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full border border-red-500/50 flex items-center justify-center group-hover:border-red-500 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]">
          <Play className="w-5 h-5 text-red-400 ml-1" />
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#6B6760] group-hover:text-[#1A1916] transition-colors">{label}</span>
      </div>
    </div>
  );
}

function HeroVideo({ videoId, className = "" }) {
  return (
    <div className={`relative bg-[#EDE9E2] border border-[#DDD9D0] rounded-2xl overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-red-200/20 to-transparent pointer-events-none z-10" />
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`}
        title="Intro Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function YouTubeEmbed({ videoId, label = "", className = "" }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`relative bg-[#EDE9E2] border border-[#DDD9D0] rounded-2xl overflow-hidden group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-red-200/20 to-transparent pointer-events-none z-10" />
      {playing ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={label}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={label}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <button
              onClick={() => setPlaying(true)}
              className="w-16 h-16 rounded-full border border-red-500/70 flex items-center justify-center group-hover:border-red-500 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] bg-white/70 backdrop-blur-sm"
            >
              <Play className="w-6 h-6 text-red-400 ml-1" />
            </button>
            {label && (
              <span className="mt-3 text-xs font-semibold tracking-widest uppercase text-[#6B6760] group-hover:text-[#1A1916] transition-colors">{label}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ImagePlaceholder({ label, className = "" }) {
  return (
    <div className={`relative bg-[#EDE9E2] border border-[#DDD9D0] rounded-xl overflow-hidden flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#E5E1D8] to-[#EDE9E2]" />
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "repeating-linear-gradient(45deg,rgba(0,0,0,0.1) 0,rgba(0,0,0,0.1) 1px,transparent 0,transparent 50%)", backgroundSize: "10px 10px" }} />
      <span className="relative z-10 text-xs font-semibold tracking-widest uppercase text-[#9A968E] px-4 text-center">{label}</span>
    </div>
  );
}

function GlowDot({ className = "" }) {
  return <div className={`w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)] ${className}`} />;
}

// ── Section 1: Hero ───────────────────────────────────────────────────────────
function HeroSection() {
  const vitals = [
    { icon: Heart, label: "HR", value: "128", unit: "bpm", color: "text-red-400", glow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]", delay: 0 },
    { icon: Activity, label: "SpO₂", value: "91", unit: "%", color: "text-orange-400", glow: "shadow-[0_0_12px_rgba(251,146,60,0.4)]", delay: 0.15 },
    { icon: Thermometer, label: "Body Temp", value: "39.2", unit: "°C", color: "text-yellow-400", glow: "shadow-[0_0_12px_rgba(250,204,21,0.3)]", delay: 0.3 },
    { icon: Wind, label: "Ambient O₂", value: "LOW", unit: "", color: "text-red-500", glow: "shadow-[0_0_12px_rgba(239,68,68,0.5)]", delay: 0.45, alert: true },
    { icon: Satellite, label: "SOS", value: "READY", unit: "", color: "text-emerald-400", glow: "shadow-[0_0_12px_rgba(52,211,153,0.4)]", delay: 0.6 },
  ];

  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#FEF9F4] via-[#FBF6EF] to-[#F5EFE6]">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-red-400/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-300/15 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(0,0,0,0.04) 80px,rgba(0,0,0,0.04) 81px),repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(0,0,0,0.04) 80px,rgba(0,0,0,0.04) 81px)" }} />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto w-full px-6 lg:px-16 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <motion.div initial="hidden" animate="visible" variants={fadeIn(0)}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-red-500 mb-8">
                <GlowDot className={pulse ? "opacity-100" : "opacity-40"} />
                Live Monitoring Active
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(5rem,12vw,10rem)] font-black leading-none tracking-tighter text-[#0D0C0A] mb-4"
              style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif", letterSpacing: "-0.02em" }}
            >
              Res<span className="text-red-500">Qos</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg lg:text-xl text-[#6B6760] font-light tracking-wide mb-2"
            >
              Autonomous Emergency Detection for Remote Environments
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-2xl lg:text-3xl font-semibold text-[#1A1916] mb-10 leading-tight"
            >
              When Every Second Matters,<br />
              <span className="text-red-400">We Act.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-[0_8px_24px_rgba(220,38,38,0.35)] text-sm tracking-wide">
                See How It Works
              </button>
              <button
                onClick={() => document.getElementById("diagnostics")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 border border-[#C8C3BB] hover:border-[#8A8680] text-[#1A1916] font-semibold rounded-full transition-all duration-300 hover:bg-white/60 text-sm tracking-wide">
                View Diagnostics
              </button>
            </motion.div>

            {/* Vitals cards */}
            <div className="mt-12 flex flex-wrap gap-3">
              {vitals.map((v, i) => (
                <motion.div
                  key={v.label}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + v.delay, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative bg-white border border-[#EAE6DF] rounded-xl px-4 py-3 shadow-sm ${v.alert ? "border-red-300 bg-red-50/50" : ""}`}
                >
                  {v.alert && (
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"
                    />
                  )}
                  <v.icon className={`w-3.5 h-3.5 ${v.color} mb-1`} />
                  <div className={`text-lg font-black ${v.color} leading-none`}>{v.value}<span className="text-xs ml-0.5">{v.unit}</span></div>
                  <div className="text-[10px] text-[#A09C96] font-semibold tracking-wider uppercase mt-0.5">{v.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Video + Device Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <HeroVideo videoId="3n1w-VYtgFQ" className="w-full h-[420px] lg:h-[520px]" />
            {/* Device mockup overlay */}
            <div className="absolute -bottom-8 -left-8 w-36 h-48 bg-white border border-[#E0DBD3] rounded-2xl shadow-xl overflow-hidden">
              <div className="h-full flex flex-col items-center justify-center gap-2 p-3">
                <div className="w-10 h-10 rounded-full border-2 border-red-500/60 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#A09C96]">Wearable</span>
                <div className="w-full h-px bg-[#EAE6DF]" />
                <div className="text-[#444240] text-[10px] font-mono">128 bpm</div>
                <div className="text-[#444240] text-[10px] font-mono">91% SpO₂</div>
                <div className="w-8 h-1.5 rounded-full bg-red-500/60 animate-pulse" />
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-40 bg-white border border-[#E0DBD3] rounded-2xl shadow-xl overflow-hidden">
              <div className="h-full flex flex-col items-center justify-center gap-2 p-3">
                <div className="w-10 h-10 rounded-full border-2 border-blue-500/40 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#A09C96]">Satellite</span>
                <div className="w-full h-px bg-[#EAE6DF]" />
                <div className="text-emerald-400 text-[10px] font-mono">Connected</div>
                <div className="text-[#6B6760] text-[10px] font-mono">GPS: Active</div>
                <div className="w-8 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#B0ACA4]">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="w-4 h-4 text-[#B0ACA4]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── Section 2: Problem ────────────────────────────────────────────────────────
function ProblemSection() {
  const { ref, inView } = useSection();
  const stats = [
    { value: "4,000+", label: "Deaths annually from outdoor exposure", icon: AlertTriangle },
    { value: "70%", label: "Of rescue delays tied to lack of communication", icon: Radio },
    { value: "45%", label: "Reduction in survival probability after delayed response", icon: Activity },
    { value: "250K+", label: "Emergency incidents yearly in remote environments", icon: Shield },
  ];

  return (
    <section id="problem" className="relative py-32 bg-white" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5F0]/80 via-transparent to-transparent" />
      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)} className="mb-4">
          <SectionLabel>The Problem</SectionLabel>
        </motion.div>
        <motion.h2
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1)}
          className="text-5xl lg:text-7xl font-black text-[#0D0C0A] mb-6 tracking-tighter"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          The Silent <span className="text-red-500">Danger</span>
        </motion.h2>
        <motion.p
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.2)}
          className="text-lg text-[#6B6760] max-w-2xl mb-20 leading-relaxed"
        >
          Remote and high-risk environments lack reliable, continuous monitoring and communication.
          When emergencies strike, every passing second without detection or response narrows the window for survival.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.15 * i + 0.3)}
              className="relative group bg-white border border-[#EAE6DF] rounded-2xl p-8 hover:border-red-300 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(220,38,38,0.08)] shadow-sm"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <s.icon className="w-7 h-7 text-red-500/70 mb-6" />
              <div className="text-5xl lg:text-6xl font-black text-[#0D0C0A] mb-3 tracking-tighter" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {s.value}
              </div>
              <p className="text-sm text-[#6B6760] leading-relaxed">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Solution ───────────────────────────────────────────────────────
function SolutionSection() {
  const { ref, inView } = useSection();

  return (
    <section id="solution" className="relative py-32 bg-[#F7F5F0]" ref={ref}>
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-300/10 blur-[150px] rounded-full" />
      </div>
      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)} className="mb-4">
          <SectionLabel>The Solution</SectionLabel>
        </motion.div>
        <motion.h2
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1)}
          className="text-5xl lg:text-7xl font-black text-[#0D0C0A] mb-20 tracking-tighter"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Dual-Device <span className="text-red-500">Intelligence</span>
        </motion.h2>

        <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-8 items-center">
          {/* Wearable */}
          <motion.div
            initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.2)}
            className="relative bg-white border border-[#EAE6DF] rounded-3xl p-10 hover:border-red-300 transition-all duration-500 group shadow-sm hover:shadow-lg"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#0D0C0A] mb-4">Wearable Unit</h3>
              <p className="text-[#6B6760] text-sm mb-8 leading-relaxed">Continuously monitors the wearer's physiological state, triggering local alerts and communicating with the environmental unit.</p>
              <div className="space-y-3">
                {["Heart Rate (MAX30102)", "SpO₂ Pulse Oximetry", "Body Temperature (MCP9808)", "Fall & Motion Detection (LIS3DH)", "Dehydration Indicators"].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-sm text-[#5C5856]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* BLE connector */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col items-center gap-3 px-4"
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-px h-16 lg:h-24 bg-gradient-to-b from-transparent via-blue-400 to-transparent lg:w-24 lg:h-px lg:bg-gradient-to-r"
            />
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(96,165,250,0.3)]">
                <Wifi className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">BLE</span>
            </div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
              className="w-px h-16 lg:h-24 bg-gradient-to-b from-transparent via-blue-400 to-transparent lg:w-24 lg:h-px lg:bg-gradient-to-r"
            />
          </motion.div>

          {/* Environmental */}
          <motion.div
            initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.3)}
            className="relative bg-white border border-[#EAE6DF] rounded-3xl p-10 hover:border-blue-300 transition-all duration-500 group shadow-sm hover:shadow-lg"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#0D0C0A] mb-4">Environmental Unit</h3>
              <p className="text-[#6B6760] text-sm mb-8 leading-relaxed">Scans the surrounding environment for atmospheric hazards and manages satellite communication for emergency dispatch.</p>
              <div className="space-y-3">
                {["Temperature & Humidity (BME688)", "Gas & CO Detection (MQ-7)", "Ambient Oxygen (ME2-O2)", "GPS Location Tracking", "Iridium Satellite (RockBLOCK 9704)"].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <span className="text-sm text-[#5C5856]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Section 4: System Flow ────────────────────────────────────────────────────
function SystemFlowSection() {
  const { ref, inView } = useSection();
  const steps = [
    { icon: Heart, label: "Wearable Unit", sub: "Physiological Sensing", color: "red" },
    { icon: Globe, label: "Environmental Unit", sub: "Atmospheric + GPS", color: "blue" },
    { icon: Cpu, label: "Diagnostic Logic", sub: "AI-based Classification", color: "purple" },
    { icon: Satellite, label: "Satellite Uplink", sub: "Iridium Network", color: "yellow" },
    { icon: Shield, label: "First Responders", sub: "Diagnosis + Location", color: "green" },
  ];

  const colorMap = {
    red: { bg: "bg-red-500/10", border: "border-red-500/30", icon: "text-red-400", glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]", dot: "bg-red-500" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", icon: "text-blue-400", glow: "shadow-[0_0_20px_rgba(96,165,250,0.3)]", dot: "bg-blue-400" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", icon: "text-purple-400", glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]", dot: "bg-purple-400" },
    yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: "text-yellow-400", glow: "shadow-[0_0_20px_rgba(250,204,21,0.3)]", dot: "bg-yellow-400" },
    green: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(52,211,153,0.3)]", dot: "bg-emerald-400" },
  };

  return (
    <section className="relative py-32 bg-white" ref={ref}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)} className="mb-4">
          <SectionLabel>System Flow</SectionLabel>
        </motion.div>
        <motion.h2
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1)}
          className="text-5xl lg:text-7xl font-black text-[#0D0C0A] mb-20 tracking-tighter"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          From Sensor to <span className="text-red-500">Responder</span>
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-0">
          {steps.map((step, i) => {
            const c = colorMap[step.color];
            return (
              <div key={step.label} className="flex flex-col lg:flex-row items-center gap-4 lg:gap-0 w-full lg:w-auto lg:flex-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 + 0.2 }}
                  className={`relative flex-shrink-0 flex flex-col items-center gap-4 p-6 rounded-2xl border ${c.bg} ${c.border} ${c.glow} w-full lg:w-40 text-center`}
                >
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                    className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}
                  >
                    <step.icon className={`w-6 h-6 ${c.icon}`} />
                  </motion.div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1916] leading-tight">{step.label}</div>
                    <div className={`text-[10px] ${c.icon} mt-1 font-medium`}>{step.sub}</div>
                  </div>
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${c.dot}`} />
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.15 + 0.5 }}
                    className="hidden lg:flex items-center flex-1 px-2 origin-left"
                  >
                    <div className="flex-1 h-px bg-gradient-to-r from-[#D5D1CB] to-[#EAE6DF]" />
                    <motion.div animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <ArrowRight className="w-4 h-4 text-[#C0BCB4] flex-shrink-0" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Section 5: Diagnostics ────────────────────────────────────────────────────
function DiagnosticsSection() {
  const { ref, inView } = useSection();
  const [active, setActive] = useState(0);
  const diagnostics = [
    {
      title: "Fall Detection",
      icon: AlertTriangle,
      color: "orange",
      trigger: "Sudden acceleration + impact + prolonged inactivity",
      sensors: "LIS3DH Accelerometer",
      video: "FALL DETECTION VIDEO",
      videoId: "5Q5fcITdFUk",
      desc: "Detects sudden falls via 3-axis acceleration thresholds and confirms emergency via extended inactivity timeout.",
    },
    {
      title: "Heat Stroke",
      icon: Thermometer,
      color: "red",
      trigger: "Critical environmental temp + body temp + elevated heart rate",
      sensors: "BME688, MCP9808, MAX30102",
      video: "HEAT STROKE VIDEO",
      videoId: "C9qgKHtRHnE",
      desc: "Multi-sensor fusion combining ambient heat, skin temperature, and cardiac stress markers.",
    },
    {
      title: "Hypoxia",
      icon: Activity,
      color: "blue",
      trigger: "Low SpO₂ + high heart rate or critical ambient O₂",
      sensors: "MAX30102, ME2-O2",
      video: "HYPOXIA VIDEO",
      videoId: "x07q6mg-Tes",
      desc: "Cross-references blood oxygen saturation with atmospheric oxygen levels to differentiate physiological from environmental cause.",
    },
    {
      title: "Hypothermia",
      icon: Wind,
      color: "cyan",
      trigger: "Body temperature at warning or critical threshold",
      sensors: "MCP9808 Temperature Sensor",
      video: "HYPOTHERMIA VIDEO",
      videoId: "eBb7Oszxw6k",
      desc: "Continuous core temperature monitoring with configurable warning and critical alert thresholds.",
    },
  ];

  const colorMap = {
    orange: { accent: "text-orange-400", border: "border-orange-500/40", bg: "bg-orange-500/10", glow: "shadow-[0_0_30px_rgba(251,146,60,0.2)]" },
    red: { accent: "text-red-400", border: "border-red-500/40", bg: "bg-red-500/10", glow: "shadow-[0_0_30px_rgba(239,68,68,0.2)]" },
    blue: { accent: "text-blue-400", border: "border-blue-500/40", bg: "bg-blue-500/10", glow: "shadow-[0_0_30px_rgba(96,165,250,0.2)]" },
    cyan: { accent: "text-cyan-400", border: "border-cyan-500/40", bg: "bg-cyan-500/10", glow: "shadow-[0_0_30px_rgba(34,211,238,0.2)]" },
  };

  const d = diagnostics[active];
  const c = colorMap[d.color];

  return (
    <section id="diagnostics" className="relative py-32 bg-[#F7F5F0]" ref={ref}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)} className="mb-4">
          <SectionLabel>Emergency Diagnostics</SectionLabel>
        </motion.div>
        <motion.h2
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1)}
          className="text-5xl lg:text-7xl font-black text-[#0D0C0A] mb-16 tracking-tighter"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Four Critical <span className="text-red-500">Scenarios</span>
        </motion.h2>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {diagnostics.map((diag, i) => {
            const tc = colorMap[diag.color];
            return (
              <button
                key={diag.title}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${active === i ? `${tc.bg} ${tc.border} ${tc.accent} ${tc.glow}` : "bg-white border-[#DDD9D0] text-[#8A8680] hover:text-[#1A1916] hover:border-[#A09C96]"}`}
              >
                <diag.icon className="w-4 h-4" />
                {diag.title}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className={`grid lg:grid-cols-2 gap-8 p-8 lg:p-12 rounded-3xl border ${c.border} ${c.bg} ${c.glow}`}
          >
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                    <d.icon className={`w-6 h-6 ${c.accent}`} />
                  </div>
                  <h3 className={`text-3xl font-black ${c.accent}`}>{d.title}</h3>
                </div>
                <p className="text-[#5C5856] text-base leading-relaxed mb-8">{d.desc}</p>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#A09C96] mb-2 font-semibold">Trigger Condition</div>
                    <div className={`text-sm font-medium ${c.accent} border ${c.border} ${c.bg} px-4 py-3 rounded-xl`}>{d.trigger}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#A09C96] mb-2 font-semibold">Sensors Involved</div>
                    <div className="text-sm text-[#5C5856] border border-[#EAE6DF] bg-[#F7F5F0] px-4 py-3 rounded-xl font-mono">{d.sensors}</div>
                  </div>
                </div>
              </div>
            </div>
            <YouTubeEmbed videoId={d.videoId} label={d.video} className="h-72 lg:h-auto" />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Section 6: Full System Demo ───────────────────────────────────────────────
function DemoSection() {
  const { ref, inView } = useSection();
  const steps = ["Detect", "Warn User", "Wait for Response", "Escalate", "Satellite SOS Sent"];

  return (
    <section id="demo" className="relative py-32 bg-white" ref={ref}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)} className="mb-4">
          <SectionLabel>System Demo</SectionLabel>
        </motion.div>
        <motion.h2
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1)}
          className="text-5xl lg:text-7xl font-black text-[#0D0C0A] mb-6 tracking-tighter"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          See It in <span className="text-red-500">Action</span>
        </motion.h2>

        {/* Step sequence */}
        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.2)}
          className="flex flex-wrap gap-3 mb-12"
        >
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex items-center gap-2 bg-white border border-[#EAE6DF] rounded-full px-4 py-2 shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-[10px] text-red-400 font-bold flex-shrink-0">{i + 1}</span>
                <span className="text-sm text-[#3A3835] font-medium whitespace-nowrap">{s}</span>
              </motion.div>
              {i < steps.length - 1 && <ArrowRight className="w-3 h-3 text-[#C0BCB4] flex-shrink-0" /> />}
            </div>
          ))}
        </motion.div>

        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.3)}>
          <YouTubeEmbed videoId="sURDEXkx6Qg" label="FULL SYSTEM DEMO VIDEO" className="w-full h-[400px] lg:h-[560px]" />
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 7: Satellite ──────────────────────────────────────────────────────
function SatelliteSection() {
  const { ref, inView } = useSection();
  const flow = ["nRF52840", "RockBLOCK 9704", "Iridium Satellite", "Ground Station", "Phone"];
  const icons = [Cpu, Radio, Satellite, Signal, Activity];

  const highlights = [
    { icon: Globe, label: "Global Off-Grid Coverage", desc: "Works anywhere on Earth, no cellular required" },
    { icon: MapPin, label: "GPS Location Transmission", desc: "Precise coordinates sent with every SOS" },
    { icon: Zap, label: "Under 20s Transmission", desc: "50% of messages delivered within 20 seconds" },
    { icon: Shield, label: "Probable Diagnosis Included", desc: "Responders arrive informed, not blind" },
  ];

  return (
    <section className="relative py-32 bg-[#F7F5F0] overflow-hidden" ref={ref}>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-300/10 blur-[150px] rounded-full" />
      </div>
      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)} className="mb-4">
          <SectionLabel>Satellite Communication</SectionLabel>
        </motion.div>
        <motion.h2
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1)}
          className="text-5xl lg:text-7xl font-black text-[#0D0C0A] mb-20 tracking-tighter"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Global <span className="text-red-500">Reach</span>
        </motion.h2>

        {/* Transmission flow */}
        <div className="flex flex-wrap items-center gap-3 mb-20 justify-center lg:justify-start">
          {flow.map((node, i) => {
            const Icon = icons[i];
            return (
              <div key={node} className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.12 + 0.3 }}
                  className="flex flex-col items-center gap-2 bg-white border border-[#EAE6DF] rounded-2xl px-5 py-4 text-center min-w-[90px] shadow-sm"
                >
                  <Icon className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-[#5C5856] font-semibold">{node}</span>
                </motion.div>
                {i < flow.length - 1 && (
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4 text-[#C0BCB4]" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1 * i + 0.3)}
              className="bg-white border border-[#EAE6DF] rounded-2xl p-6 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <h.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-sm font-bold text-[#0D0C0A] mb-2">{h.label}</div>
              <div className="text-xs text-[#6B6760] leading-relaxed">{h.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 8: Dual Sensing System ──────────────────────────────────────────
function HardwareSection() {
  const { ref, inView } = useSection();

  return (
    <section id="hardware" className="relative py-32 bg-white" ref={ref}>
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-rose-300/8 blur-[160px] rounded-full" />
      </div>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)} className="mb-4">
          <SectionLabel>Hardware</SectionLabel>
        </motion.div>
        <motion.h2
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1)}
          className="text-5xl lg:text-7xl font-black text-[#0D0C0A] mb-6 tracking-tighter"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Dual <span className="text-red-500">Sensing</span> System
        </motion.h2>
        <motion.p
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.15)}
          className="text-lg text-[#6B6760] max-w-2xl mb-20 leading-relaxed"
        >
          Two purpose-built devices working in tandem — one worn on the body, one deployed in the field — 
          to deliver complete physiological and environmental awareness.
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Environmental Unit */}
          <motion.div
            initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.2)}
            className="group relative bg-white border border-[#EAE6DF] rounded-3xl overflow-hidden hover:border-red-300 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(220,38,38,0.08)] shadow-sm"
          >
            <div className="relative h-72 overflow-hidden">
              <img
                src={envImg}
                alt="Environmental Unit"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase bg-white/90 backdrop-blur-sm border border-[#E0DBD3] text-blue-600 px-3 py-1.5 rounded-full shadow-sm">
                  <Globe className="w-3 h-3" /> Environmental Unit
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-[#0D0C0A] mb-3">Field Station</h3>
              <p className="text-[#6B6760] text-sm mb-6 leading-relaxed">
                A ruggedized 3D-printed enclosure housing the Iridium 9704 satellite modem alongside atmospheric sensors. 
                Deployed in the field to scan ambient conditions and relay emergency data globally.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["BME688 (Temp/Humidity)", "ME2-O2 (Ambient O₂)", "MQ-7 (CO Detection)", "GPS Module", "RockBLOCK 9704", "nRF52840 MCU"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <span className="text-xs text-[#5C5856] font-mono">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Wearable Unit */}
          <motion.div
            initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.3)}
            className="group relative bg-white border border-[#EAE6DF] rounded-3xl overflow-hidden hover:border-red-300 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(220,38,38,0.08)] shadow-sm"
          >
            <div className="relative h-72 overflow-hidden">
              <img
                src={wearImg}
                alt="Wearable Unit"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase bg-white/90 backdrop-blur-sm border border-[#E0DBD3] text-red-600 px-3 py-1.5 rounded-full shadow-sm">
                  <Heart className="w-3 h-3" /> Wearable Unit
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-[#0D0C0A] mb-3">Wrist-Worn Monitor</h3>
              <p className="text-[#6B6760] text-sm mb-6 leading-relaxed">
                A custom PCB encased in a 3D-printed wrist form factor. Continuously tracks the wearer's 
                biometrics and transmits alerts to the environmental unit via BLE.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["MAX30102 (HR/SpO₂)", "MCP9808 (Body Temp)", "LIS3DH (Accelerometer)", "OLED Display", "BLE Radio", "nRF52840 MCU"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-xs text-[#5C5856] font-mono">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Section 9: Comparison ─────────────────────────────────────────────────────
function ComparisonSection() {
  const { ref, inView } = useSection();
  const rows = [
    { name: "Garmin InReach", features: [true, true, false, false, false, false] },
    { name: "Garmin Instinct 2S Solar", features: [true, false, false, true, false, false] },
    { name: "ResQLink PLB", features: [true, true, false, false, true, false] },
    { name: "ResQos", features: [true, true, true, true, true, true], highlight: true },
  ];
  const cols = ["GPS + Location", "Satellite Connection", "Environmental Data", "Biometric Tracking", "Autonomous SOS", "Diagnosis"];

  return (
    <section className="relative py-32 bg-[#F7F5F0]" ref={ref}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)} className="mb-4">
          <SectionLabel>Competitive Comparison</SectionLabel>
        </motion.div>
        <motion.h2
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1)}
          className="text-5xl lg:text-7xl font-black text-[#0D0C0A] mb-20 tracking-tighter"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Why <span className="text-red-500">ResQos</span>
        </motion.h2>

        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.2)}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="text-left py-4 pr-6 text-[#8A8680] text-xs uppercase tracking-widest font-semibold w-48">Device</th>
                {cols.map(col => (
                  <th key={col} className="text-center py-4 px-3 text-[#8A8680] text-xs uppercase tracking-widest font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: ri * 0.1 + 0.4 }}
                  className={`border-t transition-all duration-300 ${row.highlight
                    ? "border-red-200 bg-red-50 shadow-[0_4px_24px_rgba(220,38,38,0.08)]"
                    : "border-[#EAE6DF] hover:bg-[#F7F5F0]"
                    }`}
                >
                  <td className="py-5 pr-6">
                    <div className={`font-semibold text-sm ${row.highlight ? "text-red-600" : "text-[#6B6760]"}`}>
                      {row.name}
                      {row.highlight && <span className="ml-2 text-[10px] bg-red-500/20 border border-red-500/40 text-red-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Our Solution</span>}
                    </div>
                  </td>
                  {row.features.map((has, fi) => (
                    <td key={fi} className="text-center py-5 px-3">
                      {has
                        ? <Check className={`w-5 h-5 mx-auto ${row.highlight ? "text-red-500" : "text-emerald-500"}`} />
                        : <X className="w-4 h-4 mx-auto text-[#D5D1CB]" />
                      }
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 10: Team / Footer ─────────────────────────────────────────────────
function FooterSection() {
  const { ref, inView } = useSection();

  return (
    <footer id="team" className="relative py-32 bg-white overflow-hidden" ref={ref}>
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-200/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-16">
        {/* Team image */}
        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)}
          className="mb-20"
        >
          <img src={teamImg} alt="ResQos Team" className="w-full rounded-2xl" />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1)}
          className="text-center mb-20"
        >
          <p className="text-2xl lg:text-4xl text-[#5C5856] max-w-3xl mx-auto leading-relaxed italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
            "Built for the moments when no signal,<br />
            <span className="text-[#0D0C0A] font-semibold not-italic">no help, and no time remain.</span>"
          </p>
        </motion.div>

        {/* Team info */}
        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.2)}
          className="grid lg:grid-cols-3 gap-8 border-t border-[#EAE6DF] pt-12"
        >
          <div>
            <div className="text-3xl font-black text-[#0D0C0A] mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Res<span className="text-red-500">Qos</span>
            </div>
            <div className="text-sm text-[#8A8680]">Autonomous Emergency Detection System</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold text-[#1A1916]">Team 14</div>
            <div className="text-sm text-[#6B6760]">University of Massachusetts Amherst</div>
            <div className="text-sm text-[#6B6760]">ECE 415 / ECE 416 · Senior Design 2026</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-[#A09C96] font-semibold mb-3">Faculty Advisor</div>
            <div className="text-sm text-[#0D0C0A] font-semibold">Prof. Nikhil Saxena</div>
            <div className="text-sm text-[#6B6760]">Department of Electrical & Computer Engineering</div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.3)}
          className="mt-12 pt-6 border-t border-[#EAE6DF] flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="text-xs text-[#A09C96]">© 2026 ResQos · UMass Amherst ECE Senior Design</div>
          <div className="flex items-center gap-2">
            <GlowDot />
            <span className="text-xs text-[#8A8680] font-mono">SYSTEM ONLINE</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const unsubscribe = scrollY.on("change", v => setScrolled(v > 60));
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-[#E8E4DC] shadow-sm" : ""}`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
        <div className="text-xl font-black text-[#111110]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Res<span className="text-red-500">Qos</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-[#8A8680]">
          {[
            { label: "Problem", id: "problem" },
            { label: "Solution", id: "solution" },
            { label: "Diagnostics", id: "diagnostics" },
            { label: "Hardware", id: "hardware" },
            { label: "Team", id: "team" },
          ].map(({ label, id }) => (
            <button
              key={label}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-[#111110] transition-colors"
            >{label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <GlowDot />
          <span className="text-[10px] text-[#B0ACA4] font-mono hidden sm:block">LIVE</span>
        </div>
      </div>
    </motion.nav>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function ResQosLandingPage() {
  return (
    <div className="bg-[#FDFBF8] text-[#111110] overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400&family=Instrument+Serif:ital@0;1&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #F7F5F0; }
        ::-webkit-scrollbar-thumb { background: #dc2626; border-radius: 2px; }
        ::selection { background: #fca5a5; color: #111; }
        body { -webkit-font-smoothing: antialiased; }
      `}</style>

      <Nav />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <SystemFlowSection />
      <DiagnosticsSection />
      <DemoSection />
      <SatelliteSection />
      <HardwareSection />
      <ComparisonSection />
      <FooterSection />
    </div>
  );
}
