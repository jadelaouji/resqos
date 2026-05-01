import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Heart, Activity, Thermometer, Wind, Satellite, Shield, Zap, MapPin,
  AlertTriangle, ChevronDown, ArrowRight, Cpu, Radio, Globe, Users,
  Check, X, Play, Wifi, Battery, Signal
} from "lucide-react";

// ── VIDEO PLAYER (NEW) ───────────────────────────────────────────────
function VideoPlayer({ videoId, className = "" }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden border border-white/10 ${className}`}>
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// ── Utility ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay } },
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

// ── HERO ────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="min-h-screen flex items-center bg-black px-6">
      <div className="grid lg:grid-cols-2 gap-10 w-full max-w-7xl mx-auto">

        {/* LEFT */}
        <div>
          <h1 className="text-6xl font-black text-white mb-4">
            Res<span className="text-red-500">Qos</span>
          </h1>
          <p className="text-white/60 mb-6">
            Autonomous Emergency Detection for Remote Environments
          </p>
        </div>

        {/* RIGHT VIDEO */}
        <VideoPlayer
          videoId="3n1w-VYtgFQ"
          className="w-full h-[400px]"
        />
      </div>
    </section>
  );
}

// ── DIAGNOSTICS ─────────────────────────────────────────────────────
function DiagnosticsSection() {
  const [active, setActive] = useState(0);

  const diagnostics = [
    {
      title: "Fall Detection",
      videoId: "5Q5fcITdFUk",
    },
    {
      title: "Heat Stroke",
      videoId: "C9qgKHtRHnE",
    },
    {
      title: "Hypoxia",
      videoId: "eBb7Oszxw6k",
    },
    {
      title: "Hypothermia",
      videoId: "eBb7Oszxw6k",
    },
  ];

  const d = diagnostics[active];

  return (
    <section className="py-20 bg-black text-white px-6">
      <h2 className="text-4xl mb-6">Diagnostics</h2>

      <div className="flex gap-4 mb-6">
        {diagnostics.map((diag, i) => (
          <button key={i} onClick={() => setActive(i)}>
            {diag.title}
          </button>
        ))}
      </div>

      <VideoPlayer videoId={d.videoId} className="h-[400px]" />
    </section>
  );
}

// ── DEMO ────────────────────────────────────────────────────────────
function DemoSection() {
  return (
    <section className="py-20 bg-zinc-900 text-white px-6">
      <h2 className="text-4xl mb-6">Full Demo</h2>

      <VideoPlayer
        videoId="3n1w-VYtgFQ"
        className="w-full h-[500px]"
      />
    </section>
  );
}

// ── ROOT ────────────────────────────────────────────────────────────
export default function ResQosLandingPage() {
  return (
    <div className="bg-black text-white">
      <HeroSection />
      <DiagnosticsSection />
      <DemoSection />
    </div>
  );
}
