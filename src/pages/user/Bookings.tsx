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
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          type: "spring",
          bounce: 0.4,
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative bg-white/90 backdrop-blur-2xl rounded-[2rem] p-6 border-y border-white border-x border-slate-100 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
      >
        {/* Floating 3D shadow layer */}
        <div className="absolute inset-0 bg-indigo-500/10 rounded-[2rem] -z-10 blur-xl group-hover:bg-indigo-500/30 group-hover:blur-2xl transition-all duration-500 transform translate-y-4 translate-z-[-20px]"></div>

        <div
          className="flex flex-col md:flex-row gap-6"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Image Container with 3D Depth */}
          <div
            className="w-full md:w-72 h-56 shrink-0 rounded-2xl overflow-hidden relative shadow-[inset_0_-4px_10px_rgba(0,0,0,0.4)] border border-slate-200"
            style={{ transform: "translateZ(40px)" }}
          >
            {booking.tour?.images?.[0] ? (
              <img
                src={booking.tour.images[0]}
                alt="tour"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center">
                <span
                  className="text-6xl drop-shadow-xl"
                  style={{ transform: "translateZ(20px)" }}
                >
                  🌴
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent"></div>
          </div>

          {/* Content with Layered Z-Depth */}
          <div
            className="flex-1 flex flex-col justify-between py-2"
            style={{ transform: "translateZ(20px)" }}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3
                  className="text-3xl font-extrabold text-slate-800 line-clamp-2 pr-4 drop-shadow-sm"
                  style={{ transform: "translateZ(10px)" }}
                >
                  {booking.tour?.title || "Tour Title Missing"}
                </h3>
                <span
                  className="text-3xl font-black bg-gradient-to-br from-indigo-600 to-purple-700 bg-clip-text text-transparent shrink-0 drop-shadow-sm"
                  style={{ transform: "translateZ(15px)" }}
                >
                  ৳
                  {booking.payment?.amount ||
                    booking.tour?.costFrom * booking.guestCount}
                </span>
              </div>

              <div
                className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600 mb-6"
                style={{ transform: "translateZ(5px)" }}
              >
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-slate-100">
                  <Calendar className="w-5 h-5 text-indigo-500 drop-shadow-sm" />
                  <span>
                    {format(new Date(booking.createdAt), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-slate-100">
                  <Users className="w-5 h-5 text-indigo-500 drop-shadow-sm" />
                  <span>
                    {booking.guestCount} Guest
                    {booking.guestCount > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badges with Extrusion */}
            <div
              className="flex flex-wrap items-center gap-3 pt-5 border-t border-slate-100/50"
              style={{ transform: "translateZ(25px)" }}
            >
              <div
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg border-b-4 transition-colors
                ${isConfirmed ? "bg-emerald-500 text-white border-emerald-700 shadow-emerald-500/40" : ""}
                ${isPending ? "bg-amber-400 text-amber-900 border-amber-600 shadow-amber-400/40" : ""}
                ${isFailed ? "bg-rose-500 text-white border-rose-700 shadow-rose-500/40" : ""}
              `}
              >
                {isConfirmed && <CheckCircle2 className="w-5 h-5" />}
                {isPending && <Clock className="w-5 h-5" />}
                {isFailed && <AlertCircle className="w-5 h-5" />}
                <span className="tracking-wide uppercase">
                  {booking.status}
                </span>
              </div>

              <div
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg border-b-4 transition-colors
                ${isPaid ? "bg-blue-600 text-white border-blue-800 shadow-blue-600/40" : "bg-slate-200 text-slate-700 border-slate-400 shadow-slate-300/40"}
              `}
              >
                <CreditCard className="w-5 h-5" />
                <span className="tracking-wide uppercase">
                  {booking.payment?.status || "PENDING"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function Bookings() {
  const {
    data: bookings,
    isLoading,
    isError,
  } = useGetUserBookingsQuery(undefined);

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
      <div className="p-8 max-w-2xl mx-auto mt-10 text-center text-red-600 bg-red-50/50 backdrop-blur-sm rounded-3xl border border-red-100 py-12 shadow-[0_20px_50px_rgba(255,0,0,0.1)]">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500 opacity-80" />
        <h3 className="text-2xl font-bold mb-2">Oops! Something went wrong</h3>
        <p className="text-red-500/80 text-lg">
          Failed to load your bookings. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen relative">
      {/* 3D Background Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-400/20 rounded-full blur-[120px] -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-5 mb-12"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(79,70,229,0.4)] border border-indigo-400 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
          <Ticket className="w-8 h-8 drop-shadow-md" />
        </div>
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight">
            Booking History
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1 tracking-wide">
            Manage and view your past and upcoming tours
          </p>
        </div>
      </motion.div>

      {!bookings || bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-20 text-center shadow-[0_30px_60px_rgba(0,0,0,0.05)] border-y border-white border-x border-slate-100"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-32 h-32 bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-white"
          >
            <Ticket className="w-16 h-16 text-indigo-400 drop-shadow-xl" />
          </motion.div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
            No Bookings Yet
          </h3>
          <p className="text-slate-500 text-xl max-w-lg mx-auto leading-relaxed">
            You haven't embarked on any adventures with us yet. Your next great
            journey awaits!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-12">
          {bookings.map((booking: any, index: number) => (
            <BookingCard3D key={booking._id} booking={booking} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
