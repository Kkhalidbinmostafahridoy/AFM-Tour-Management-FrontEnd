/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentFail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get("bookingId");
  const reason = searchParams.get("reason") || "The transaction could not be completed.";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-10 max-w-md w-full text-center shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        {/* Error icon animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="w-24 h-24 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </motion.div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          Payment Failed
        </div>

        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
          Transaction Failed
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {reason} Your booking has been recorded as{" "}
          <span className="text-red-400 font-semibold">FAILED</span>. No
          amount has been deducted from your account.
        </p>

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
            onClick={() => navigate("/tours")}
            className="w-full py-3 px-6 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] font-mono"
          >
            Try Again → Browse Tours
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/user/bookings")}
            className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-slate-700"
          >
            View My Bookings
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
