import { motion } from "framer-motion";
import { X } from "lucide-react";

interface DivisionFilterProps {
  divisions: string[];
  selected: string;
  onSelect: (division: string) => void;
}

export function DivisionFilter({
  divisions,
  selected,
  onSelect,
}: DivisionFilterProps) {
  if (divisions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-gray-600 mr-1">Filter:</span>

      <button
        onClick={() => onSelect("")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
          selected === ""
            ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200"
            : "bg-white text-gray-600 border-gray-200 hover:border-sky-300 hover:text-sky-600"
        }`}
      >
        All
      </button>

      {divisions.map((division) => (
        <motion.button
          key={division}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(division)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            selected === division
              ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200"
              : "bg-white text-gray-600 border-gray-200 hover:border-sky-300 hover:text-sky-600"
          }`}
        >
          {division}
          {selected === division && (
            <X className="w-3.5 h-3.5 inline-block ml-1 -mr-1" />
          )}
        </motion.button>
      ))}
    </div>
  );
}
