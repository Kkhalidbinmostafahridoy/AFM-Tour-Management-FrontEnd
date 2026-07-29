import { useState } from "react";
import { useGetAllDestinationsQuery } from "@/redux/features/destination/destination.api";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Destinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: destinations, isLoading, isError } = useGetAllDestinationsQuery(undefined);

  const filteredDestinations = destinations?.filter((dest: any) =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-r from-blue-600 to-indigo-800 flex flex-col items-center justify-center text-white text-center px-4">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Explore Beautiful Destinations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 mb-8"
          >
            Find your next perfect getaway across our premium curated locations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative max-w-xl mx-auto"
          >
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-6 pr-4 text-lg rounded-full bg-white text-gray-900 shadow-xl border-0 focus-visible:ring-2 focus-visible:ring-blue-400"
            />
          </motion.div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="container mx-auto px-4 mt-12 max-w-7xl">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 bg-gray-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center text-red-500 p-8 bg-red-50 rounded-2xl">
            Failed to load destinations. Please try again later.
          </div>
        )}

        {!isLoading && !isError && filteredDestinations?.length === 0 && (
          <div className="text-center text-gray-500 p-12">
            <p className="text-2xl font-semibold mb-2">No destinations found</p>
            <p>Try adjusting your search term.</p>
          </div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredDestinations?.map((dest: any) => (
            <motion.div
              key={dest._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
            >
              <Link to={`/tours?destination=${dest.name}`}>
                {dest.image ? (
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <span className="text-4xl text-blue-300 font-bold opacity-30">
                      {dest.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
                    {dest.division?.name || "Popular"}
                  </span>
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {dest.name}
                  </h3>
                  {dest.description && (
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                      {dest.description}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Destinations;
