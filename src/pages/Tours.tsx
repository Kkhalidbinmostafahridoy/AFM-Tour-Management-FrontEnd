/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetAllTourQuery } from "@/redux/features/Tour/tour.api";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "@/redux/features/wishlist/wishlist.api";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

const CATEGORIES = [
  "All",
  "Adventure",
  "Family",
  "Couple",
  "Honeymoon",
  "Religious",
  "Beach",
  "Hill",
  "Wildlife",
];

// Icon + gradient mapping per category
const CATEGORY_META: Record<
  string,
  { icon: string; gradient: string; activeGrad: string }
> = {
  All: {
    icon: "",
    gradient: "from-slate-700 to-slate-800",
    activeGrad: "linear-gradient(135deg,#6c63ff,#302b63)",
  },
  Adventure: {
    icon: "",
    gradient: "from-orange-700 to-red-800",
    activeGrad: "linear-gradient(135deg,#f5a623,#e8421a)",
  },
  Family: {
    icon: "",
    gradient: "from-green-700 to-teal-800",
    activeGrad: "linear-gradient(135deg,#11998e,#38ef7d)",
  },
  Couple: {
    icon: "",
    gradient: "from-pink-700 to-rose-800",
    activeGrad: "linear-gradient(135deg,#f093fb,#f5576c)",
  },
  Honeymoon: {
    icon: "",
    gradient: "from-fuchsia-700 to-purple-800",
    activeGrad: "linear-gradient(135deg,#c471ed,#f64f59)",
  },
  Religious: {
    icon: "",
    gradient: "from-amber-700 to-yellow-800",
    activeGrad: "linear-gradient(135deg,#f7971e,#ffd200)",
  },
  Beach: {
    icon: "",
    gradient: "from-cyan-700 to-blue-800",
    activeGrad: "linear-gradient(135deg,#43b89c,#00b4db)",
  },
  Hill: {
    icon: "",
    gradient: "from-emerald-700 to-green-800",
    activeGrad: "linear-gradient(135deg,#56ab2f,#a8e063)",
  },
  Wildlife: {
    icon: "",
    gradient: "from-yellow-700 to-amber-800",
    activeGrad: "linear-gradient(135deg,#f7971e,#e65c00)",
  },
};

export default function Tours() {
  const [searchParams, setSearchParams] = useSearchParams();
  const division = searchParams.get("division") || undefined;
  const destination = searchParams.get("destination") || undefined;
  const urlTourType = searchParams.get("tourType") || undefined;

  const [activeCategory, setActiveCategory] = useState(urlTourType || "All");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useGetAllTourQuery({
    division,
    destination,
    tourType: activeCategory !== "All" ? activeCategory : undefined,
  });

  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [toggleWishlist] = useToggleWishlistMutation();

  const myWishlist = Array.isArray(wishlistData)
    ? wishlistData[0]
    : wishlistData;
  const wishlistedTourIds =
    myWishlist?.tours?.map((t: any) => (typeof t === "string" ? t : t._id)) ||
    [];

  const handleToggleWishlist = async (e: React.MouseEvent, tourId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(tourId).unwrap();
      const isWishlisted = wishlistedTourIds.includes(tourId);
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist!",
      );
    } catch (error: any) {
      toast.error("Failed to update wishlist. Please login.");
    }
  };

  // Keep state in sync with URL
  useEffect(() => {
    if (urlTourType && urlTourType !== activeCategory) {
      setActiveCategory(urlTourType);
    }
  }, [urlTourType]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      searchParams.delete("tourType");
    } else {
      searchParams.set("tourType", category);
    }
    setSearchParams(searchParams);
  };

  const filteredTours = data?.filter((tour) =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const meta = CATEGORY_META[activeCategory] || CATEGORY_META["All"];

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background:
          "linear-gradient(180deg,#0f0c29 0%,#1a1740 60%,#0d0d1a 100%)",
      }}
    >
      {/* ── Hero Header ──────────────────────────────── */}
      <div className="relative overflow-hidden pt-20 pb-14 px-4">
        {/* Animated background blobs */}
        <div
          className="absolute -top-24 left-1/4 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle,#6c63ff,transparent)" }}
        />
        <div
          className="absolute -bottom-16 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle,#f093fb,transparent)" }}
        />
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#a5b4fc",
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse inline-block" />
            {filteredTours?.length ?? 0} tours available
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight"
            style={{
              background:
                "linear-gradient(135deg,#fff 0%,#a5b4fc 55%,#f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Find Your Perfect
            <br />
            Tour
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg mb-8"
            style={{ color: "rgba(165,180,252,0.75)" }}
          >
            Explore our wide range of packages tailored just for you.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <span
              className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#a5b4fc" }}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <Input
              type="text"
              placeholder="Search by tour title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-5 text-base rounded-2xl text-white placeholder:text-indigo-300/50 shadow-2xl border-0 focus-visible:ring-2 focus-visible:ring-indigo-400"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.13)",
              }}
            />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* ── Category Chips ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex overflow-x-auto pb-4 mb-10 gap-3 no-scrollbar"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            const cm = CATEGORY_META[category];
            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0"
                style={
                  isActive
                    ? {
                        background: cm.activeGrad,
                        color: "white",
                        boxShadow: "0 4px 20px rgba(108,99,255,0.45)",
                        transform: "translateY(-2px) scale(1.04)",
                        border: "1px solid transparent",
                      }
                    : {
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(165,180,252,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }
                }
              >
                <span className="text-base">{cm.icon}</span>
                {category}
              </button>
            );
          })}
        </motion.div>

        {/* Active category banner */}
        {activeCategory !== "All" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-4 rounded-2xl flex items-center gap-3"
            style={{
              background: `${meta.activeGrad.replace("linear-gradient", "linear-gradient")}20`,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-2xl">{meta.icon}</span>
            <div>
              <p className="text-white font-bold text-sm">
                {activeCategory} Tours
              </p>
              <p className="text-xs" style={{ color: "rgba(165,180,252,0.6)" }}>
                {filteredTours?.length ?? 0} packages found
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-3xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div
            className="text-center p-10 rounded-3xl"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <p className="text-red-400 font-semibold text-lg">
              Failed to load tours. Please try again later.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredTours?.length === 0 && (
          <div className="text-center p-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-bold text-white mb-2">No tours found</p>
            <p style={{ color: "rgba(165,180,252,0.6)" }}>
              Try adjusting your search filters or category.
            </p>
          </div>
        )}

        {/* ── Tour List ────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-col gap-6"
        >
          {filteredTours?.map((item) => (
            <motion.div
              key={item._id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -4 }}
              className="group relative rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
              }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 0 0 1.5px rgba(165,180,252,0.25), 0 0 60px rgba(108,99,255,0.12)",
                }}
              />

              {/* Image Section */}
              <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                <img
                  src={item.images?.[0] || "/placeholder-tour.jpg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full"
                    style={{
                      background:
                        CATEGORY_META[item.tourType]?.activeGrad ||
                        "linear-gradient(135deg,#6c63ff,#302b63)",
                      color: "white",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
                    }}
                  >
                    {CATEGORY_META[item.tourType]?.icon || "🌏"}{" "}
                    {item.tourType || "Standard"}
                  </span>
                  {item.difficulty && (
                    <span
                      className="px-3 py-1 text-xs font-bold rounded-full capitalize"
                      style={{
                        background: "rgba(0,0,0,0.55)",
                        color: "white",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {item.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative">
                {/* Wishlist Heart */}
                <button
                  onClick={(e) => handleToggleWishlist(e, item._id)}
                  className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300`}
                  style={{
                    background: wishlistedTourIds.includes(item._id)
                      ? "rgba(239,68,68,0.15)"
                      : "rgba(255,255,255,0.07)",
                    border: wishlistedTourIds.includes(item._id)
                      ? "1px solid rgba(239,68,68,0.3)"
                      : "1px solid rgba(255,255,255,0.1)",
                    color: wishlistedTourIds.includes(item._id)
                      ? "#f87171"
                      : "rgba(165,180,252,0.5)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={
                      wishlistedTourIds.includes(item._id)
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>

                <div>
                  {/* Title + Price */}
                  <div className="flex justify-between items-start mb-3 pr-12">
                    <h3 className="text-xl md:text-2xl font-extrabold text-white group-hover:text-indigo-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className="text-right shrink-0 ml-4">
                      <span
                        className="block text-2xl font-extrabold"
                        style={{
                          background: "linear-gradient(135deg,#a5b4fc,#f093fb)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        ৳{item.price || item.costFrom || 0}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: "rgba(165,180,252,0.55)" }}
                      >
                        per person
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-sm mb-5 line-clamp-2"
                    style={{ color: "rgba(165,180,252,0.7)" }}
                  >
                    {item.description}
                  </p>

                  {/* Stats grid */}
                  <div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-5 p-4 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {[
                      { label: "Departure", value: item.departureLocation },
                      { label: "Arrival", value: item.arrivalLocation },
                      {
                        label: "Duration",
                        value: `${item.tourPlan?.length || 1} Days`,
                      },
                      { label: "Max Guests", value: `${item.maxGuest} People` },
                    ].map((stat) => (
                      <div key={stat.label} className="flex flex-col">
                        <span
                          className="text-xs font-semibold uppercase tracking-wider mb-1"
                          style={{ color: "rgba(165,180,252,0.45)" }}
                        >
                          {stat.label}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Amenity tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {item.amenities
                      ?.slice(0, 4)
                      .map((amenity: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-medium rounded-lg"
                          style={{
                            background: "rgba(52,211,153,0.1)",
                            color: "#6ee7b7",
                            border: "1px solid rgba(52,211,153,0.2)",
                          }}
                        >
                          ✓ {amenity}
                        </span>
                      ))}
                    {item.amenities?.length > 4 && (
                      <span
                        className="px-3 py-1 text-xs font-medium rounded-lg"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(165,180,252,0.6)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        +{item.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl px-8 text-white font-bold transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "linear-gradient(135deg,#6c63ff,#a855f7)",
                      boxShadow: "0 4px 20px rgba(108,99,255,0.4)",
                      border: "none",
                    }}
                  >
                    <Link to={`/tours/${item._id}`}>View Details →</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
