import { useGetWishlistQuery, useToggleWishlistMutation } from "@/redux/features/wishlist/wishlist.api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function Wishlist() {
  const { data: wishlistData, isLoading, isError } = useGetWishlistQuery(undefined);
  const [toggleWishlist] = useToggleWishlistMutation();

  const handleRemove = async (tourId: string) => {
    try {
      await toggleWishlist(tourId).unwrap();
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl">
        Failed to load your wishlist. Please try again later.
      </div>
    );
  }

  // Find the user's wishlist document
  // The API might return an array of wishlists if it's generic, but we expect the query to return just ours
  const myWishlist = Array.isArray(wishlistData) ? wishlistData[0] : wishlistData;
  const savedTours = myWishlist?.tours || [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist ❤️</h1>
      </div>

      {savedTours.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🏜️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save tours you love so you don't lose sight of them.</p>
          <Button asChild className="rounded-full px-8 bg-red-600 hover:bg-red-700">
            <Link to="/tours">Explore Tours</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {savedTours.map((tour: any) => (
              <motion.div
                key={tour._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group relative"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={tour.images?.[0] || "/placeholder-tour.jpg"}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(tour._id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors z-10 shadow-sm"
                  >
                    ✕
                  </button>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-xs font-semibold rounded-md mb-2 inline-block">
                      {tour.tourType}
                    </span>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{tour.title}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                    <span>📍 {tour.location}</span>
                    <span className="font-bold text-blue-600">৳{tour.costFrom}</span>
                  </div>
                  <Button asChild className="w-full rounded-full shadow-md bg-blue-600 hover:bg-blue-700">
                    <Link to={`/tours/${tour._id}`}>View Details</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
