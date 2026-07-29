import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetAllTourQuery } from "@/redux/features/Tour/tour.api";
import { useGetWishlistQuery, useToggleWishlistMutation } from "@/redux/features/wishlist/wishlist.api";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

const CATEGORIES = [
  "All",
  "Adventure",
  "Family",
  "Couple",
  "Honeymoon",
  "Religious",
  "Beach",
  "Hill",
  "Wildlife",
];

export default function Tours() {
  const [searchParams, setSearchParams] = useSearchParams();
  const division = searchParams.get("division") || undefined;
  const destination = searchParams.get("destination") || undefined;
  const urlTourType = searchParams.get("tourType") || undefined;

  const [activeCategory, setActiveCategory] = useState(urlTourType || "All");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useGetAllTourQuery({
    division,
    destination,
    tourType: activeCategory !== "All" ? activeCategory : undefined,
  });

  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [toggleWishlist] = useToggleWishlistMutation();

  const myWishlist = Array.isArray(wishlistData) ? wishlistData[0] : wishlistData;
  const wishlistedTourIds = myWishlist?.tours?.map((t: any) => typeof t === 'string' ? t : t._id) || [];

  const handleToggleWishlist = async (e: React.MouseEvent, tourId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(tourId).unwrap();
      const isWishlisted = wishlistedTourIds.includes(tourId);
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
    } catch (error) {
      toast.error("Failed to update wishlist. Please login.");
    }
  };

  // Keep state in sync with URL
  useEffect(() => {
    if (urlTourType && urlTourType !== activeCategory) {
      setActiveCategory(urlTourType);
    }
  }, [urlTourType]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      searchParams.delete("tourType");
    } else {
      searchParams.set("tourType", category);
    }
    setSearchParams(searchParams);
  };

  const filteredTours = data?.filter((tour) =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Tour</h1>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Explore our wide range of packages tailored just for you. From relaxing beaches to thrilling adventures, we have it all.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <Input
            type="text"
            placeholder="Search by tour title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 pl-6 pr-4 text-lg rounded-full bg-white text-gray-900 shadow-xl border-0 focus-visible:ring-2 focus-visible:ring-blue-400"
          />
        </div>
      </div>

      <div className="container mx-auto px-5 py-8 max-w-7xl">
        {/* Category Chips */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-3 no-scrollbar">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex flex-col gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center text-red-500 p-8 bg-red-50 rounded-2xl">
            Failed to load tours. Please try again later.
          </div>
        )}

        {!isLoading && !isError && filteredTours?.length === 0 && (
          <div className="text-center text-gray-500 p-12">
            <p className="text-2xl font-semibold mb-2">No tours found</p>
            <p>Try adjusting your search filters or category.</p>
          </div>
        )}

        {/* Tour List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-col gap-8"
        >
          {filteredTours?.map((item) => (
            <motion.div
              key={item._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row group"
            >
              {/* Image Section */}
              <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                <img
                  src={item.images?.[0] || "/placeholder-tour.jpg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold rounded-full shadow-sm">
                    {item.tourType || "Standard"}
                  </span>
                  {item.difficulty && (
                    <span className="px-3 py-1 bg-black/60 backdrop-blur text-white text-xs font-bold rounded-full shadow-sm capitalize">
                      {item.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative">
                
                {/* Wishlist Heart on Card */}
                <button
                  onClick={(e) => handleToggleWishlist(e, item._id)}
                  className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm
                    ${wishlistedTourIds.includes(item._id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={wishlistedTourIds.includes(item._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                </button>

                <div>
                  <div className="flex justify-between items-start mb-2 pr-12">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="text-right">
                      <span className="block text-2xl font-bold text-blue-600">
                        ৳{item.price || item.costFrom || 0}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">per person</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2 text-sm text-gray-700 mb-6 bg-gray-50 p-4 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Departure</span>
                      <span className="font-semibold">{item.departureLocation}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Arrival</span>
                      <span className="font-semibold">{item.arrivalLocation}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Duration</span>
                      <span className="font-semibold">{item.tourPlan?.length || 1} Days</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Max Guests</span>
                      <span className="font-semibold">{item.maxGuest} People</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.amenities?.slice(0, 4).map((amenity: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md border border-green-100"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                    {item.amenities?.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                        +{item.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button asChild size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                    <Link to={`/tours/${item._id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
