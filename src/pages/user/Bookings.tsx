import { useGetUserBookingsQuery } from "@/redux/features/bookings/bookings.api";
import { format } from "date-fns";
import { motion } from "framer-motion";

function Bookings() {
  const { data: bookings, isLoading, isError } = useGetUserBookingsQuery(undefined);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl">
        Failed to load your bookings. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {!bookings || bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500">You haven't booked any tours yet. Start exploring!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking: any, index: number) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center"
            >
              {/* Image & Basic Info */}
              <div className="flex gap-6 w-full md:w-2/3">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                  {booking.tour?.images?.[0] ? (
                    <img src={booking.tour.images[0]} alt="tour" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🌴</div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.tour?.title || "Tour Title Missing"}</h3>
                  <p className="text-gray-500 text-sm mb-3">
                    Booked on: {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                  </p>
                  <div className="flex gap-4 text-sm font-medium">
                    <span className="text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                      👥 {booking.guestCount} Guest{booking.guestCount > 1 ? "s" : ""}
                    </span>
                    <span className="text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                      Total: ৳{booking.payment?.amount || (booking.tour?.costFrom * booking.guestCount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="w-full md:w-1/3 flex flex-col md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <div className="flex justify-between md:justify-end items-center gap-2">
                    <span className="text-sm text-gray-500">Booking Status:</span>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border
                      ${booking.status === 'COMPLETE' || booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      ${booking.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                      ${booking.status === 'FAILED' || booking.status === 'CANCELED' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                    `}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between md:justify-end items-center gap-2">
                    <span className="text-sm text-gray-500">Payment Status:</span>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border
                      ${booking.payment?.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      ${booking.payment?.status === 'UNPAID' || booking.payment?.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                      ${booking.payment?.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                    `}>
                      {booking.payment?.status || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
