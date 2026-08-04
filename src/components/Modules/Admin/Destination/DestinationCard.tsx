import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Destination } from "@/types/destination";
import { MapPin, Star, ChevronRight } from "lucide-react";

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

export function DestinationCard({
  destination: dest,
  index,
}: DestinationCardProps) {
  const initials = dest.name.substring(0, 2).toUpperCase();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative h-[340px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
    >
      <Link
        to={`/tours?destination=${encodeURIComponent(dest.name)}`}
        className="block h-full w-full"
      >
        {/* Image */}
        {dest.image ? (
          <img
            src={dest.image}
            alt={dest.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-indigo-200 to-purple-200 flex items-center justify-center">
            <span className="text-6xl font-black text-white/30 select-none">
              {initials}
            </span>
          </div>
        )}

        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            {dest.division?.name && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/15 backdrop-blur-sm text-white text-[11px] font-semibold rounded-full uppercase tracking-widest">
                <MapPin className="w-3 h-3" />
                {dest.division.name}
              </span>
            )}
            {dest.rating && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-400/20 backdrop-blur-sm text-amber-300 text-[11px] font-bold rounded-full">
                <Star className="w-3 h-3 fill-amber-400" />
                {dest.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors duration-300 line-clamp-1">
            {dest.name}
          </h3>

          {/* Description */}
          {dest.description && (
            <p className="text-gray-300/90 text-sm mt-1.5 line-clamp-2 leading-relaxed">
              {dest.description}
            </p>
          )}

          {/* Tour count & CTA */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            {dest.tourCount !== undefined && (
              <span className="text-xs text-gray-400 font-medium">
                {dest.tourCount} tour{dest.tourCount !== 1 ? "s" : ""} available
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:text-sky-300 transition-colors ml-auto">
              Explore
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Top-right index badge */}
        <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 text-xs font-bold">
          {String(index + 1).padStart(2, "0")}
        </div>
      </Link>
    </motion.div>
  );
}
