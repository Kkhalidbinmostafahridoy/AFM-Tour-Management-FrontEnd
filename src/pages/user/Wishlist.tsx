/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "@/redux/features/wishlist/wishlist.api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Heart, MapPin, Search, Trash2, Map } from "lucide-react";
import React from "react";

// 3D Card Component for Wishlist
const WishlistCard3D = ({
  tour,
  handleRemove,
  index,
}: {
  tour: any;
  handleRemove: (id: string) => void;
  index: number;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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

  return (
    <div className="perspective-1000" style={{ perspective: "1200px" }}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        transition={{ delay: index * 0.05, type: "spring", bounce: 0.4 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        className="bg-[#222222]/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#2a2a2a] overflow-hidden group transition-all duration-300 flex flex-col relative glass-panel"
        data-cursor="card"
      >
        {/* Glowing 3D backdrop */}
        <div className="absolute inset-0 bg-rose-500/0 rounded-[2rem] -z-10 blur-xl group-hover:bg-rose-500/20 group-hover:blur-2xl transition-all duration-500 transform translate-y-4 translate-z-[-20px]"></div>

        <div
          className="h-64 relative overflow-hidden rounded-t-[2rem] border-b border-[#2a2a2a]"
          style={{ transform: "translateZ(30px)" }}
        >
          <img
            src={tour.images?.[0] || "/placeholder-tour.jpg"}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/40 to-transparent" />

          {/* Remove Button with Depth */}
          <button
            onClick={() => handleRemove(tour._id)}
            className="absolute top-4 right-4 w-12 h-12 bg-[#222222]/80 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-rose-600 hover:text-white transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0 shadow-lg border border-[#333]"
            title="Remove from wishlist"
            style={{ transform: "translateZ(50px)" }}
            data-cursor="button"
          >
            <Trash2 className="w-5 h-5 drop-shadow-md" />
          </button>

          <div
            className="absolute bottom-5 left-6 right-6"
            style={{ transform: "translateZ(40px)" }}
          >
            <span className="px-3 py-1.5 bg-[#222222]/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-xl mb-3 inline-flex items-center gap-1.5 border border-[#333] shadow-md">
              <Map className="w-3 h-3" /> {tour.tourType}
            </span>
            <h3 className="text-2xl font-black text-white line-clamp-2 leading-tight drop-shadow-xl">
              {tour.title}
            </h3>
          </div>
        </div>

        <div
          className="p-6 flex flex-col flex-1 bg-[#222222]"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex justify-between items-end mb-8 text-sm flex-1">
            <div className="flex items-center gap-2 text-gray-400 font-medium max-w-[55%] bg-[#1a1a1a] px-3 py-2 rounded-xl border border-[#2a2a2a] shadow-inner">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 drop-shadow-sm" />
              <span className="truncate">{tour.location}</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                From
              </p>
              <span className="text-2xl font-black bg-gradient-to-br from-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                ৳{tour.costFrom}
              </span>
            </div>
          </div>
          <Button
            asChild
            className="w-full rounded-2xl h-14 shadow-[0_10px_20px_rgba(225,29,72,0.2)] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-[0_15px_30px_rgba(225,29,72,0.4)] border border-rose-500/50 text-base"
            style={{ transform: "translateZ(10px)" }}
          >
            <Link to={`/tours/${tour._id}`}>Explore Tour Details</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

function Wishlist() {
  const {
    data: wishlistData,
    isLoading,
    isError,
  } = useGetWishlistQuery(undefined);
  const [toggleWishlist] = useToggleWishlistMutation();

  const handleRemove = async (tourId: string) => {
    try {
      await toggleWishlist(tourId).unwrap();
      toast.success("Removed from wishlist", {
        icon: <Heart className="text-rose-500 w-4 h-4 fill-rose-500" />,
        className: "bg-[#222222] border border-rose-500/20 text-white",
      });
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24" style={{ perspective: "500px" }}>
          <motion.div
            animate={{ rotateX: 360, rotateY: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl mx-auto shadow-2xl shadow-rose-500/50"
          ></motion.div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-10 text-center text-rose-500 bg-[#222222] rounded-3xl border border-[#2a2a2a] py-12 shadow-2xl glass-panel">
        <h3 className="text-2xl font-bold mb-2">Oops! Something went wrong</h3>
        <p className="text-rose-400/80 text-lg">
          Failed to load your wishlist. Please try again later.
        </p>
      </div>
    );
  }

  const myWishlist = Array.isArray(wishlistData)
    ? wishlistData[0]
    : wishlistData;
  const savedTours = myWishlist?.tours || [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen relative">
      {/* 3D Background Decorative Elements */}
      <div className="absolute top-0 right-20 w-72 h-72 bg-rose-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      <div className="flex items-center gap-5 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-[#222222] border border-[#2a2a2a] text-rose-400 flex items-center justify-center shadow-xl glass-panel hover-3d-tilt" data-cursor="card">
          <Heart className="w-8 h-8 fill-rose-500/20 text-rose-400" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 tracking-tight">
            My Wishlist
          </h1>
          <p className="text-[#9ca3af] font-medium text-lg mt-1 tracking-wide">
            Your curated collection of dream destinations
          </p>
        </div>
      </div>

      {savedTours.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-[#222222] rounded-[3rem] p-20 text-center shadow-2xl border border-[#2a2a2a] max-w-3xl mx-auto glass-panel hover-3d-tilt"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotateY: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-32 h-32 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-[#333] relative"
          >
            <Heart className="w-16 h-16 text-rose-500/20 absolute fill-rose-500/10" />
            <Search className="w-16 h-16 text-rose-500 absolute translate-x-4 translate-y-4 drop-shadow-lg" />
          </motion.div>
          <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
            Your wishlist is empty
          </h3>
          <p className="text-gray-400 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            Discover incredible destinations and save them here so you never
            lose sight of your next adventure.
          </p>
          <Button
            asChild
            className="rounded-2xl px-12 h-14 text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-[0_10px_30px_rgba(225,29,72,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(225,29,72,0.5)] border border-rose-500"
          >
            <Link to="/tours">Explore Tours</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {savedTours.map((tour: any, index: number) => (
              <WishlistCard3D
                key={tour._id}
                tour={tour}
                handleRemove={handleRemove}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
