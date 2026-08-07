/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetUserBookingsQuery } from "@/redux/features/bookings/bookings.api";
import { format } from "date-fns";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Calendar,
  Users,
  CreditCard,
  Ticket,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import React from "react";

// 3D Card Component for Bookings
const BookingCard3D = ({ booking, index }: { booking: any; index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isConfirmed =
    booking.status === "COMPLETE" || booking.status === "CONFIRMED";
  const isPending = booking.status === "PENDING";
  const isFailed = booking.status === "FAILED" || booking.status === "CANCELED";
  const isPaid = booking.payment?.status === "PAID";

  return (
    <div className="perspective-1000" style={{ perspective: "1200px" }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.5, type: "spring", bounce: 0.4 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative bg-[#222222]/90 backdrop-blur-2xl rounded-[2rem] p-6 border border-[#2a2a2a] transition-all duration-300 glass-panel shadow-2xl"
        whileHover={{ scale: 1.02 }}
        data-cursor="card"
      >
        {/* Floating 3D shadow layer */}
        <div className="absolute inset-0 bg-indigo-500/0 rounded-[2rem] -z-10 blur-xl group-hover:bg-indigo-500/20 group-hover:blur-2xl transition-all duration-500 transform translate-y-4"></div>

        <div className="flex flex-col md:flex-row gap-6" style={{ transform: "translateZ(30px)" }}>
          {/* Image Container with 3D Depth */}
          <div
            className="w-full md:w-72 h-56 shrink-0 rounded-2xl overflow-hidden relative shadow-[inset_0_-4px_10px_rgba(0,0,0,0.6)] border border-[#333]"
            style={{ transform: "translateZ(40px)" }}
          >
            {booking.tour?.images?.[0] ? (
              <img
                src={booking.tour.images[0]}
                alt="tour"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
                <span className="text-6xl drop-shadow-xl" style={{ transform: "translateZ(20px)" }}>🌴</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-[#1a1a1a]/20 to-transparent"></div>
          </div>

          {/* Content with Layered Z-Depth */}
          <div className="flex-1 flex flex-col justify-between py-2" style={{ transform: "translateZ(20px)" }}>
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3
                  className="text-2xl font-extrabold text-white line-clamp-2 pr-4 drop-shadow-sm"
                  style={{ transform: "translateZ(10px)" }}
                >
                  {booking.tour?.title || "Tour Title Missing"}
                </h3>
                <span
                  className="text-2xl font-black bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent shrink-0"
                  style={{ transform: "translateZ(15px)" }}
                >
                  ৳{booking.payment?.amount || booking.tour?.costFrom * booking.guestCount}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-400 mb-6" style={{ transform: "translateZ(5px)" }}>
                <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#333]">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>{format(new Date(booking.createdAt), "MMMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#333]">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>{booking.guestCount} Guest{booking.guestCount > 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[#2a2a2a]" style={{ transform: "translateZ(25px)" }}>
              <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors
                ${isConfirmed ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : ""}
                ${isPending ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : ""}
                ${isFailed ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : ""}
              `}>
                {isConfirmed && <CheckCircle2 className="w-4 h-4" />}
                {isPending && <Clock className="w-4 h-4" />}
                {isFailed && <AlertCircle className="w-4 h-4" />}
                <span>{booking.status}</span>
              </div>

              <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors
                ${isPaid ? "bg-blue-500/10 text-blue-400 border-blue-500/30" : "bg-[#1a1a1a] text-gray-500 border-[#333]"}
              `}>
                <CreditCard className="w-4 h-4" />
                <span>{booking.payment?.status || "PENDING"}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function Bookings() {
  const { data: bookings, isLoading, isError } = useGetUserBookingsQuery(undefined);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24" style={{ perspective: "500px" }}>
          <motion.div
            animate={{ rotateX: 360, rotateY: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto shadow-2xl shadow-indigo-500/50"
          ></motion.div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-10 text-center text-rose-500 bg-[#222222] rounded-3xl border border-[#2a2a2a] py-12 shadow-2xl glass-panel">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-rose-500 opacity-80" />
        <h3 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h3>
        <p className="text-rose-400/80 text-lg">Failed to load your bookings. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen relative">
      {/* 3D Background Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="flex items-center gap-5 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-[#222222] border border-[#2a2a2a] text-indigo-400 flex items-center justify-center shadow-xl glass-panel hover-3d-tilt" data-cursor="card">
          <Ticket className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 tracking-tight">
            Booking History
          </h1>
          <p className="text-[#9ca3af] font-medium text-lg mt-1 tracking-wide">
            Manage and view your past and upcoming tours
          </p>
        </div>
      </div>

      {!bookings || bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-[#222222] rounded-[3rem] p-20 text-center shadow-2xl border border-[#2a2a2a] glass-panel hover-3d-tilt"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-32 h-32 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-[#333]"
          >
            <Ticket className="w-16 h-16 text-indigo-400 drop-shadow-xl" />
          </motion.div>
          <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">No Bookings Yet</h3>
          <p className="text-gray-400 text-xl max-w-lg mx-auto leading-relaxed">
            You haven't embarked on any adventures with us yet. Your next great journey awaits!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking: any, index: number) => (
            <BookingCard3D key={booking._id} booking={booking} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
export default Bookings;
