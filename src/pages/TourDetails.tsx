import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetAllTourQuery } from "@/redux/features/Tour/tour.api";
import { useGetSchedulesByTourQuery } from "@/redux/features/schedule/schedule.api";
import { useGetWishlistQuery, useToggleWishlistMutation } from "@/redux/features/wishlist/wishlist.api";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

function TourDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: tourDataArray, isLoading, isError } = useGetAllTourQuery({ _id: id });
  const { data: schedules } = useGetSchedulesByTourQuery(id || "", { skip: !id });
  
  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [toggleWishlist] = useToggleWishlistMutation();

  const tourData = tourDataArray?.[0] || tourDataArray?.find((t: any) => t._id === id);

  const myWishlist = Array.isArray(wishlistData) ? wishlistData[0] : wishlistData;
  const isWishlisted = myWishlist?.tours?.some((t: any) => 
    (typeof t === 'string' ? t : t._id) === id
  );

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(id!).unwrap();
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
    } catch (error) {
      toast.error("Failed to update wishlist. Please login.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !tourData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Not Found</h2>
          <p className="text-gray-500 mb-6">The tour you are looking for does not exist or has been removed.</p>
          <Button asChild><Link to="/tours">Browse All Tours</Link></Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "includes", label: "Included/Excluded" },
    { id: "gallery", label: "Gallery" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] w-full">
        <img
          src={tourData.images?.[0] || "/placeholder-tour.jpg"}
          alt={tourData.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-5 pb-12 max-w-7xl w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="text-white max-w-3xl">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-600/80 backdrop-blur text-white text-sm font-bold rounded-full">
                    {tourData.tourType}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-sm font-medium rounded-full">
                    📍 {tourData.location || tourData.arrivalLocation}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{tourData.title}</h1>
                <p className="text-lg text-gray-200 line-clamp-2 md:line-clamp-none">{tourData.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 mb-8 no-scrollbar sticky top-0 bg-gray-50 z-10 pt-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                    activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* OVERVIEW TAB */}
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">Duration</p>
                          <p className="text-lg font-bold">{tourData.tourPlan?.length || 1} Days</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">Max Guests</p>
                          <p className="text-lg font-bold">{tourData.maxGuest}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">Min Age</p>
                          <p className="text-lg font-bold">{tourData.minAge}+</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">Departure</p>
                          <p className="text-lg font-bold">{tourData.departureLocation}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold mb-4">Highlights</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {tourData.amenities?.map((item: string, i: number) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700 bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                              <span className="flex-shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* ITINERARY TAB */}
                  {activeTab === "itinerary" && (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                      {tourData.tourPlan?.map((plan: string, index: number) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            {index + 1}
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-lg text-blue-600 mb-2">Day {index + 1}</h4>
                            <p className="text-gray-600">{plan}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* INCLUDES TAB */}
                  {activeTab === "includes" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                          <span className="text-green-500">✓</span> Included
                        </h3>
                        <ul className="space-y-4">
                          {tourData.included?.map((item: string, i: number) => (
                            <li key={i} className="flex gap-3 text-gray-700">
                              <span className="text-green-500 font-bold mt-1">✓</span> {item}
                            </li>
                          )) || <p className="text-gray-500 italic">No inclusions specified.</p>}
                        </ul>
                      </div>
                      
                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                          <span className="text-red-500">✗</span> Excluded
                        </h3>
                        <ul className="space-y-4">
                          {tourData.excluded?.map((item: string, i: number) => (
                            <li key={i} className="flex gap-3 text-gray-700">
                              <span className="text-red-500 font-bold mt-1">✗</span> {item}
                            </li>
                          )) || <p className="text-gray-500 italic">No exclusions specified.</p>}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* GALLERY TAB */}
                  {activeTab === "gallery" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {tourData.images?.map((img: string, i: number) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden cursor-pointer group">
                          <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                      )) || <p className="col-span-full text-center text-gray-500 py-12">No gallery images available.</p>}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar / Booking Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="mb-6">
                <span className="text-gray-500 text-sm font-medium">Starting from</span>
                <div className="text-4xl font-bold text-gray-900 mt-1">
                  ৳{tourData.price || tourData.costFrom || 0}
                  <span className="text-lg text-gray-500 font-normal"> /person</span>
                </div>
              </div>

              {schedules && schedules.length > 0 ? (
                <div className="mb-6 space-y-3">
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Available Dates</p>
                  {schedules.map((schedule: any) => (
                    <div key={schedule._id} className="flex justify-between items-center p-3 border border-gray-200 rounded-xl bg-gray-50">
                      <div className="text-sm">
                        <p className="font-semibold">{format(new Date(schedule.startDate), "MMM dd, yyyy")}</p>
                        <p className="text-gray-500">{schedule.availableSeats} seats left</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${schedule.availableSeats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {schedule.availableSeats > 0 ? 'Open' : 'Full'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-6 p-4 bg-orange-50 text-orange-800 rounded-xl text-sm border border-orange-100">
                  <p className="font-semibold mb-1">Dates are flexible</p>
                  <p>
                    {tourData.startDate && format(new Date(tourData.startDate), "MMM dd")} - {tourData.endDate && format(new Date(tourData.endDate), "MMM dd, yyyy")}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button asChild className="flex-1 h-14 text-lg rounded-full shadow-lg shadow-blue-200 bg-blue-600 hover:bg-blue-700 transition-all hover:-translate-y-1">
                  <Link to={`/bookings/${tourData._id}`}>Book This Tour</Link>
                </Button>
                <Button 
                  onClick={handleToggleWishlist}
                  variant="outline" 
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                </Button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourDetails;
