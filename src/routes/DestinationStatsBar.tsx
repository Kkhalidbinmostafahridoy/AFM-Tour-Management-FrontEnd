/* eslint-disable @typescript-eslint/no-unused-vars */
import { MapPin, Compass, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface DestinationStatsBarProps {
  totalDestinations: number;
  totalDivisions: number;
  searchTerm: string;
}

export function DestinationStatsBar({
  totalDestinations,
  totalDivisions,
  searchTerm,
}: DestinationStatsBarProps) {
  const stats = [
    {
      icon: MapPin,
      label: "Destinations",
      value: totalDestinations,
      color: "text-sky-500",
      bg: "bg-sky-50",
    },
    {
      icon: Compass,
      label: "Divisions",
      value: totalDivisions,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      icon: Sparkles,
      label: "Curated",
      value: totalDestinations,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} rounded-2xl p-4 text-center`}
        >
          <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
