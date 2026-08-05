/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { baseApi } from "@/redux/features/baseApi";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const bookingId = searchParams.get("bookingId");
  const transactionId = searchParams.get("transactionId") || searchParams.get("tran_id");

  useEffect(() => {
    // Invalidate the BOOKING cache so fresh data is fetched when user navigates to /user/bookings
    dispatch(baseApi.util.invalidateTags(["BOOKING"]));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-10 max-w-md w-full text-center shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        {/* Success checkmark animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.polyline
              points="20 6 9 17 4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </motion.svg>
        </motion.div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Payment Confirmed
        </div>

        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Your payment was processed successfully. Your expedition has been
          secured and your booking is now{" "}
          <span className="text-emerald-400 font-semibold">CONFIRMED</span>.
        </p>

        {transactionId && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-6 text-left">
            <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">
              Transaction ID
            </p>
            <p className="text-cyan-400 font-mono text-sm font-bold break-all">
              {transactionId}
            </p>
          </div>
        )}

        {bookingId && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-6 text-left">
            <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">
              Booking Reference
            </p>
            <p className="text-cyan-400 font-mono text-sm font-bold break-all">
              {bookingId}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/user/bookings")}
            className="w-full py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] font-mono"
          >
            View My Bookings →
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/tours")}
            className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-slate-700"
          >
            Explore More Tours
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
