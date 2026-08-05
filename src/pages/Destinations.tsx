// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { useGetAllDestinationsQuery } from "@/redux/features/destination/destination.api";
// import { Input } from "@/components/ui/input";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// function Destinations() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const {
//     data: destinations,
//     isLoading,
//     isError,
//   } = useGetAllDestinationsQuery(undefined);

//   const filteredDestinations = destinations?.filter((dest: any) =>
//     dest.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="min-h-screen pb-24" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)" }}>
//       {/* ── Premium Hero ─────────────────────────────── */}
//       <div className="relative overflow-hidden" style={{ minHeight: "55vh" }}>
//         {/* Animated blobs */}
//         <div
//           className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl"
//           style={{ background: "radial-gradient(circle, #6c63ff, #302b63)" }}
//         />
//         <div
//           className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
//           style={{ background: "radial-gradient(circle, #f093fb, #f5576c)" }}
//         />
//         <div
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
//           style={{ background: "radial-gradient(circle, #4facfe, #00f2fe)" }}
//         />

//         {/* Grid overlay */}
//         <div
//           className="absolute inset-0 opacity-5"
//           style={{
//             backgroundImage:
//               "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
//             backgroundSize: "40px 40px",
//           }}
//         />

//         <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
//             style={{
//               background: "rgba(255,255,255,0.08)",
//               border: "1px solid rgba(255,255,255,0.15)",
//               color: "#a5b4fc",
//               backdropFilter: "blur(8px)",
//             }}
//           >
//             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
//             Discover Amazing Places
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: -28 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="text-5xl md:text-7xl font-extrabold mb-5 leading-tight"
//             style={{
//               background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #f093fb 100%)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundClip: "text",
//             }}
//           >
//             Explore Beautiful
//             <br />
//             Destinations
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.25 }}
//             className="text-lg md:text-xl mb-10 max-w-xl"
//             style={{ color: "rgba(165,180,252,0.8)" }}
//           >
//             Find your next perfect getaway across our premium curated locations.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.4 }}
//             className="relative w-full max-w-lg"
//           >
//             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
//               <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//               </svg>
//             </span>
//             <Input
//               type="text"
//               placeholder="Search destinations..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full h-14 pl-14 pr-5 text-base rounded-2xl text-white placeholder-indigo-300/60 shadow-2xl border-0 focus-visible:ring-2 focus-visible:ring-indigo-400"
//               style={{
//                 background: "rgba(255,255,255,0.1)",
//                 backdropFilter: "blur(16px)",
//                 border: "1px solid rgba(255,255,255,0.15)",
//               }}
//             />
//           </motion.div>

//           {/* Stats row */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.55 }}
//             className="flex flex-wrap items-center justify-center gap-8 mt-12"
//           >
//             {[
//               { label: "Destinations", value: "100+" },
//               { label: "Happy Travelers", value: "50K+" },
//               { label: "5-Star Reviews", value: "12K+" },
//             ].map((s) => (
//               <div key={s.label} className="text-center">
//                 <p className="text-2xl font-bold text-white">{s.value}</p>
//                 <p className="text-xs font-medium" style={{ color: "rgba(165,180,252,0.7)" }}>{s.label}</p>
//               </div>
//             ))}
//           </motion.div>
//         </div>

//         {/* Bottom wave */}
//         <div className="absolute bottom-0 left-0 right-0">
//           <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 28C672 36 768 42 864 40C960 38 1056 28 1152 22C1248 16 1344 14 1392 13L1440 12V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="rgb(15,12,41)" />
//           </svg>
//         </div>
//       </div>

//       {/* ── Content ──────────────────────────────────── */}
//       <div className="container mx-auto px-4 pt-2 pb-8 max-w-7xl">
//         {/* Result count */}
//         {!isLoading && !isError && filteredDestinations && filteredDestinations.length > 0 && (
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center text-sm mb-8 font-medium"
//             style={{ color: "rgba(165,180,252,0.6)" }}
//           >
//             Showing <span className="text-white font-bold">{filteredDestinations.length}</span> destinations
//           </motion.p>
//         )}

//         {/* Loading skeleton */}
//         {isLoading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="h-80 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
//             ))}
//           </div>
//         )}

//         {/* Error state */}
//         {isError && (
//           <div className="text-center p-10 rounded-3xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
//             <p className="text-red-400 text-lg font-semibold">Failed to load destinations. Please try again later.</p>
//           </div>
//         )}

//         {/* Empty state */}
//         {!isLoading && !isError && filteredDestinations?.length === 0 && (
//           <div className="text-center p-16">
//             <div className="text-6xl mb-4">🗺️</div>
//             <p className="text-2xl font-bold text-white mb-2">No destinations found</p>
//             <p style={{ color: "rgba(165,180,252,0.6)" }}>Try adjusting your search term.</p>
//           </div>
//         )}

//         {/* Destination cards */}
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={{
//             hidden: { opacity: 0 },
//             visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
//           }}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//         >
//           {filteredDestinations?.map((dest: any) => (
//             <motion.div
//               key={dest._id}
//               variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
//               whileHover={{ y: -10, scale: 1.02 }}
//               className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer"
//               style={{
//                 boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
//                 border: "1px solid rgba(255,255,255,0.08)",
//               }}
//             >
//               <Link to={`/tours?destination=${dest.name}`}>
//                 {dest.image ? (
//                   <img
//                     src={dest.image}
//                     alt={dest.name}
//                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
//                   />
//                 ) : (
//                   <div
//                     className="absolute inset-0 flex items-center justify-center"
//                     style={{ background: "linear-gradient(135deg, #6c63ff, #302b63)" }}
//                   >
//                     <span className="text-6xl text-white/20 font-extrabold">
//                       {dest.name.substring(0, 2).toUpperCase()}
//                     </span>
//                   </div>
//                 )}

//                 {/* Multi-layer gradient overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
//                 <div
//                   className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                   style={{ background: "linear-gradient(135deg, rgba(108,99,255,0.4), rgba(240,147,251,0.3))" }}
//                 />

//                 {/* Top badge */}
//                 <div className="absolute top-4 right-4">
//                   <span
//                     className="px-3 py-1 text-xs font-bold rounded-full"
//                     style={{
//                       background: "rgba(255,255,255,0.15)",
//                       backdropFilter: "blur(8px)",
//                       border: "1px solid rgba(255,255,255,0.2)",
//                       color: "white",
//                     }}
//                   >
//                     {dest.division?.name || "Popular"}
//                   </span>
//                 </div>

//                 {/* Bottom content */}
//                 <div className="absolute bottom-0 left-0 right-0 p-5">
//                   <h3
//                     className="text-xl font-extrabold text-white transition-all duration-300 group-hover:translate-x-1"
//                     style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
//                   >
//                     {dest.name}
//                   </h3>
//                   {dest.description && (
//                     <p className="text-gray-300 text-sm mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       {dest.description}
//                     </p>
//                   )}
//                   <div
//                     className="mt-3 flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
//                     style={{ color: "#a5b4fc" }}
//                   >
//                     Explore tours →
//                   </div>
//                 </div>

//                 {/* Shimmer border on hover */}
//                 <div
//                   className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
//                   style={{ boxShadow: "inset 0 0 0 1.5px rgba(165,180,252,0.4)" }}
//                 />
//               </Link>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default Destinations;

import { useState, useMemo, useCallback, useEffect } from "react";
import { useGetAllDestinationsQuery } from "@/redux/features/destination/destination.api";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, RefreshCw, MapPin } from "lucide-react";

import type { Destination } from "@/types/destination";
import { DestinationStatsBar } from "@/routes/DestinationStatsBar";
import { DivisionFilter } from "@/redux/features/destination/divisionFilter";
import { DestinationSkeleton } from "@/redux/features/destination/DestinationSkeleton";
import { DestinationCard } from "@/components/Modules/Admin/Destination/DestinationCard";
import { Pagination } from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 12;

type SortOption = "default" | "name-asc" | "name-desc";

function Destinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // RTK Query — fetches all destinations; we handle client-side filtering/pagination
  const {
    data: apiResponse,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetAllDestinationsQuery(undefined, {
    refetchOnMountOrArgChange: 60, // auto-refetch if stale > 60s
    pollingInterval: 0, // set to 30000 for live polling every 30s
  });

  const destinations: Destination[] = useMemo(() => {
    if (Array.isArray(apiResponse)) return apiResponse;
    if (apiResponse && Array.isArray((apiResponse as any).data)) return (apiResponse as any).data;
    return [];
  }, [apiResponse]);

  // Extract unique divisions
  const divisions = useMemo(() => {
    const set = new Set<string>();
    destinations.forEach((d) => {
      if (d.division?.name) set.add(d.division.name);
    });
    return Array.from(set).sort();
  }, [destinations]);

  // Filter + sort
  const filteredDestinations = useMemo(() => {
    let result = [...destinations];

    // Search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.division?.name?.toLowerCase().includes(q),
      );
    }

    // Division filter
    if (selectedDivision) {
      result = result.filter((d) => d.division?.name === selectedDivision);
    }

    // Sort
    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [destinations, debouncedSearch, selectedDivision, sortBy]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE),
  );
  const paginatedDestinations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDestinations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDestinations, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  }, []);

  const handleDivisionSelect = useCallback((division: string) => {
    setSelectedDivision(division);
    setCurrentPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [-refetch]);

  const isInitialLoading = isLoading && !apiResponse;
  const isRefetching = isFetching && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-sky-400/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-3xl animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-400/10 blur-3xl animate-pulse [animation-delay:2s]" />
        </div>

        <div className="relative bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900">
          {/* Mesh overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-4 py-20 md:py-28">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6"
            >
              <MapPin className="w-4 h-4 text-sky-300" />
              <span>Discover Bangladesh</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight"
            >
              Explore{" "}
              <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                Beautiful
              </span>{" "}
              Destinations
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-2xl leading-relaxed"
            >
              Find your next perfect getaway across our premium curated
              locations — from serene beaches to majestic hill tracts.
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="relative w-full max-w-xl"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search destinations, divisions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-14 pr-14 text-base rounded-2xl bg-white text-gray-900 shadow-2xl shadow-black/20 border-0 focus-visible:ring-2 focus-visible:ring-sky-400 placeholder:text-gray-400"
              />
              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                  showFilters
                    ? "bg-sky-100 text-sky-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Stats */}
            {!isInitialLoading && (
              <DestinationStatsBar
                totalDestinations={destinations.length}
                totalDivisions={divisions.length}
                searchTerm={debouncedSearch}
              />
            )}
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="container mx-auto px-4 md:px-6 mt-10 max-w-7xl">
        {/* Toolbar: Filters + Sort + Refetch indicator */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {/* Division filter pills */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <DivisionFilter
              divisions={divisions}
              selected={selectedDivision}
              onSelect={handleDivisionSelect}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-300 cursor-pointer"
            >
              <option value="default">Default Order</option>
              <option value="name-asc">A → Z</option>
              <option value="name-desc">Z → A</option>
            </select>

            {/* Refetch button */}
            <button
              onClick={handleRefresh}
              disabled={isRefetching}
              className="h-10 w-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-sky-600 hover:border-sky-300 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
              />
            </button>

            {/* Results count */}
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
              {filteredDestinations.length} result
              {filteredDestinations.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Expanded filters panel (sort by, etc.) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-semibold text-gray-600">
                    Quick Filters:
                  </span>
                  {destinations
                    .filter((d) => d.tourCount && d.tourCount > 0)
                    .slice(0, 5)
                    .map((d) => (
                      <button
                        key={d._id}
                        onClick={() => {
                          setSearchTerm(d.name);
                          setShowFilters(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 hover:bg-sky-50 hover:text-sky-700 transition-colors border border-gray-100"
                      >
                        {d.name}
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== LOADING ===== */}
        {isInitialLoading && <DestinationSkeleton count={8} />}

        {/* ===== ERROR ===== */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex flex-col items-center gap-4 p-10 bg-red-50 rounded-3xl border border-red-100">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-3xl">😕</span>
              </div>
              <p className="text-lg font-semibold text-red-700">
                Failed to load destinations
              </p>
              <p className="text-sm text-red-500">
                Something went wrong. Please try again.
              </p>
              <button
                onClick={handleRefresh}
                className="mt-2 px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ===== EMPTY ===== */}
        {!isInitialLoading && !isError && filteredDestinations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex flex-col items-center gap-4 p-12 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center">
                <Search className="w-8 h-8 text-sky-300" />
              </div>
              <p className="text-xl font-bold text-gray-700">
                No destinations found
              </p>
              <p className="text-sm text-gray-500 max-w-xs">
                We couldn't find any destinations matching "
                <span className="font-semibold">{debouncedSearch}</span>"
                {selectedDivision && (
                  <>
                    {" "}
                    in <span className="font-semibold">{selectedDivision}</span>
                  </>
                )}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDivision("");
                  setSortBy("default");
                }}
                className="mt-2 px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* ===== GRID ===== */}
        {!isInitialLoading && !isError && paginatedDestinations.length > 0 && (
          <>
            {/* Refetching shimmer bar */}
            {isRefetching && (
              <div className="h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400 animate-pulse rounded-full mb-4" />
            )}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06 },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7"
            >
              {paginatedDestinations.map((dest, idx) => (
                <DestinationCard
                  key={dest._id}
                  destination={dest}
                  index={idx}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* ===== FOOTER CTA ===== */}
      {!isInitialLoading && !isError && destinations.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 mb-0"
        >
          <div className="bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 py-16 px-4 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Can't decide where to go?
            </h2>
            <p className="text-blue-100/80 mb-6 max-w-lg mx-auto">
              Let us help you pick the perfect destination based on your
              preferences and travel style.
            </p>
            <a
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-sky-700 rounded-2xl font-bold text-sm hover:bg-sky-50 transition-colors shadow-lg"
            >
              Browse All Tours
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Destinations;
