import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetAllTourQuery } from "@/redux/features/Tour/tour.api";
import { useGetSchedulesByTourQuery } from "@/redux/features/schedule/schedule.api";
import { useGetWishlistQuery, useToggleWishlistMutation } from "@/redux/features/wishlist/wishlist.api";
import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CATEGORY_GRAD: Record<string, string> = {
  Adventure: "linear-gradient(135deg,#f5a623,#e8421a)",
  Family:    "linear-gradient(135deg,#11998e,#38ef7d)",
  Couple:    "linear-gradient(135deg,#f093fb,#f5576c)",
  Honeymoon: "linear-gradient(135deg,#c471ed,#f64f59)",
  Religious: "linear-gradient(135deg,#f7971e,#ffd200)",
  Beach:     "linear-gradient(135deg,#43b89c,#00b4db)",
  Hill:      "linear-gradient(135deg,#56ab2f,#a8e063)",
  Wildlife:  "linear-gradient(135deg,#f7971e,#e65c00)",
};

const CATEGORY_ICON: Record<string, string> = {
  Adventure: "🏔️", Family: "👨‍👩‍👧‍👦", Couple: "💑",
  Honeymoon: "💍", Religious: "🕌", Beach: "🏖️", Hill: "⛰️", Wildlife: "🦁",
};

function TourDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImage, setActiveImage] = useState(0);

  const { data: tourDataArray, isLoading, isError } = useGetAllTourQuery({ _id: id });
  const { data: schedules } = useGetSchedulesByTourQuery(id || "", { skip: !id });
  const { data: userInfo } = useUserInfoQuery(undefined);
  const isAuthenticated = !!userInfo?.data?.email;

  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [toggleWishlist] = useToggleWishlistMutation();

  const tourData = tourDataArray?.[0] || tourDataArray?.find((t: any) => t._id === id);

  const myWishlist = Array.isArray(wishlistData) ? wishlistData[0] : wishlistData;
  const isWishlisted = myWishlist?.tours?.some((t: any) =>
    (typeof t === 'string' ? t : t._id) === id
  );

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(id!).unwrap();
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
    } catch (error) {
      toast.error("Failed to update wishlist. Please login.");
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-transparent border-t-indigo-400 animate-spin" />
          <p className="text-indigo-300 font-medium">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (isError || !tourData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)" }}
      >
        <div
          className="text-center p-10 rounded-3xl max-w-md"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(16px)" }}
        >
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Tour Not Found</h2>
          <p className="mb-6" style={{ color: "rgba(165,180,252,0.7)" }}>
            The tour you are looking for does not exist or has been removed.
          </p>
          <Button asChild style={{ background: "linear-gradient(135deg,#6c63ff,#a855f7)", border: "none" }}>
            <Link to="/tours">Browse All Tours</Link>
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "itinerary", label: "Itinerary", icon: "🗓️" },
    { id: "includes", label: "Included/Excluded", icon: "✅" },
    { id: "gallery", label: "Gallery", icon: "🖼️" },
  ];

  const catGrad = CATEGORY_GRAD[tourData.tourType] || "linear-gradient(135deg,#6c63ff,#302b63)";
  const catIcon = CATEGORY_ICON[tourData.tourType] || "🌏";

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(180deg,#0f0c29 0%,#1a1740 60%,#0d0d1a 100%)" }}>
      {/* ── Hero Image ───────────────────────────────── */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <img
          src={tourData.images?.[activeImage] || "/placeholder-tour.jpg"}
          alt={tourData.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        />
        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29] via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Thumbnail strip (if multiple images) */}
        {tourData.images && tourData.images.length > 1 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
            {tourData.images.slice(0, 5).map((_: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === activeImage ? "white" : "rgba(255,255,255,0.35)",
                  transform: i === activeImage ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-5 pb-14 max-w-7xl w-full">
            <div className="text-white max-w-3xl">
              {/* Category + Location badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mb-4"
              >
                <span
                  className="px-4 py-1.5 text-sm font-bold rounded-full"
                  style={{ background: catGrad, color: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
                >
                  {catIcon} {tourData.tourType}
                </span>
                <span
                  className="px-4 py-1.5 text-sm font-medium rounded-full"
                  style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  📍 {tourData.location || tourData.arrivalLocation}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-extrabold mb-3 leading-tight"
                style={{ textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}
              >
                {tourData.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-base text-gray-300 line-clamp-2"
              >
                {tourData.description}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">

          {/* ── Main Content ─────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* Tabs */}
            <div
              className="flex overflow-x-auto mb-8 no-scrollbar rounded-2xl p-1 gap-1"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-5 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 rounded-xl flex-1 justify-center"
                  style={
                    activeTab === tab.id
                      ? { background: "linear-gradient(135deg,#6c63ff,#a855f7)", color: "white", boxShadow: "0 4px 14px rgba(108,99,255,0.4)" }
                      : { color: "rgba(165,180,252,0.6)" }
                  }
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.22 }}
                >
                  {/* OVERVIEW TAB */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Stats grid */}
                      <div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {[
                          { label: "Duration", value: `${tourData.tourPlan?.length || 1} Days`, icon: "📅" },
                          { label: "Max Guests", value: `${tourData.maxGuest}`, icon: "👥" },
                          { label: "Min Age", value: `${tourData.minAge}+`, icon: "🎂" },
                          { label: "Departure", value: tourData.departureLocation, icon: "🛫" },
                        ].map((stat) => (
                          <div key={stat.label} className="text-center">
                            <div className="text-2xl mb-1">{stat.icon}</div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(165,180,252,0.5)" }}>
                              {stat.label}
                            </p>
                            <p className="text-lg font-extrabold text-white">{stat.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Highlights */}
                      <div>
                        <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
                          <span
                            className="w-1 h-6 rounded-full inline-block"
                            style={{ background: "linear-gradient(180deg,#6c63ff,#a855f7)" }}
                          />
                          Tour Highlights
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {tourData.amenities?.map((item: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-center gap-3 p-4 rounded-2xl"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.07)",
                              }}
                            >
                              <span
                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{ background: "rgba(52,211,153,0.15)", color: "#6ee7b7" }}
                              >
                                ✓
                              </span>
                              <span className="text-sm font-medium text-white">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* ITINERARY TAB */}
                  {activeTab === "itinerary" && (
                    <div className="relative pl-8">
                      {/* Vertical line */}
                      <div
                        className="absolute left-3.5 top-0 bottom-0 w-0.5"
                        style={{ background: "linear-gradient(180deg,#6c63ff,#a855f7,transparent)" }}
                      />
                      <div className="space-y-6">
                        {tourData.tourPlan?.map((plan: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.07 }}
                            className="relative flex gap-5"
                          >
                            {/* Circle marker */}
                            <div
                              className="absolute -left-8 w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                              style={{
                                background: "linear-gradient(135deg,#6c63ff,#a855f7)",
                                boxShadow: "0 0 16px rgba(108,99,255,0.6)",
                                border: "2px solid rgba(255,255,255,0.2)",
                              }}
                            >
                              {index + 1}
                            </div>
                            <div
                              className="flex-1 p-5 rounded-2xl"
                              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                              <h4
                                className="font-extrabold text-base mb-2"
                                style={{
                                  background: "linear-gradient(135deg,#a5b4fc,#f093fb)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                }}
                              >
                                Day {index + 1}
                              </h4>
                              <p className="text-sm" style={{ color: "rgba(165,180,252,0.75)" }}>{plan}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* INCLUDES TAB */}
                  {activeTab === "includes" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        className="p-6 rounded-3xl"
                        style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}
                      >
                        <h3 className="text-xl font-extrabold mb-5 text-emerald-400 flex items-center gap-2">
                          ✅ Included
                        </h3>
                        <ul className="space-y-3">
                          {tourData.included?.map((item: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm" style={{ color: "rgba(165,180,252,0.8)" }}>
                              <span className="text-emerald-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                              {item}
                            </li>
                          )) || <p className="text-sm italic" style={{ color: "rgba(165,180,252,0.45)" }}>No inclusions specified.</p>}
                        </ul>
                      </div>

                      <div
                        className="p-6 rounded-3xl"
                        style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
                      >
                        <h3 className="text-xl font-extrabold mb-5 text-red-400 flex items-center gap-2">
                          ❌ Excluded
                        </h3>
                        <ul className="space-y-3">
                          {tourData.excluded?.map((item: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm" style={{ color: "rgba(165,180,252,0.8)" }}>
                              <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">✗</span>
                              {item}
                            </li>
                          )) || <p className="text-sm italic" style={{ color: "rgba(165,180,252,0.45)" }}>No exclusions specified.</p>}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* GALLERY TAB */}
                  {activeTab === "gallery" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {tourData.images?.map((img: string, i: number) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.03 }}
                          onClick={() => setActiveImage(i)}
                          className="aspect-square rounded-2xl overflow-hidden cursor-pointer group relative"
                          style={{ border: i === activeImage ? "2px solid #6c63ff" : "2px solid rgba(255,255,255,0.08)" }}
                        >
                          <img
                            src={img}
                            alt={`Gallery ${i}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {i === activeImage && (
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ background: "rgba(108,99,255,0.3)" }}
                            >
                              <span className="text-white font-bold text-xs bg-indigo-600 px-2 py-1 rounded-full">Active</span>
                            </div>
                          )}
                        </motion.div>
                      )) || (
                        <p className="col-span-full text-center py-12" style={{ color: "rgba(165,180,252,0.45)" }}>
                          No gallery images available.
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Sidebar / Booking Box ─────────────────── */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-28 rounded-3xl p-7"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Price */}
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(165,180,252,0.5)" }}>
                  Starting from
                </span>
                <div className="mt-1 flex items-end gap-2">
                  <span
                    className="text-4xl font-extrabold"
                    style={{
                      background: "linear-gradient(135deg,#a5b4fc,#f093fb)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ৳{tourData.price || tourData.costFrom || 0}
                  </span>
                  <span className="text-sm pb-1" style={{ color: "rgba(165,180,252,0.55)" }}>/person</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* Schedules */}
              {schedules && schedules.length > 0 ? (
                <div className="mb-6 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">Available Dates</p>
                  {schedules.map((schedule: any) => (
                    <div
                      key={schedule._id}
                      className="flex justify-between items-center p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <div className="text-sm">
                        <p className="font-semibold text-white">{format(new Date(schedule.startDate), "MMM dd, yyyy")}</p>
                        <p className="text-xs" style={{ color: "rgba(165,180,252,0.55)" }}>{schedule.availableSeats} seats left</p>
                      </div>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={
                          schedule.availableSeats > 0
                            ? { background: "rgba(52,211,153,0.15)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.2)" }
                            : { background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }
                        }
                      >
                        {schedule.availableSeats > 0 ? "Open" : "Full"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="mb-6 p-4 rounded-xl text-sm"
                  style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)", color: "#fcd34d" }}
                >
                  <p className="font-bold mb-1">📅 Flexible Dates</p>
                  <p style={{ color: "rgba(252,211,77,0.7)" }}>
                    {tourData.startDate && format(new Date(tourData.startDate), "MMM dd")} -{" "}
                    {tourData.endDate && format(new Date(tourData.endDate), "MMM dd, yyyy")}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  asChild
                  className="flex-1 h-14 text-base font-bold rounded-2xl text-white transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg,#6c63ff,#a855f7)",
                    boxShadow: "0 4px 24px rgba(108,99,255,0.45)",
                    border: "none",
                  }}
                >
                  <Link to={isAuthenticated ? `/bookings/${tourData._id}` : "/login"} state={{ from: `/bookings/${tourData._id}` }}>
                    Book This Tour
                  </Link>
                </Button>
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                  style={
                    isWishlisted
                      ? { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(165,180,252,0.5)" }
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </Button>
              </div>
              <p className="text-center text-xs mt-4" style={{ color: "rgba(165,180,252,0.35)" }}>You won't be charged yet</p>

              {/* Tour type badge */}
              <div
                className="mt-5 p-3 rounded-2xl text-center text-sm font-bold"
                style={{ background: catGrad, color: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}
              >
                {catIcon} {tourData.tourType || "Standard"} Tour
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourDetails;
