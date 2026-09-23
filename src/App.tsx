import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, ChevronDown } from "lucide-react";

const INVITATION = {
  couple: {
    bride: "හංසිනි",
    groom: "චානක",
    brideFull: "හංසිනි කාංචනා",
    groomFull: "චානක රණසිංහ",
  },
  date: {
    displayNumeric: "28 . 01 . 2027",
    displayLong: "2027 ජනවාරි මස 28 වන දින",
    countdownTarget: "2027-01-28T10:15:00+05:30",
  },
  time: {
    ceremonyStart: "පෙ.ව. 10:15",
    ceremonyEnd: "ප.ව. 4:00",
    registration: "පෙ.ව. 11:30",
    welcome: "පෙ.ව. 8:00",
  },
  venue: {
    name: "Rongfa Regency (Kings Court)",
    city: "Ganemulla",
    mapQuery: "Rongfa Regency, Ganemulla",
    googleMapsLink: "https://maps.app.goo.gl/wfDNdBa7SC1GDEWdA?g_st=ac",
  },
  rsvpContacts: [
    "Chanaka - +94 77 123 4567",
    "Hansini - +94 77 123 4567",
  ],
} as const;

const backgroundMusic = "/ssstik.io_1790155724397.mp3";
const googleScriptUrl =
  "https://script.google.com/macros/s/AKfycbx6tVTRxM0Fjc10fR0a35PjSjb9JJN-9F7zDpxyJvVMhdZ3A-_rOkAV8x8Cwpeqfp5NLw/exec";

const publicImagePath = (fileName: string) => `/images/${fileName.replaceAll(" ", "%20")}`;
const preImagePath = (fileName: string) => `/pre/${fileName.replaceAll(" ", "%20")}`;

const PRE_IMAGES = [
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.13.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.34 (1).jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.34.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.35.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.20.09.jpeg"),
];

const HERO_BACKGROUND_IMAGE = PRE_IMAGES[4];

function FloatingPetals() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [petals, setPetals] = useState<
    Array<{
      id: number;
      x: number;
      size: number;
      rotation: number;
      duration: number;
      delay: number;
      color: string;
      drift: number;
    }>
  >([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#d4af37", "#f2df96", "#8f7322", "#b5932f", "#fdf8e6"];
    const petalCount = isMobile ? 10 : 18;

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 7 + 7,
      rotation: Math.random() * 360,
      duration: Math.random() * 11 + 16,
      delay: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 24 - 12,
    }));

    setPetals(newPetals);
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-40 ${isLowPowerMode ? "opacity-70" : ""}`}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_2px_10px_rgba(110,87,20,0.3)]"
          style={{ color: petal.color }}
          initial={{
            x: `${petal.x}vw`,
            y: "-10vh",
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotate: petal.rotation + (isLowPowerMode ? 360 : 720),
            opacity: [0, 0.9, 0.8, 0],
          }}
          transition={{
            duration: isLowPowerMode ? petal.duration * 1.2 : petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12,2 10,6 10,10C10,14 12,22 12,22C12,22 14,14 14,10C14,6 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CountdownTimer({ isDark = false }: { isDark?: boolean }) {
  const targetDate = new Date(INVITATION.date.countdownTarget).getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: "දින", value: days },
    { label: "පැය", value: hours },
    { label: "මිනිත්තු", value: minutes },
    { label: "තත්පර", value: seconds },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-8 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative group"
        >
          <div
            className={`relative w-[4.5rem] h-[6.5rem] sm:w-20 sm:h-28 md:w-32 md:h-44 rounded-t-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 group-hover:-translate-y-3 ${isDark ? "bg-[#8f7322] " : "bg-white "
              }`}
          >
            <div
              className={`absolute inset-1.5 sm:inset-2 md:inset-3 ] rounded-t-full pointer-events-none ${isDark ? "" : ""
                }`}
            />

            <span
              className={`font-numeric text-2xl sm:text-3xl md:text-5xl leading-none relative z-10 drop-shadow-sm mt-3 sm:mt-4 md:mt-6 transition-transform duration-500 group-hover:scale-110 ${isDark ? "text-white" : "text-[#8f7322]"
                }`}
            >
              {Math.max(0, stat.value).toString().padStart(2, "0")}
            </span>

            <div className="w-full flex justify-center mt-2 sm:mt-3 md:mt-6 mb-1 sm:mb-2 relative z-10">
              <span
                className={`text-[5px] sm:text-[6px] md:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm whitespace-nowrap ${isDark
                  ? "bg-white/10 text-white "
                  : "bg-stone-50 text-stone-500 "
                  }`}
              >
                {stat.label}
              </span>
            </div>

            <div
              className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 rotate-45 ${isDark ? "bg-white/40" : "bg-[#d4af37]"
                }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Gallery() {
  const marqueeImages = [...PRE_IMAGES, ...PRE_IMAGES, ...PRE_IMAGES];

  return (
    <section className="relative py-14 md:py-40 bg-transparent overflow-hidden">
      <div className="w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-10 md:mb-16 px-6"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[#1b4332] font-bold tracking-[0.8em] text-sm md:text-base opacity-40 uppercase">
              Captured Moments
            </span>
            <div className="h-px w-16 bg-[#e6c555]/30" />
          </div>
          <h2 className="text-5xl md:text-8xl bg-gradient-to-r from-[#b5932f] via-[#8f7322] to-[#b5932f] bg-clip-text text-transparent italic leading-none">
            සුන්දර මතක
          </h2>
          <p className="text-[#8f7322]/70 text-sm md:text-base tracking-[0.3em] font-medium max-w-2xl mx-auto pt-2 leading-loose">
            අපගේ ආදර කතාවේ සුන්දරතම මොහොතක් ඔබ සමඟ බෙදා ගැනීමට අප සතුටින් බලා සිටිමු.
          </p>
        </motion.div>

        <div className="relative flex overflow-x-hidden w-full py-4 mask-gradient">
          <motion.div
            className="flex gap-6 md:gap-10 pr-6 md:pr-10 shrink-0"
            animate={{
              x: [0, "-33.33%"],
            }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
          >
            {marqueeImages.map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative w-[280px] h-[380px] md:w-[350px] md:h-[480px] shrink-0 overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(143,115,34,0.15)] group"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-4 rounded-[2rem] z-20 pointer-events-none group-hover:inset-6 transition-all duration-700" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingInvitation() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);
  const [isPlayingIntroVideo, setIsPlayingIntroVideo] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get("to");

  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    guests: "1",
  });

  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  const submitToGoogleSheet = async (payload: Record<string, string>) => {
    if (!googleScriptUrl) {
      throw new Error("Google Script URL tl ilid ke;");
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      body: new URLSearchParams(payload),
    });

    if (!response.ok) {
      throw new Error("b,a,Su id¾:l fkdùh");
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rsvpForm.name.trim()) {
      setRsvpStatus("error");
      return;
    }

    setRsvpStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "rsvp",
        name: rsvpForm.name.trim(),
        guests: rsvpForm.guests,
        dietaryNotes: "",
      });

      setRsvpStatus("success");
      setRsvpForm({ name: "", guests: "1" });
    } catch {
      setRsvpStatus("error");
    }
  };



  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isOpened && !isPlaying && !hasAttemptedAutoplay && audioRef.current) {
      setHasAttemptedAutoplay(true);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const playOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  window.removeEventListener("click", playOnInteraction);
                })
                .catch(() => { });
            }
          };

          window.addEventListener("click", playOnInteraction);
        });
    }
  }, [isOpened, isPlaying, hasAttemptedAutoplay]);

  useEffect(() => {
    if (introVideoRef.current && !hasStarted) {
      introVideoRef.current.play().catch((err) => {
        console.log("Intro video autoplay failed:", err);
      });
    }
  }, [hasStarted]);

  return (
    <main
      className={`dl-manel-bold h-[100dvh] w-full bg-[#fae9cb] transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden flex items-center justify-center"
        } relative scroll-smooth`}
    >
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="intro-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            className="fixed inset-0 z-[100] overflow-hidden bg-[#F5EDDC] flex items-center justify-center"
          >
            {isPlayingIntroVideo ? (
              <div className="fixed inset-0 z-[150] bg-black flex items-center justify-center overflow-hidden">
                <video
                  ref={introVideoRef}
                  playsInline
                  preload="auto"
                  autoPlay
                  className="w-full h-full object-cover z-50 absolute inset-0 opacity-80"
                  onEnded={() => {
                    setIsOpened(true);
                    if (audioRef.current && !isPlaying) {
                      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log("Audio play failed:", err));
                    }
                  }}
                  onError={(e) => { console.error("Video error:", e); setIsOpened(true); }}
                >
                  <source src="/intro_video.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 flex flex-col items-center justify-start pt-[20vh] md:pt-[25vh] z-[160] pointer-events-none text-center bg-transparent transition-all duration-1000">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center px-4 w-full"
                  >
                    <h2 className="text-5xl md:text-7xl text-[#1a1a1a] mb-6 tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                      විවාහ ආරාධනයයි
                    </h2>
                    
                    <div className="flex items-center justify-center gap-4 w-[200px] md:w-[280px] mb-8">
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#1a1a1a]/80 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                      <div className="w-2 h-2 rotate-45 bg-[#1a1a1a] drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-[#1a1a1a]/80 to-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                    </div>

                    <p className="text-3xl md:text-5xl text-[#1a1a1a] tracking-[0.2em] font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                      {INVITATION.couple.bride} සහ {INVITATION.couple.groom}
                    </p>
                  </motion.div>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="absolute inset-0 bg-center bg-cover bg-no-repeat z-[1]"
                  style={{ backgroundImage: 'url("/ChatGPT%20Image%20Sep%2023,%202026,%2002_45_34%20AM.png")' }}
                />
            
            <button
              onClick={toggleMusic}
              aria-label="Toggle music"
              title="Toggle music"
              className="absolute right-4 top-4 z-[110] grid h-11 w-11 place-items-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 active:scale-90 sm:right-6 sm:top-6"
              style={{
                background: "linear-gradient(135deg, rgb(122, 31, 26), rgb(92, 20, 15))",
                color: "rgb(232, 216, 164)",
                border: "1px solid rgba(92, 20, 15, 0.55)",
                boxShadow: "rgba(142, 116, 39, 0.6) 0px 14px 28px -14px"
              }}
            >
              <span className="relative grid place-items-center">
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music2 h-5 w-5">
                    <circle cx="8" cy="18" r="4"></circle><path d="M12 18V2l7 4"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music2 h-5 w-5">
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                    <circle cx="8" cy="18" r="4"></circle><path d="M12 18V2l7 4"></path>
                  </svg>
                )}
                <span aria-hidden="true" className="absolute inset-[-8px] rounded-full" style={{ border: "1px solid rgba(232, 216, 164, 0.55)", transform: "scale(1.06328)" }}></span>
              </span>
            </button>

            <div className="relative z-[105] flex flex-col items-center text-center">
              <span className="text-[0.66rem] md:text-sm uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-mp-body), 'Noto Sans Sinhala', sans-serif", color: "rgb(142, 116, 39)", fontWeight: 600 }}>විවාහ මංගල්‍යය</span>
              <div className="mt-5 mb-2">
                <span className="inline-flex items-center justify-center gap-2.5" aria-hidden="true" style={{ width: "140px" }}>
                  <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgb(210, 185, 122))" }}></span>
                  <span className="h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: "rgb(184, 154, 71)" }}></span>
                  <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgb(210, 185, 122), transparent)" }}></span>
                </span>
              </div>
              <p className="leading-[1.1]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500, color: "rgb(122, 31, 26)", fontSize: "clamp(2.5rem, 8vw, 4rem)" }}>{INVITATION.couple.bride} <span style={{ color: "rgb(142, 116, 39)" }}>&amp;</span> {INVITATION.couple.groom}</p>
              <p className="mt-3 text-[0.86rem] md:text-base font-bold" style={{ fontFamily: "var(--font-mp-body), 'Noto Sans Sinhala', sans-serif", color: "rgb(71, 60, 31)" }}>2027 ජනවාරි 28 වන බ්‍රහස්පතින්දා</p>
              
              <button 
                type="button" 
                onClick={() => {
                  setHasStarted(true);
                  setIsPlayingIntroVideo(true);
                  if (audioRef.current && !isPlaying) {
                    audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log("Audio play failed:", err));
                  }
                }}
                className="mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.65rem] md:text-xs uppercase tracking-[0.26em] transition-colors font-bold" 
                style={{ fontFamily: "var(--font-mp-body), 'Noto Sans Sinhala', sans-serif", background: "transparent", color: "rgb(92, 20, 15)", border: "1.5px solid rgb(122, 31, 26)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf h-3.5 w-3.5" aria-hidden="true" style={{ transform: "rotate(180deg)" }}>
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg> 
                ආරාධනය විවෘත කරන්න
              </button>
            </div>
            </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
          >
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-[#8f7322] hover:bg-emerald-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[11px] tracking-widest font-bold">වසා දමන්න</div>
              </div>
            </motion.button>

            <section className="w-full relative flex items-start justify-center overflow-hidden bg-[#F5EDDC] min-h-[100dvh] pt-6 md:pt-12 pb-12">
              <div
                className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url("/ChatGPT%20Image%20Sep%2023,%202026,%2002_48_11%20AM.png")` }}
                aria-hidden="true"
              />

              <div className="relative z-10 w-full max-w-5xl px-6 text-center flex flex-col items-center mt-0 md:mt-2">
                {/* SRI SUBA MANGALAM */}
                <h2 className="text-xl md:text-3xl text-[#7a1f1a] tracking-[0.2em] md:tracking-[0.3em] font-bold mb-1.5 md:mb-3" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                  ශ්‍රී සුභ මංගලම්
                </h2>

                {/* YOU ARE INVITED... */}
                <p className="text-[11px] md:text-sm text-[#8f7322] tracking-[0.1em] font-bold mb-2 md:mb-4" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                  විවාහ මංගල්‍යයට සාදරයෙන් ආරාධනා කරමු
                </p>

                {/* Divider */}
                <div className="flex items-center justify-center gap-3 w-[140px] md:w-[180px] mb-3 md:mb-6">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#b5932f]"></span>
                  <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#8f7322]"></span>
                  <span className="h-px flex-1 bg-gradient-to-r from-[#b5932f] to-transparent"></span>
                </div>

                {/* Names */}
                <h1 
                  className="text-4xl sm:text-6xl md:text-7xl text-[#7a1f1a] font-bold leading-none mb-4 md:mb-8 whitespace-nowrap w-full"
                  style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}
                >
                  {INVITATION.couple.bride} <span className="text-[#8f7322] font-normal mx-2">&amp;</span> {INVITATION.couple.groom}
                </h1>

                {/* Parents */}
                <div className="grid grid-cols-2 gap-2 md:gap-8 w-full max-w-2xl mb-4 md:mb-8" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                  <div className="flex flex-col items-center text-[#473c1f]">
                    <span className="font-bold text-[11px] md:text-sm mb-1 md:mb-2 text-[#7a1f1a]">ආදරණීය දියණිය</span>
                    <div className="text-[9px] md:text-xs text-[#706444] leading-relaxed flex flex-col items-center gap-0.5">
                      <span>ආර්. එම්. චන්ද්‍රපාල රාජපක්ෂ</span>
                      <span>එච්. එම්. නන්දනී ප්‍රේමලතා</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-[#473c1f]">
                    <span className="font-bold text-[11px] md:text-sm mb-1 md:mb-2 text-[#7a1f1a]">ආදරණීය පුත්‍රයා</span>
                    <div className="text-[9px] md:text-xs text-[#706444] leading-relaxed flex flex-col items-center gap-0.5">
                      <span>ආර්. ඒ. සුමිත් රණසිංහ</span>
                      <span>පී. ඒ. ඈන් තෙරේස් ප්‍රියන්තිනි</span>
                    </div>
                  </div>
                </div>

                {/* Date Large */}
                <div className="flex items-center justify-center gap-4 md:gap-8 border-y-[1.5px] border-[#7a1f1a]/20 py-2 md:py-4 mb-1.5 md:mb-4 w-[85%] max-w-[340px] relative">
                  <span className="text-[#7a1f1a] tracking-[0.1em] md:tracking-[0.15em] font-bold text-xs md:text-sm flex-1 text-right" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                    ජනවාරි
                  </span>
                  <span className="text-5xl md:text-6xl text-[#7a1f1a] font-bold leading-none mx-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    28
                  </span>
                  <span className="text-[#7a1f1a] tracking-[0.1em] md:tracking-[0.15em] font-bold text-xs md:text-sm flex-1 text-left" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                    2027
                  </span>
                </div>

                {/* Date Full */}
                <p className="text-sm md:text-lg font-bold text-[#473c1f] tracking-[0.1em] -mt-1 sm:mt-0" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                  2027 ජනවාරි 28 වන බ්‍රහස්පතින්දා
                </p>
              </div>
            </section>

            <section
              id="details"
              className="relative pt-8 md:pt-20 pb-12 md:pb-32 w-full flex flex-col items-center overflow-hidden"
              style={{
                backgroundImage: 'url("/vintage_paper.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-4 md:inset-8 ] pointer-events-none z-10" />
              <div className="absolute inset-5 md:inset-10 ] pointer-events-none z-10" />

              <div className="max-w-[1100px] w-full flex flex-col items-center text-center relative z-20 px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center mb-16 space-y-6"
                >
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="h-px w-8 bg-[#8f7322]" />
                    <Sparkles className="w-4 h-4 text-[#b5932f]" />
                    <div className="h-px w-8 bg-[#8f7322]" />
                  </div>

                  <div className="text-[#8f7322] space-y-6 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
                    <p className="text-[#473c1f] tracking-normal leading-relaxed text-sm md:text-lg" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                      ආර්. එම්. චන්ද්‍රපාල රාජපක්ෂ සහ එච්. එම්. නන්දනී ප්‍රේමලතා<br/>යන දෙපළගේ ආදරණීය දියණිය වන
                    </p>
                    <h3 className="text-3xl md:text-5xl font-bold text-[#b5932f] mt-4 mb-8 tracking-normal drop-shadow-sm" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                      {INVITATION.couple.brideFull}
                    </h3>

                    <p className="text-[#473c1f] tracking-normal leading-relaxed mt-10 text-sm md:text-lg" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                      ආර්. ඒ. සුමිත් රණසිංහ සහ පී. ඒ. ඈන් තෙරේස් ප්‍රියන්තිනි<br/>යන දෙපළගේ ආදරණීය පුත් වන
                    </p>
                    <h3 className="text-3xl md:text-5xl font-bold text-[#b5932f] mt-4 mb-4 tracking-normal drop-shadow-sm" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                      {INVITATION.couple.groomFull}
                    </h3>

                    <p className="text-slate-700 max-w-2xl mx-auto pt-4 font-sans">
                      සමඟ අතිනත ගන්නා සොඳුරු මොහොත, ඔබගේ ආශීර්වාදයෙන් වර්ණවත් කර ගැනීමට සෙනෙහසින් ඇරයුම් කරන්නෙමු.
                    </p>




                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2 className="text-xl md:text-2xl text-[#b5932f] tracking-[0.5em] font-bold">
                    ශ්‍රී සුභ මංගලම්
                  </h2>
                </motion.div>

                <div className="relative w-full flex flex-col items-center justify-center my-8 md:my-12 mb-12 md:mb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-20 w-full max-w-[560px] bg-gradient-to-b from-white to-[#fcfcfc] p-8 md:p-14 rounded-3xl border border-[#b5932f]/30 shadow-[0_0_50px_-12px_rgba(143,115,34,0.25)] flex flex-col items-center justify-center text-center overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#8f7322] via-[#e6c555] to-[#8f7322]" />
                    <div className="absolute inset-2 border border-[#b5932f]/10 rounded-[1.5rem] pointer-events-none" />

                    <div className="w-full text-left grid grid-cols-1 gap-8 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#b5932f]/10 flex items-center justify-center shrink-0 border border-[#b5932f]/20 shadow-inner">
                          <Calendar className="w-5 h-5 text-[#b5932f]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#8f7322]/50 mb-1">
                            දිනය
                          </div>
                          <div className="text-base md:text-lg text-[#8f7322] tracking-wide font-bold">
                            {INVITATION.date.displayLong}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#8f7322]/10 flex items-center justify-center shrink-0 border border-[#8f7322]/20 shadow-inner">
                          <Clock className="w-5 h-5 text-[#8f7322]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#8f7322]/50 mb-1">
                            වේලාව
                          </div>
                          <div className="text-base md:text-lg text-[#8f7322] tracking-wide font-bold">
                            පෝරුව චාරිත්‍ර {INVITATION.time.ceremonyStart}ට
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#8f7322]/10 flex items-center justify-center shrink-0 border border-[#8f7322]/20 shadow-inner">
                          <MapPin className="w-5 h-5 text-[#8f7322]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#8f7322]/50 mb-1">
                            ස්ථානය
                          </div>
                          <div className="text-base md:text-lg text-[#8f7322] tracking-wide font-bold">
                            {INVITATION.venue.name}, {INVITATION.venue.city}
                          </div>
                          <a
                            href={INVITATION.venue.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex text-[10px] md:text-xs text-[#b5932f] hover:text-[#1b4332] font-bold tracking-widest uppercase border-b border-[#b5932f]/30 hover:border-[#1b4332] transition-colors pb-0.5"
                          >
                            View on Google Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="relative py-14 md:py-48 bg-[#8f7322] flex flex-col items-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-24 -right-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                className="absolute -bottom-24 -left-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />

              <div className="w-full max-w-[1200px] px-6 flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative mb-12 md:mb-20"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "80px" }}
                      viewport={{ once: true }}
                      className="h-px bg-white/40 mb-8"
                    />

                    <h2 className="text-3xl md:text-6xl text-white tracking-[0.25em] md:tracking-[0.4em] font-bold leading-tight">
                      මෙම දිනය <span className="mx-2 md:mx-4 text-[#fdf8e6]">සුරකින්න</span>
                    </h2>

                    <div className="mt-10 flex items-center justify-center gap-6">
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#fdf8e6]/50" />
                      <span className="font-numeric text-3xl md:text-5xl text-[#fdf8e6] drop-shadow-md">
                        {INVITATION.date.displayNumeric}
                      </span>
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#fdf8e6]/50" />
                    </div>
                  </div>
                </motion.div>

                <CountdownTimer isDark />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.8 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 md:mt-20 flex flex-col items-center gap-4"
                >
                  <p className="text-sm md:text-base tracking-[0.6em] text-white font-bold text-center">
                    ආදරයෙන් පිරුණු මොහොතකට රැඳී සිටින්න
                  </p>

                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        className="w-1 h-1 bg-[#fdf8e6] rotate-45"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>


            <section className="relative py-16 md:py-48 bg-transparent flex flex-col items-center overflow-hidden">
              <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center relative z-10 w-full">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-4xl text-slate-800 tracking-[0.3em] mb-8 md:mb-12 text-center"
                >
                  පැමිණීම තහවුරු කිරීම
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="relative w-full max-w-[650px] bg-white p-6 md:p-10 shadow-[0_40px_100px_-25px_rgba(0,0,0,0.12)] flex flex-col items-center"
                >
                  <div className="w-full rounded-[1.5rem] p-6 md:p-8 flex flex-col items-center">
                    <h3 className="text-2xl md:text-4xl text-slate-800 mb-8 text-center">
                      ඔබ පැමිණෙන්නේද?
                    </h3>

                    <form className="w-full space-y-6 text-left" onSubmit={handleRsvpSubmit}>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">ඔබගේ නම</label>
                        <input
                          type="text"
                          placeholder="ඔබගේ නම මෙහි ලියන්න..."
                          value={rsvpForm.name}
                          onChange={(e) => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, name: e.target.value }));
                          }}
                          className="w-full bg-white rounded-lg px-4 py-3 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all text-base font-numeric"
                          required
                        />
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">
                          අපගේ විශේෂ දිනයට ඔබ පැමිණෙන්නේද?
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, guests: "1" }));
                          }}
                          aria-pressed={rsvpForm.guests !== "0"}
                          className={`w-full py-5 md:py-6 rounded-xl text-sm md:text-base tracking-wide transition-all shadow-sm flex items-center justify-center px-4 leading-relaxed active:scale-[0.98] ${rsvpForm.guests !== "0" ? "bg-[#8f7322] text-white hover:bg-[#1a5c4a]" : "bg-[#f3f3f3] hover:bg-slate-200 text-slate-700"}`}
                        >
                          ඔව්, මම ආදරයෙන් පැමිණෙන්නම්!
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, guests: "0" }));
                          }}
                          aria-pressed={rsvpForm.guests === "0"}
                          className={`w-full py-5 md:py-6 rounded-xl text-sm md:text-base tracking-wide transition-all shadow-sm flex items-center justify-center px-4 leading-relaxed active:scale-[0.98] ${rsvpForm.guests === "0" ? "bg-[#8f7322] text-white hover:bg-[#1a5c4a]" : "bg-[#f3f3f3] hover:bg-slate-200 text-slate-700"}`}
                        >
                          කණගාටුයි, මට පැමිණිය නොහැක. නමුත් මගේ ආශීර්වාදය ඔබ සමඟයි.
                        </button>
                      </div>

                      {(rsvpStatus === "success" || rsvpStatus === "error") && (
                        <p
                          className={`text-xs text-center font-semibold ${rsvpStatus === "success" ? "text-emerald-600" : "text-red-500"
                            }`}
                        >
                          {rsvpStatus === "success"
                            ? "ඔබගේ පැමිණීම තහවුරු කිරීම සාර්ථකව යවා ඇත."
                            : "කරුණාකර ඔබගේ නම ඇතුළත් කර නැවත උත්සාහ කරන්න."}
                        </p>
                      )}

                      <div className="pt-6">
                        <button
                          type="submit"
                          disabled={rsvpStatus === "sending"}
                          className="w-full bg-[#8f7322] text-white py-4 md:py-5 rounded-xl text-sm md:text-base tracking-[0.2em] font-bold hover:bg-[#1a5c4a] transition-all shadow-md disabled:opacity-70"
                        >
                          {rsvpStatus === "sending" ? "යවමින්..." : "තහවුරු කරන්න"}
                        </button>

                        <p className="text-xs text-slate-400 mt-4 text-center leading-relaxed">
                          ඔබගේ ප්‍රතිචාරය පුද්ගලිකව තබා ගනු ලැබේ.
                        </p>
                      </div>
                    </form>
                  </div>
                </motion.div>


              </div>
            </section>






            <section className="w-full relative overflow-hidden bg-transparent py-14 md:py-32">
              <div className="container mx-auto px-6 max-w-5xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-center gap-3 opacity-70">
                    <div className="h-px w-10 bg-[#8f7322]/20" />
                    <Sparkles className="w-4 h-4 text-[#b5932f]" />
                    <div className="h-px w-10 bg-[#8f7322]/20" />
                  </div>

                  <h2 className="text-5xl md:text-7xl bg-gradient-to-r from-[#7a1f1a] via-[#8f7322] to-[#7a1f1a] bg-clip-text text-transparent italic">
                    ස්තූතියි
                  </h2>

                  <p className="text-[#473c1f] text-sm md:text-base tracking-[0.25em] font-bold leading-loose max-w-3xl mx-auto">
                    සෙනෙහසින් ලියැවෙන අපගේ ජීවිත කතාවේ සුන්දරතම දිනය, ඔබගේ පැමිණීමෙන් තවත් අර්ථවත් වනු ඇතැයි අප විශ්වාස කරමු
                  </p>

                  <div className="pt-6 flex flex-col items-center gap-4 text-center w-full max-w-xl mx-auto">
                    <div className="h-px w-24 bg-[#8f7322]/40" />
                    <p className="text-[#7a1f1a] text-xs tracking-[0.4em] font-bold mt-2">
                      සම්බන්ධතා
                    </p>

                    <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-[#473c1f] text-base tracking-widest font-bold">
                      {INVITATION.rsvpContacts.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm md:text-base tracking-[0.5em] text-[#5e4a13] font-bold pt-12">
                    © 2026 {INVITATION.couple.bride} සහ {INVITATION.couple.groom}
                  </p>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundMusic} loop />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-[60] bg-white text-[#87937a] p-3 rounded-full shadow-lg hover:bg-[#87937a]/10 transition-colors"
      >
        <div className="flex flex-col items-center">
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </div>
      </motion.button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dl-manel-bold,
            .dl-manel-bold * {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            input,
            textarea,
            button {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            .animate-spin-slow {
              animation: spin-slow linear infinite;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background: #ccbaa233;
            }

            ::-webkit-scrollbar-thumb {
              background: #87937a66;
              border-radius: 10px;
            }
          `,
        }}
      />
    </main>
  );
}