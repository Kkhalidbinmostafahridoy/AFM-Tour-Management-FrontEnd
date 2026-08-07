import PageWrapper from "@/components/layout/PageWrapper";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";

export default function GuideEarnings() {
  const transactions = [
    { id: "TRX-101", date: "Oct 25, 2026", amount: "+$450", status: "Paid", tour: "Sundarban Adventure" },
    { id: "TRX-102", date: "Nov 02, 2026", amount: "+$320", status: "Pending", tour: "Sylhet Tea Gardens" },
    { id: "TRX-103", date: "Sep 15, 2026", amount: "+$600", status: "Paid", tour: "Cox's Bazar Trip" },
  ];

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-inner">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
              Monthly Earnings
            </h1>
            <p className="text-[#9ca3af] mt-1 text-sm">Track your financials and upcoming payouts.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-xl glass-panel">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-gray-300">Total Balance</h3>
          </div>
          <p className="text-5xl font-black text-white">$4,250<span className="text-xl text-gray-500">.00</span></p>
          <div className="mt-6 flex items-center gap-2 text-sm text-emerald-400 font-bold bg-emerald-500/10 w-max px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4" /> +12.5% from last month
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel overflow-hidden p-6" data-cursor="card">
        <h2 className="text-xl font-bold text-white mb-6">Recent Payouts</h2>
        <div className="space-y-3">
          {transactions.map(trx => (
            <div key={trx.id} className="flex justify-between items-center p-4 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <div>
                <p className="font-bold text-white text-lg">{trx.tour}</p>
                <p className="text-sm text-gray-400">{trx.date} • {trx.id}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-black text-xl">{trx.amount}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                  {trx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
