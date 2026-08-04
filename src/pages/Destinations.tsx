/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useGetAllDestinationsQuery } from "@/redux/features/destination/destination.api";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Destinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: destinations,
    isLoading,
    isError,
  } = useGetAllDestinationsQuery(undefined);

  const filteredDestinations = destinations?.filter((dest: any) =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)" }}>
      {/* ── Premium Hero ─────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: "55vh" }}>
        {/* Animated blobs */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #6c63ff, #302b63)" }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #f093fb, #f5576c)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #4facfe, #00f2fe)" }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#a5b4fc",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Discover Amazing Places
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-5 leading-tight"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Explore Beautiful
            <br />
            Destinations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg md:text-xl mb-10 max-w-xl"
            style={{ color: "rgba(165,180,252,0.8)" }}
          >
            Find your next perfect getaway across our premium curated locations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative w-full max-w-lg"
          >
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-5 text-base rounded-2xl text-white placeholder-indigo-300/60 shadow-2xl border-0 focus-visible:ring-2 focus-visible:ring-indigo-400"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12"
          >
            {[
              { label: "Destinations", value: "100+" },
              { label: "Happy Travelers", value: "50K+" },
              { label: "5-Star Reviews", value: "12K+" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs font-medium" style={{ color: "rgba(165,180,252,0.7)" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 28C672 36 768 42 864 40C960 38 1056 28 1152 22C1248 16 1344 14 1392 13L1440 12V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="rgb(15,12,41)" />
          </svg>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-2 pb-8 max-w-7xl">
        {/* Result count */}
        {!isLoading && !isError && filteredDestinations && filteredDestinations.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm mb-8 font-medium"
            style={{ color: "rgba(165,180,252,0.6)" }}
          >
            Showing <span className="text-white font-bold">{filteredDestinations.length}</span> destinations
          </motion.p>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center p-10 rounded-3xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="text-red-400 text-lg font-semibold">Failed to load destinations. Please try again later.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredDestinations?.length === 0 && (
          <div className="text-center p-16">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-2xl font-bold text-white mb-2">No destinations found</p>
            <p style={{ color: "rgba(165,180,252,0.6)" }}>Try adjusting your search term.</p>
          </div>
        )}

        {/* Destination cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredDestinations?.map((dest: any) => (
            <motion.div
              key={dest._id}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer"
              style={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Link to={`/tours?destination=${dest.name}`}>
                {dest.image ? (
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #6c63ff, #302b63)" }}
                  >
                    <span className="text-6xl text-white/20 font-extrabold">
                      {dest.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, rgba(108,99,255,0.4), rgba(240,147,251,0.3))" }}
                />

                {/* Top badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  >
                    {dest.division?.name || "Popular"}
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3
                    className="text-xl font-extrabold text-white transition-all duration-300 group-hover:translate-x-1"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                  >
                    {dest.name}
                  </h3>
                  {dest.description && (
                    <p className="text-gray-300 text-sm mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {dest.description}
                    </p>
                  )}
                  <div
                    className="mt-3 flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                    style={{ color: "#a5b4fc" }}
                  >
                    Explore tours →
                  </div>
                </div>

                {/* Shimmer border on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: "inset 0 0 0 1.5px rgba(165,180,252,0.4)" }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Destinations;
