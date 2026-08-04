/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   motion,
//   useMotionValue,
//   useTransform,
//   AnimatePresence,
// } from "framer-motion";
// import {
//   Search,
//   Compass,
//   MapPin,
//   Sparkles,
//   ArrowRight,
//   Globe2,
//   ShieldCheck,
//   Users,
//   SunMedium,
//   Camera,
//   Star,
//   ChevronRight,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Logo from "@/assets/icons/Logo";

// // RTK Query hook
// import { useGetAllDestinationsQuery } from "@/redux/features/destination/destination.api";

// export default function HeroSection() {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");

//   // Custom Cursor Mouse Coordinates
//   const cursorX = useMotionValue(-100);
//   const cursorY = useMotionValue(-100);
//   const [isHovered, setIsHovered] = useState(false);

//   // 3D Tilt Coordinates
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
//   const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

//   // Fetch API Destinations
//   const { data: destinations = [], isLoading: isDestLoading } =
//     useGetAllDestinationsQuery(undefined);

//   // Track Mouse Position for Cursor & 3D Effects
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       cursorX.set(e.clientX);
//       cursorY.set(e.clientY);
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [cursorX, cursorY]);

//   const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;
//     mouseX.set(e.clientX - centerX);
//     mouseY.set(e.clientY - centerY);
//   };

//   const handleContainerMouseLeave = () => {
//     mouseX.set(0);
//     mouseY.set(0);
//   };

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
//     navigate(`/tours?search=${encodeURIComponent(searchQuery)}`);
//   };

//   const categories = ["All", "Beach", "Hill Tracts", "Heritage", "Forest"];

//   return (
//     <div
//       onMouseMove={handleContainerMouseMove}
//       onMouseLeave={handleContainerMouseLeave}
//       className="relative min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-emerald-500 selection:text-slate-950"
//       style={{ perspective: 1200 }}
//     >
//       {/* --- 1. ULTRA MODERN CUSTOM 3D CURSOR --- */}
//       <motion.div
//         className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-emerald-400 pointer-events-none z-50 mix-blend-difference hidden lg:block"
//         style={{
//           x: cursorX,
//           y: cursorY,
//           translateX: "-50%",
//           translateY: "-50%",
//         }}
//         animate={{
//           scale: isHovered ? 2.5 : 1,
//           backgroundColor: isHovered
//             ? "rgba(52, 211, 153, 0.2)"
//             : "rgba(0, 0, 0, 0)",
//         }}
//         transition={{ type: "spring", stiffness: 300, damping: 20 }}
//       />

//       {/* --- 2. RETRO 3D BACKGROUND GRID & GLOWS --- */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_70%,transparent_100%)]" />
//         <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/20 to-sky-400/10 rounded-full blur-[140px]" />
//         <div className="absolute top-10 right-10 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px]" />
//       </div>

//       {/* --- 3. MAIN HERO CONTAINER --- */}
//       <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
//         <motion.div
//           style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
//           transition={{ type: "spring", stiffness: 90, damping: 25 }}
//           className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
//         >
//           {/* LEFT COLUMN: HERO TEXT & SEARCH CONSOLE */}
//           <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
//             {/* Live Weather & Status Badge */}
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl"
//             >
//               <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
//                 <SunMedium className="w-4 h-4 animate-spin-slow" />
//               </div>
//               <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">
//                 Best Season to Visit:{" "}
//                 <span className="text-emerald-400">Autumn & Winter</span>
//               </span>
//             </motion.div>

//             {/* Headline */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.1 }}
//               className="space-y-4"
//             >
//               <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08]">
//                 Explore Nostalgic <br />
//                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 drop-shadow-[0_10px_25px_rgba(16,185,129,0.3)]">
//                   Bangladesh 3D
//                 </span>
//               </h1>
//               <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
//                 Discover timeless landscapes, ancient heritage, and hidden
//                 eco-resorts. Book verified tours with live dynamic scheduling
//                 and 3D visual previews.
//               </p>
//             </motion.div>

//             {/* Interactive Category Selector Pills */}
//             <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   onMouseEnter={() => setIsHovered(true)}
//                   onMouseLeave={() => setIsHovered(false)}
//                   onClick={() => setActiveCategory(cat)}
//                   className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
//                     activeCategory === cat
//                       ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30"
//                       : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>

//             {/* Interactive 3D Search Console */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="w-full max-w-2xl mx-auto lg:mx-0"
//             >
//               <form
//                 onSubmit={handleSearchSubmit}
//                 className="p-2.5 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center gap-3"
//               >
//                 <div className="relative w-full flex items-center pl-3">
//                   <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
//                   <Input
//                     type="text"
//                     placeholder="Search destination, tour, or region..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="bg-transparent border-none text-white placeholder:text-slate-500 focus-visible:ring-0 text-sm sm:text-base h-12"
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   onMouseEnter={() => setIsHovered(true)}
//                   onMouseLeave={() => setIsHovered(false)}
//                   size="lg"
//                   className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
//                 >
//                   <Search className="w-5 h-5" />
//                   <span>Explore</span>
//                 </Button>
//               </form>
//             </motion.div>

//             {/* Live Dest API Dynamic Pills */}
//             {!isDestLoading && destinations.length > 0 && (
//               <div className="flex items-center flex-wrap justify-center lg:justify-start gap-2 pt-2">
//                 <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
//                   <Compass className="w-3.5 h-3.5 text-emerald-400" /> Trending
//                   Spots:
//                 </span>
//                 {destinations.slice(0, 4).map((dest: any) => (
//                   <Link
//                     key={dest._id || dest.id}
//                     to={`/tours?destination=${encodeURIComponent(dest.name)}`}
//                     className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all"
//                   >
//                     {dest.name}
//                   </Link>
//                 ))}
//               </div>
//             )}

//             {/* Metrics Counters */}
//             <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
//               <div>
//                 <h3 className="text-2xl font-black text-white">50+</h3>
//                 <p className="text-xs text-slate-400">Destinations</p>
//               </div>
//               <div>
//                 <h3 className="text-2xl font-black text-emerald-400">4.9 ★</h3>
//                 <p className="text-xs text-slate-400">User Rating</p>
//               </div>
//               <div>
//                 <h3 className="text-2xl font-black text-white">100%</h3>
//                 <p className="text-xs text-slate-400">Verified Guides</p>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: 3D IMAGE PREVIEW CARDS */}
//           <div className="lg:col-span-5 relative flex items-center justify-center min-h-[420px]">
//             {/* Background Glow */}
//             <div className="absolute w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />

//             {/* Primary 3D Floating Image Card */}
//             <motion.div
//               whileHover={{ scale: 1.05, rotateZ: -2 }}
//               className="relative z-20 w-72 sm:w-80 h-96 rounded-3xl overflow-hidden border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.8)] bg-slate-900 group"
//               style={{
//                 transformStyle: "preserve-3d",
//                 transform: "translateZ(40px)",
//               }}
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
//                 alt="Cox's Bazar Beach"
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

//               <div className="absolute bottom-6 left-6 right-6 z-10 space-y-1">
//                 <span className="px-2.5 py-1 bg-emerald-500/80 backdrop-blur-md text-slate-950 text-xs font-bold rounded-lg">
//                   Cox's Bazar
//                 </span>
//                 <h3 className="text-xl font-bold text-white">
//                   World's Longest Sea Beach
//                 </h3>
//                 <p className="text-xs text-slate-300 flex items-center gap-1">
//                   <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{" "}
//                   4.9 (1.2k reviews)
//                 </p>
//               </div>
//             </motion.div>

//             {/* Secondary Floating 3D Card */}
//             <motion.div
//               whileHover={{ scale: 1.05, rotateZ: 4 }}
//               className="absolute -top-4 -right-2 sm:right-0 z-10 w-56 h-72 rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900 hidden sm:block"
//               style={{
//                 transformStyle: "preserve-3d",
//                 transform: "translateZ(-20px) rotate(8deg)",
//               }}
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80"
//                 alt="Sylhet Tea Garden"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
//               <div className="absolute bottom-4 left-4 z-10">
//                 <span className="px-2 py-0.5 bg-teal-500/80 backdrop-blur-md text-slate-950 text-[10px] font-bold rounded-md">
//                   Sylhet
//                 </span>
//                 <h4 className="text-sm font-bold text-white mt-1">
//                   Sreemangal Tea Estates
//                 </h4>
//               </div>
//             </motion.div>

//             {/* Floating Live Badge Overlay */}
//             <motion.div
//               animate={{ y: [0, -10, 0] }}
//               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
//               className="absolute -bottom-6 -left-2 z-30 p-4 rounded-2xl bg-slate-900/90 border border-white/20 backdrop-blur-2xl shadow-2xl flex items-center gap-3"
//             >
//               <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
//                 <Camera className="w-5 h-5" />
//               </div>
//               <div>
//                 <p className="text-xs font-bold text-white">3D Virtual Tours</p>
//                 <p className="text-[10px] text-slate-400">
//                   Available on selected routes
//                 </p>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Search,
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Globe2,
  ShieldCheck,
  Users,
  SunMedium,
  Camera,
  Star,
  ChevronRight,
  Play,
  Heart,
  TrendingUp,
  Clock,
  Award,
  TreePine,
  Waves,
  Mountain,
  Castle,
  Bird,
  Zap,
  Eye,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useGetAllDestinationsQuery } from "@/redux/features/destination/destination.api";

/* ──────────────────────────────────────────────────────────────── */
/*  PARTICLE / STAR SYSTEM                                         */
/* ──────────────────────────────────────────────────────────────── */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  type: "star" | "dot" | "ring";
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.6 + 0.1,
    type: (["star", "dot", "ring"] as const)[Math.floor(Math.random() * 3)],
  }));
}

/* ──────────────────────────────────────────────────────────────── */
/*  FLOATING BIRD COMPONENT                                         */
/* ──────────────────────────────────────────────────────────────── */

function FloatingBird({
  delay,
  startY,
  speed,
  size,
}: {
  delay: number;
  startY: number;
  speed: number;
  size: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      initial={{ x: "-10%", y: `${startY}%`, opacity: 0 }}
      animate={{
        x: ["-10%", "110%"],
        y: [
          `${startY}%`,
          `${startY - 8}%`,
          `${startY + 5}%`,
          `${startY - 3}%`,
          `${startY}%`,
        ],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        x: { duration: speed, repeat: Infinity, delay, ease: "linear" },
        y: { duration: speed / 2, repeat: Infinity, delay, ease: "easeInOut" },
        opacity: {
          duration: speed,
          repeat: Infinity,
          delay,
          times: [0, 0.1, 0.5, 0.9, 1],
        },
      }}
    >
      <svg
        width={size}
        height={size * 0.5}
        viewBox="0 0 60 30"
        fill="none"
        className="drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]"
      >
        <motion.path
          d="M0 15 Q10 5 20 15 Q30 0 30 15 Q30 0 40 15 Q50 5 60 15"
          stroke="rgba(52,211,153,0.6)"
          strokeWidth="1.5"
          fill="none"
          animate={{
            d: [
              "M0 15 Q10 5 20 15 Q30 0 30 15 Q30 0 40 15 Q50 5 60 15",
              "M0 15 Q10 22 20 15 Q30 25 30 15 Q30 25 40 15 Q50 22 60 15",
              "M0 15 Q10 5 20 15 Q30 0 30 15 Q30 0 40 15 Q50 5 60 15",
            ],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  STAR TRAIL CURSOR                                               */
/* ──────────────────────────────────────────────────────────────── */

function StarTrailCursor() {
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const idCounter = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime.current < 40) return;
      lastTime.current = now;

      const id = idCounter.current++;
      setTrail((prev) => [
        ...prev.slice(-12),
        { id, x: e.clientX, y: e.clientY },
      ]);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      {trail.map((point, i) => (
        <motion.div
          key={point.id}
          className="fixed top-0 left-0 pointer-events-none z-50"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            x: point.x - 3,
            y: point.y - 3,
          }}
        >
          <svg
            width="6"
            height="6"
            viewBox="0 0 10 10"
            className="drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]"
          >
            <polygon
              points="5,0 6.5,3.5 10,4 7,6.5 8,10 5,8 2,10 3,6.5 0,4 3.5,3.5"
              fill="rgba(52,211,153,0.9)"
            />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  3D TILT CARD                                                    */
/* ──────────────────────────────────────────────────────────────── */

function TiltCard({
  image,
  badge,
  badgeColor,
  title,
  subtitle,
  rating,
  reviews,
  className,
  zIndex,
  translateZ,
  rotate,
}: {
  image: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  rating?: number;
  reviews?: string;
  className?: string;
  zIndex: number;
  translateZ: number;
  rotate?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 25 };
  const rotateX = useSpring(
    useTransform(mouseY, [-200, 200], [15, -15]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-200, 200], [-15, 15]),
    springConfig,
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04, z: zIndex }}
      className={`relative rounded-3xl overflow-hidden border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.7)] bg-slate-900 group cursor-pointer ${className || ""}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `translateZ(${translateZ}px) rotate(${rotate || 0}deg)`,
        rotateX,
        rotateY,
        zIndex,
      }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

      {/* Shine overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

      <div className="absolute bottom-5 left-5 right-5 z-10 space-y-1.5">
        <span
          className={`inline-block px-2.5 py-1 ${badgeColor} backdrop-blur-md text-slate-950 text-xs font-bold rounded-lg`}
        >
          {badge}
        </span>
        <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
        <p className="text-xs text-slate-300 line-clamp-1">{subtitle}</p>
        {rating && (
          <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            {rating} {reviews && `(${reviews})`}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  TRUST BADGE                                                     */
/* ──────────────────────────────────────────────────────────────── */

function TrustBadge({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
    >
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm font-bold text-white">{value}</p>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  MAIN HERO SECTION                                               */
/* ──────────────────────────────────────────────────────────────── */

const DESTINATION_IMAGES = [
  {
    image:
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
    badge: "Cox's Bazar",
    badgeColor: "bg-emerald-500/80",
    title: "World's Longest Sea Beach",
    subtitle: "120 km of golden shoreline & sunsets",
    rating: 4.9,
    reviews: "1.2k",
  },
  {
    image:
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80",
    badge: "Sylhet",
    badgeColor: "bg-teal-500/80",
    title: "Sreemangal Tea Estates",
    subtitle: "Endless green carpet of tea gardens",
    rating: 4.8,
    reviews: "890",
  },
  {
    image:
      "https://images.unsplash.com/photo-1567157577867-43efa1d398fc?auto=format&fit=crop&w=800&q=80",
    badge: "Rangamati",
    badgeColor: "bg-sky-500/80",
    title: "Hill Tracts & Kaptai Lake",
    subtitle: "Tribal culture & pristine waterways",
    rating: 4.7,
    reviews: "640",
  },
];

const CATEGORIES = [
  { label: "All", icon: Globe2 },
  { label: "Beach", icon: Waves },
  { label: "Hill Tracts", icon: Mountain },
  { label: "Heritage", icon: Castle },
  { label: "Forest", icon: TreePine },
];

const BIRDS = [
  { delay: 0, startY: 15, speed: 18, size: 36 },
  { delay: 6, startY: 25, speed: 22, size: 28 },
  { delay: 12, startY: 10, speed: 25, size: 32 },
  { delay: 3, startY: 35, speed: 20, size: 24 },
  { delay: 9, startY: 20, speed: 28, size: 20 },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isHovered, setIsHovered] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [particles] = useState(() => generateParticles(60));

  // Custom cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorScale = useMotionValue(1);
  const cursorBorderRadius = useMotionValue(50);

  // 3D tilt for entire hero
  const heroMouseX = useMotionValue(0);
  const heroMouseY = useMotionValue(0);
  const heroRotateX = useTransform(heroMouseY, [-500, 500], [3, -3]);
  const heroRotateY = useTransform(heroMouseX, [-500, 500], [-3, 3]);

  // Fetch destinations
  const { data: destinations = [], isLoading: isDestLoading } =
    useGetAllDestinationsQuery(undefined);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    heroMouseX.set(e.clientX - rect.left - rect.width / 2);
    heroMouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleHeroMouseLeave = () => {
    heroMouseX.set(0);
    heroMouseY.set(0);
    cursorScale.set(1);
    cursorBorderRadius.set(50);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/tours?search=${encodeURIComponent(searchQuery)}`);
  };

  // Auto-rotate hero cards
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % DESTINATION_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="relative min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-emerald-500 selection:text-slate-950"
      style={{ perspective: 1400 }}
    >
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. CUSTOM CURSOR — Star + Glow Ring                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden lg:flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute w-10 h-10 rounded-full border border-emerald-400/40"
          animate={{
            scale: isHovered ? 2.8 : 1,
            borderColor: isHovered
              ? "rgba(52,211,153,0.7)"
              : "rgba(52,211,153,0.3)",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        {/* Inner star cursor */}
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]"
          animate={{
            scale: isHovered ? 1.6 : 1,
            rotate: isHovered ? 180 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.polygon
            points="12,0 14.5,8.5 24,9.5 17,15.5 19,24 12,19.5 5,24 7,15.5 0,9.5 9.5,8.5"
            fill="rgba(52,211,153,0.9)"
            animate={{
              fill: isHovered ? "rgba(16,185,129,1)" : "rgba(52,211,153,0.85)",
            }}
          />
        </motion.svg>
      </motion.div>

      {/* Star trail following cursor */}
      <div className="hidden lg:block">
        <StarTrailCursor />
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. FLOATING BIRDS                                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {BIRDS.map((bird, i) => (
        <FloatingBird key={i} {...bird} />
      ))}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. PARTICLE / STAR FIELD BACKGROUND                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, p.opacity, p.opacity * 0.5, p.opacity, 0],
              scale: [0, 1, 0.8, 1.1, 0],
              y: [0, -20, 10, -15, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          >
            {p.type === "star" && (
              <svg
                width={p.size * 3}
                height={p.size * 3}
                viewBox="0 0 10 10"
                className="drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]"
              >
                <polygon
                  points="5,0 6.2,3.5 10,4 7.2,6.2 8,10 5,8 2,10 2.8,6.2 0,4 3.8,3.5"
                  fill="rgba(52,211,153,0.7)"
                />
              </svg>
            )}
            {p.type === "dot" && (
              <div
                className="rounded-full bg-emerald-400/60"
                style={{ width: p.size, height: p.size }}
              />
            )}
            {p.type === "ring" && (
              <div
                className="rounded-full border border-teal-400/40"
                style={{ width: p.size * 2.5, height: p.size * 2.5 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. BACKGROUND GRID + AURORA GLOWS                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Perspective grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_70%,transparent_100%)]" />

        {/* Aurora glow 1 — emerald/teal */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px]"
          animate={{
            background: [
              "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(20,184,166,0.12) 50%, transparent 70%)",
              "radial-gradient(circle, rgba(20,184,166,0.22) 0%, rgba(56,189,248,0.10) 50%, transparent 70%)",
              "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(20,184,166,0.12) 50%, transparent 70%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Aurora glow 2 — blue/indigo */}
        <motion.div
          className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full blur-[120px]"
          animate={{
            background: [
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 60%)",
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)",
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 60%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Aurora glow 3 — left accent */}
        <motion.div
          className="absolute bottom-20 left-0 w-[400px] h-[400px] rounded-full blur-[100px]"
          animate={{
            background: [
              "radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 60%)",
              "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 60%)",
              "radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 60%)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)] opacity-40" />
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. MAIN HERO CONTENT                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          style={{
            rotateX: heroRotateX,
            rotateY: heroRotateY,
            transformStyle: "preserve-3d",
          }}
          transition={{ type: "spring", stiffness: 80, damping: 30 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
        >
          {/* ─────── LEFT COLUMN ─────── */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl"
            >
              <div className="relative p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <SunMedium className="w-4 h-4" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-emerald-400/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">
                Best Season: <span className="text-emerald-400">Oct – Mar</span>
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-6xl xl:text-[4.5rem] font-black tracking-tight leading-[1.05]">
                Explore Nostalgic
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                  Bangladesh
                </span>
                <motion.span
                  className="inline-block ml-2 text-emerald-400"
                  animate={{ rotateZ: [0, 10, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ✦
                </motion.span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover timeless landscapes, ancient heritage, and hidden
                eco-resorts. Book verified tours with live scheduling, 3D
                previews, and instant secure payments.
              </p>
            </motion.div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {CATEGORIES.map(({ label, icon: Icon }) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => setActiveCategory(label)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeCategory === label
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30"
                      : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </motion.button>
              ))}
            </div>

            {/* Search Console */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="w-full max-w-2xl mx-auto lg:mx-0"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="p-2 bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="relative w-full flex items-center pl-4">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                  <Input
                    type="text"
                    placeholder="Search destination, tour, or region..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-white placeholder:text-slate-500 focus-visible:ring-0 text-sm sm:text-base h-12"
                  />
                </div>
                <Button
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <Search className="w-5 h-5" />
                  Explore
                </Button>
              </form>
            </motion.div>

            {/* Trending Destination Pills from API */}
            <div className="flex items-center flex-wrap justify-center lg:justify-start gap-2 pt-1">
              {!isDestLoading && destinations.length > 0 && (
                <>
                  <span className="text-[11px] text-slate-500 font-semibold mr-1 flex items-center gap-1 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />{" "}
                    Trending
                  </span>
                  {destinations.slice(0, 5).map((dest: any) => (
                    <Link
                      key={dest._id || dest.id}
                      to={`/tours?destination=${encodeURIComponent(dest.name)}`}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/30 transition-all duration-200"
                    >
                      {dest.name}
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* Metrics + Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <TrustBadge
                icon={MapPin}
                label="Destinations"
                value="50+"
                color="bg-emerald-500/20 text-emerald-400"
              />
              <TrustBadge
                icon={Star}
                label="Rating"
                value="4.9 ★"
                color="bg-yellow-500/20 text-yellow-400"
              />
              <TrustBadge
                icon={ShieldCheck}
                label="Verified"
                value="100%"
                color="bg-sky-500/20 text-sky-400"
              />
              <TrustBadge
                icon={Users}
                label="Travelers"
                value="10K+"
                color="bg-violet-500/20 text-violet-400"
              />
            </div>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/tours")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow"
              >
                <Compass className="w-5 h-5" />
                Start Exploring
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/destinations")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 border border-white/15 text-white font-semibold rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                Virtual Tour
              </motion.button>
            </div>
          </div>

          {/* ─────── RIGHT COLUMN: 3D CARD STACK ─────── */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[480px]">
            {/* Background glow */}
            <div className="absolute w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl" />

            {/* Card 3 — back layer */}
            <TiltCard
              {...DESTINATION_IMAGES[2]}
              className="absolute w-52 h-64 sm:w-56 sm:h-72 -top-6 -left-4 sm:-left-8 hidden sm:block opacity-60"
              zIndex={1}
              translateZ={-40}
              rotate={-12}
            />

            {/* Card 2 — middle layer */}
            <TiltCard
              {...DESTINATION_IMAGES[1]}
              className="absolute w-60 h-72 sm:w-64 sm:h-80 -top-2 -right-2 sm:right-2 hidden sm:block opacity-80"
              zIndex={2}
              translateZ={-15}
              rotate={8}
            />

            {/* Card 1 — front/primary (auto-rotates content) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.5 }}
                className="relative z-20"
              >
                <TiltCard
                  {...DESTINATION_IMAGES[activeCard]}
                  className="w-72 sm:w-80 h-96"
                  zIndex={20}
                  translateZ={50}
                  rotate={0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Card navigation dots */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {DESTINATION_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCard(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeCard === i
                      ? "w-6 bg-emerald-400"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Floating 3D Virtual Tour Badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
              }}
              className="absolute -bottom-14 sm:-bottom-12 -left-2 sm:-left-4 z-30 p-4 rounded-2xl bg-slate-900/90 border border-white/15 backdrop-blur-2xl shadow-2xl flex items-center gap-3"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">3D Virtual Tours</p>
                <p className="text-[10px] text-slate-400">
                  Immersive route previews
                </p>
              </div>
            </motion.div>

            {/* Floating Live Travelers Badge */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -top-8 right-0 sm:right-4 z-30 p-3 rounded-xl bg-slate-900/90 border border-white/15 backdrop-blur-2xl shadow-xl flex items-center gap-2"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 text-xs font-black">
                  <Users className="w-4 h-4" />
                </div>
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-slate-900"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">2.4K Online</p>
                <p className="text-[9px] text-slate-400">Live travelers</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6. BOTTOM INFO RIBBON                                      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {[
            {
              icon: ShieldCheck,
              title: "SSLCommerz Secure",
              desc: "Encrypted payments",
              color: "from-emerald-500/10 to-teal-500/10",
              iconColor: "text-emerald-400",
            },
            {
              icon: Clock,
              title: "Instant Booking",
              desc: "Real-time confirmation",
              color: "from-sky-500/10 to-blue-500/10",
              iconColor: "text-sky-400",
            },
            {
              icon: Award,
              title: "Certified Guides",
              desc: "Govt. approved professionals",
              color: "from-violet-500/10 to-purple-500/10",
              iconColor: "text-violet-400",
            },
            {
              icon: Heart,
              title: "Eco-Friendly",
              desc: "Sustainable tourism",
              color: "from-pink-500/10 to-rose-500/10",
              iconColor: "text-pink-400",
            },
          ].map(({ icon: Icon, title, desc, color, iconColor }) => (
            <motion.div
              key={title}
              whileHover={{ y: -3, scale: 1.02 }}
              className={`p-5 rounded-2xl bg-gradient-to-br ${color} border border-white/5 backdrop-blur-sm text-center group cursor-default`}
            >
              <Icon
                className={`w-6 h-6 ${iconColor} mx-auto mb-2 group-hover:scale-110 transition-transform`}
              />
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 7. SCROLL INDICATOR                                        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col items-center mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-slate-500" />
          </motion.div>
          <span className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </div>
  );
}
