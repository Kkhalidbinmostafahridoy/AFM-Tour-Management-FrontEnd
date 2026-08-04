// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useCreateBookingMutation } from "@/redux/features/bookings/bookings.api";
// import { useGetAllTourQuery } from "@/redux/features/Tour/tour.api";
// import { useGetAllHotelsQuery } from "@/redux/features/hotel/hotel.api";
// import { useGetAllTransportsQuery } from "@/redux/features/transport/transport.api";
// import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";

// interface ITraveler {
//   name: string;
//   passport?: string;
//   nationality?: string;
//   gender?: "Male" | "Female" | "Other";
//   emergencyContact?: string;
// }

// export default function Bookings() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const {
//     data: tourDataArray,
//     isLoading: isTourLoading,
//     isError: isTourError,
//   } = useGetAllTourQuery({ _id: id });
//   const { isLoading: isUserLoading } = useUserInfoQuery(undefined);

//   const { data: hotelsData } = useGetAllHotelsQuery(undefined);
//   const { data: transportsData } = useGetAllTransportsQuery(undefined);

//   const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

//   const tourData = tourDataArray?.[0];
//   const hotels = hotelsData || [];
//   const transports = transportsData || [];

//   const [step, setStep] = useState(1);
//   const [guestCount, setGuestCount] = useState(1);
//   const [travelers, setTravelers] = useState<ITraveler[]>([
//     { name: "", gender: "Male" },
//   ]);

//   const [selectedHotel, setSelectedHotel] = useState<any>(null);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [selectedTransport, setSelectedTransport] = useState<any>(null);

//   const [couponCode, setCouponCode] = useState("");
//   const [discount, setDiscount] = useState(0);

//   // Sync travelers array with guest count
//   useEffect(() => {
//     setTravelers((prev) => {
//       const updated = [...prev];
//       if (updated.length < guestCount) {
//         for (let i = updated.length; i < guestCount; i++) {
//           updated.push({ name: "", gender: "Male" });
//         }
//       } else if (updated.length > guestCount) {
//         updated.splice(guestCount);
//       }
//       return updated;
//     });
//   }, [guestCount]);

//   if (isTourLoading || isUserLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (isTourError || !tourData) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">
//           Tour not found
//         </h2>
//         <p className="text-gray-500 mb-6">
//           We couldn't find the tour you are trying to book.
//         </p>
//         <Button onClick={() => navigate("/tours")}>Browse Tours</Button>
//       </div>
//     );
//   }

//   const tourPrice = tourData.price || tourData.costFrom || 0;
//   const basePrice = guestCount * tourPrice;
//   const hotelPrice = selectedHotel ? selectedHotel.price * guestCount : 0;
//   const transportPrice = selectedTransport
//     ? selectedTransport.price * guestCount
//     : 0;
//   const totalAmount = basePrice + hotelPrice + transportPrice - discount;

//   const handleTravelerChange = (
//     index: number,
//     field: keyof ITraveler,
//     value: string,
//   ) => {
//     const updated = [...travelers];
//     updated[index] = { ...updated[index], [field]: value };
//     setTravelers(updated);
//   };

//   const handleApplyCoupon = () => {
//     if (couponCode.toUpperCase() === "SUMMER20") {
//       setDiscount(basePrice * 0.2);
//       toast.success("Coupon applied! 20% discount.");
//     } else {
//       setDiscount(0);
//       toast.error("Invalid coupon code.");
//     }
//   };

//   const handleNextStep = () => {
//     if (step === 2) {
//       // Validate travelers
//       const isValid = travelers.every((t) => t.name.trim() !== "");
//       if (!isValid) {
//         toast.error("Please fill in the names for all travelers.");
//         return;
//       }
//     }
//     setStep((prev) => Math.min(prev + 1, 4));
//   };

//   const handleBooking = async () => {
//     const bookingData = {
//       tour: id,
//       guestCount,
//       travelers,
//       hotel: selectedHotel?._id,
//       transport: selectedTransport?._id,
//     };

//     try {
//       const res = await createBooking(bookingData).unwrap();
//       if (res.success) {
//         toast.success("Booking initiated! Redirecting to payment...");
//         if (res.data?.paymentUrl) {
//           window.location.href = res.data.paymentUrl;
//         } else {
//           // If no payment URL (e.g., backend logic changed), just go to user bookings
//           navigate("/user/bookings");
//         }
//       }
//     } catch (err: any) {
//       toast.error(
//         err.data?.message ||
//           "Booking failed. Please ensure your profile is complete.",
//       );
//       if (err.data?.message?.includes("update your profile")) {
//         navigate("/user/profile");
//       }
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen py-12">
//       <div className="container mx-auto px-4 max-w-6xl">
//         {/* Stepper */}
//         <div className="mb-10 flex items-center justify-center max-w-4xl mx-auto">
//           {["Trip Details", "Traveler Info", "Add-ons", "Payment"].map(
//             (label, idx) => (
//               <div key={label} className="flex items-center w-full relative">
//                 <div
//                   className={`flex items-center justify-center w-10 h-10 rounded-full font-bold z-10 transition-colors ${
//                     step >= idx + 1
//                       ? "bg-blue-600 text-white shadow-md shadow-blue-200"
//                       : "bg-gray-200 text-gray-500"
//                   }`}
//                 >
//                   {idx + 1}
//                 </div>
//                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap text-gray-500">
//                   {label}
//                 </div>
//                 {idx < 3 && (
//                   <div
//                     className={`h-1 w-full -ml-2 -mr-2 ${step > idx + 1 ? "bg-blue-600" : "bg-gray-200"}`}
//                   />
//                 )}
//               </div>
//             ),
//           )}
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8 pt-8">
//           {/* Main Form Area */}
//           <div className="flex-1">
//             <AnimatePresence mode="wait">
//               {/* STEP 1: Trip Details */}
//               {step === 1 && (
//                 <motion.div
//                   key="step1"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
//                 >
//                   <h2 className="text-2xl font-bold mb-6">Who's going?</h2>
//                   <div className="space-y-6 max-w-md">
//                     <div>
//                       <Label className="text-gray-700 mb-2 block">
//                         Number of Guests
//                       </Label>
//                       <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-2xl">
//                         <button
//                           onClick={() =>
//                             setGuestCount((p) => Math.max(1, p - 1))
//                           }
//                           className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-50 transition-colors"
//                         >
//                           -
//                         </button>
//                         <span className="text-2xl font-bold w-12 text-center text-gray-900">
//                           {guestCount}
//                         </span>
//                         <button
//                           onClick={() =>
//                             setGuestCount((p) =>
//                               Math.min(tourData.maxGuest, p + 1),
//                             )
//                           }
//                           className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-50 transition-colors"
//                         >
//                           +
//                         </button>
//                       </div>
//                       <p className="text-sm text-gray-500 mt-2">
//                         Maximum {tourData.maxGuest} guests allowed for this
//                         tour.
//                       </p>
//                     </div>
//                   </div>

//                   <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
//                     <Button
//                       onClick={handleNextStep}
//                       size="lg"
//                       className="rounded-full px-8 bg-blue-600"
//                     >
//                       Next: Traveler Info
//                     </Button>
//                   </div>
//                 </motion.div>
//               )}

//               {/* STEP 2: Traveler Info */}
//               {step === 2 && (
//                 <motion.div
//                   key="step2"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   className="space-y-6"
//                 >
//                   {travelers.map((traveler, index) => (
//                     <div
//                       key={index}
//                       className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
//                     >
//                       <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">
//                         Traveler {index + 1}{" "}
//                         {index === 0 && (
//                           <span className="text-sm font-normal text-blue-600 bg-blue-50 px-3 py-1 rounded-full ml-2">
//                             Primary Contact
//                           </span>
//                         )}
//                       </h3>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-2">
//                           <Label>Full Name *</Label>
//                           <Input
//                             placeholder="John Doe"
//                             value={traveler.name}
//                             onChange={(e) =>
//                               handleTravelerChange(
//                                 index,
//                                 "name",
//                                 e.target.value,
//                               )
//                             }
//                             className="bg-gray-50"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Gender</Label>
//                           <Select
//                             value={traveler.gender}
//                             onValueChange={(val) =>
//                               handleTravelerChange(index, "gender", val)
//                             }
//                           >
//                             <SelectTrigger className="bg-gray-50">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Male">Male</SelectItem>
//                               <SelectItem value="Female">Female</SelectItem>
//                               <SelectItem value="Other">Other</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Passport Number (Optional)</Label>
//                           <Input
//                             placeholder="A12345678"
//                             value={traveler.passport || ""}
//                             onChange={(e) =>
//                               handleTravelerChange(
//                                 index,
//                                 "passport",
//                                 e.target.value,
//                               )
//                             }
//                             className="bg-gray-50"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Nationality (Optional)</Label>
//                           <Input
//                             placeholder="e.g. American"
//                             value={traveler.nationality || ""}
//                             onChange={(e) =>
//                               handleTravelerChange(
//                                 index,
//                                 "nationality",
//                                 e.target.value,
//                               )
//                             }
//                             className="bg-gray-50"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}

//                   <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
//                     <Button
//                       variant="ghost"
//                       onClick={() => setStep(1)}
//                       className="rounded-full"
//                     >
//                       Back
//                     </Button>
//                     <Button
//                       onClick={handleNextStep}
//                       size="lg"
//                       className="rounded-full px-8 bg-blue-600"
//                     >
//                       Next: Add-ons
//                     </Button>
//                   </div>
//                 </motion.div>
//               )}

//               {/* STEP 3: Add-ons */}
//               {step === 3 && (
//                 <motion.div
//                   key="step3"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   className="space-y-6"
//                 >
//                   {/* Hotels */}
//                   <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//                     <h3 className="text-xl font-bold mb-4 text-gray-900 border-b pb-4">
//                       Select Hotel
//                     </h3>
//                     {hotels.length === 0 ? (
//                       <p className="text-gray-500 text-sm">
//                         No hotels available for this destination.
//                       </p>
//                     ) : (
//                       <div className="grid gap-4 mt-4">
//                         {hotels.map((hotel: any) => (
//                           <div
//                             key={hotel._id}
//                             onClick={() =>
//                               setSelectedHotel(
//                                 selectedHotel?._id === hotel._id ? null : hotel,
//                               )
//                             }
//                             className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between
//                               ${selectedHotel?._id === hotel._id ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
//                           >
//                             <div>
//                               <h4 className="font-bold text-gray-900">
//                                 {hotel.name}{" "}
//                                 <span className="text-sm font-normal text-gray-500 ml-2">
//                                   ⭐ {hotel.rating}
//                                 </span>
//                               </h4>
//                               <p className="text-sm text-gray-500">
//                                 {hotel.roomType} • {hotel.location}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <span className="font-bold text-blue-600">
//                                 + ৳{hotel.price}
//                               </span>
//                               <p className="text-xs text-gray-400">
//                                 per person
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Transports */}
//                   <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//                     <h3 className="text-xl font-bold mb-4 text-gray-900 border-b pb-4">
//                       Select Transport
//                     </h3>
//                     {transports.length === 0 ? (
//                       <p className="text-gray-500 text-sm">
//                         No transport options available.
//                       </p>
//                     ) : (
//                       <div className="grid gap-4 mt-4">
//                         {transports.map((transport: any) => (
//                           <div
//                             key={transport._id}
//                             onClick={() =>
//                               setSelectedTransport(
//                                 selectedTransport?._id === transport._id
//                                   ? null
//                                   : transport,
//                               )
//                             }
//                             className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between
//                               ${selectedTransport?._id === transport._id ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
//                           >
//                             <div>
//                               <h4 className="font-bold text-gray-900">
//                                 {transport.vehicleType}{" "}
//                                 <span className="text-sm font-normal text-gray-500 ml-2">
//                                   capacity: {transport.capacity}
//                                 </span>
//                               </h4>
//                               <p className="text-sm text-gray-500">
//                                 {transport.route}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <span className="font-bold text-blue-600">
//                                 + ৳{transport.price}
//                               </span>
//                               <p className="text-xs text-gray-400">
//                                 per person
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
//                     <Button
//                       variant="ghost"
//                       onClick={() => setStep(2)}
//                       className="rounded-full"
//                     >
//                       Back
//                     </Button>
//                     <Button
//                       onClick={handleNextStep}
//                       size="lg"
//                       className="rounded-full px-8 bg-blue-600"
//                     >
//                       Next: Payment
//                     </Button>
//                   </div>
//                 </motion.div>
//               )}

//               {/* STEP 4: Payment (Coupon & Submit) */}
//               {step === 4 && (
//                 <motion.div
//                   key="step3"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
//                 >
//                   <h2 className="text-2xl font-bold mb-6">Review & Pay</h2>

//                   <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8 flex items-start gap-4">
//                     <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       >
//                         <rect width="20" height="14" x="2" y="5" rx="2" />
//                         <line x1="2" x2="22" y1="10" y2="10" />
//                       </svg>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-blue-900 mb-1">
//                         Secure Payment via SSLCommerz
//                       </h4>
//                       <p className="text-blue-700/80 text-sm">
//                         You will be securely redirected to our payment gateway
//                         to complete your transaction. You can pay using your
//                         preferred Credit Card, Debit Card, or Mobile Banking app
//                         (bKash, Nagad).
//                       </p>
//                     </div>
//                   </div>

//                   <div className="mb-8">
//                     <Label className="mb-2 block">Have a Coupon Code?</Label>
//                     <div className="flex gap-3 max-w-sm">
//                       <Input
//                         placeholder="Enter code (e.g. SUMMER20)"
//                         value={couponCode}
//                         onChange={(e) => setCouponCode(e.target.value)}
//                         className="bg-gray-50 uppercase"
//                       />
//                       <Button variant="outline" onClick={handleApplyCoupon}>
//                         Apply
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center pt-6 border-t border-gray-100">
//                     <Button
//                       variant="ghost"
//                       onClick={() => setStep(3)}
//                       className="rounded-full"
//                     >
//                       Back
//                     </Button>
//                     <Button
//                       onClick={handleBooking}
//                       disabled={isBooking}
//                       size="lg"
//                       className="rounded-full px-10 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
//                     >
//                       {isBooking
//                         ? "Processing..."
//                         : `Pay ৳${totalAmount.toLocaleString()}`}
//                     </Button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Right Sidebar - Order Summary */}
//           <div className="w-full lg:w-96 shrink-0">
//             <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-6">
//               <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
//                 <img
//                   src={tourData.images?.[0]}
//                   alt="tour"
//                   className="w-24 h-24 object-cover rounded-2xl"
//                 />
//                 <div>
//                   <h4 className="font-bold text-gray-900 leading-tight mb-2">
//                     {tourData.title}
//                   </h4>
//                   <p className="text-sm text-gray-500 flex items-center gap-1">
//                     📍 {tourData.location || tourData.arrivalLocation}
//                   </p>
//                 </div>
//               </div>

//               <h3 className="font-bold text-lg mb-4">Order Summary</h3>

//               <div className="space-y-3 text-gray-600 mb-6 border-b border-gray-100 pb-6">
//                 <div className="flex justify-between">
//                   <span>Price per person</span>
//                   <span className="font-medium text-gray-900">
//                     ৳{tourData.price || tourData.costFrom || 0}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Guests</span>
//                   <span className="font-medium text-gray-900">
//                     x {guestCount}
//                   </span>
//                 </div>
//                 {hotelPrice > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-blue-600">Hotel Add-on</span>
//                     <span className="font-medium text-gray-900">
//                       + ৳{hotelPrice}
//                     </span>
//                   </div>
//                 )}
//                 {transportPrice > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-blue-600">Transport Add-on</span>
//                     <span className="font-medium text-gray-900">
//                       + ৳{transportPrice}
//                     </span>
//                   </div>
//                 )}
//                 {discount > 0 && (
//                   <div className="flex justify-between text-green-600 font-medium">
//                     <span>Discount applied</span>
//                     <span>- ৳{discount}</span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-between items-end">
//                 <span className="font-bold text-gray-900">Total</span>
//                 <div className="text-right">
//                   {discount > 0 && (
//                     <span className="line-through text-sm text-gray-400 block">
//                       ৳{basePrice}
//                     </span>
//                   )}
//                   <span className="text-3xl font-black text-blue-600">
//                     ৳{totalAmount.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBookingMutation } from "@/redux/features/bookings/bookings.api";
import { useGetAllTourQuery } from "@/redux/features/Tour/tour.api";
import { useGetAllHotelsQuery } from "@/redux/features/hotel/hotel.api";
import { useGetAllTransportsQuery } from "@/redux/features/transport/transport.api";
import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";
import { toast } from "sonner";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface ITraveler {
  name: string;
  passport?: string;
  nationality?: string;
  gender?: "Male" | "Female" | "Other";
  emergencyContact?: string;
}

export default function Bookings() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Custom Cursor state and movement hooks
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  const {
    data: tourDataArray,
    isLoading: isTourLoading,
    isError: isTourError,
  } = useGetAllTourQuery({ _id: id });
  const { isLoading: isUserLoading } = useUserInfoQuery(undefined);

  const { data: hotelsData } = useGetAllHotelsQuery(undefined);
  const { data: transportsData } = useGetAllTransportsQuery(undefined);

  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const tourData = tourDataArray?.[0];
  const hotels = hotelsData || [];
  const transports = transportsData || [];

  const [step, setStep] = useState(1);
  const [guestCount, setGuestCount] = useState(1);
  const [travelers, setTravelers] = useState<ITraveler[]>([
    { name: "", gender: "Male" },
  ]);

  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedTransport, setSelectedTransport] = useState<any>(null);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // 3D Card Tilt State for Tour Banner / Summary
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardRotateX = useTransform(cardY, [-300, 300], [10, -10]);
  const cardRotateY = useTransform(cardX, [-300, 300], [-10, 10]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX - width / 2;
    const yPct = mouseY - height / 2;
    cardX.set(xPct);
    cardY.set(yPct);
  };

  const handleCardMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  // Sync travelers array with guest count
  useEffect(() => {
    setTravelers((prev) => {
      const updated = [...prev];
      if (updated.length < guestCount) {
        for (let i = updated.length; i < guestCount; i++) {
          updated.push({ name: "", gender: "Male" });
        }
      } else if (updated.length > guestCount) {
        updated.splice(guestCount);
      }
      return updated;
    });
  }, [guestCount]);

  if (isTourLoading || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="relative">
          <div className="animate-ping absolute h-16 w-16 rounded-full bg-cyan-400 opacity-20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.5)]"></div>
        </div>
      </div>
    );
  }

  if (isTourError || !tourData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-950 text-white">
        <h2 className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
          Tour not found
        </h2>
        <p className="text-slate-400 mb-6 max-w-md">
          We couldn't locate the hyper-dimensional excursion you are attempting
          to reserve.
        </p>
        <Button
          onClick={() => navigate("/tours")}
          className="rounded-full px-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          Browse Tours
        </Button>
      </div>
    );
  }

  const tourPrice = tourData.price || tourData.costFrom || 0;
  const basePrice = guestCount * tourPrice;
  const hotelPrice = selectedHotel ? selectedHotel.price * guestCount : 0;
  const transportPrice = selectedTransport
    ? selectedTransport.price * guestCount
    : 0;
  const totalAmount = basePrice + hotelPrice + transportPrice - discount;

  const handleTravelerChange = (
    index: number,
    field: keyof ITraveler,
    value: string,
  ) => {
    const updated = [...travelers];
    updated[index] = { ...updated[index], [field]: value };
    setTravelers(updated);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SUMMER20") {
      setDiscount(basePrice * 0.2);
      toast.success("Quantum Coupon applied! 20% discount unlocked.");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon signature.");
    }
  };

  const handleNextStep = () => {
    if (step === 2) {
      const isValid = travelers.every((t) => t.name.trim() !== "");
      if (!isValid) {
        toast.error(
          "Please fill in designations for all participating voyagers.",
        );
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBooking = async () => {
    const bookingData = {
      tour: id,
      guestCount,
      travelers,
      hotel: selectedHotel?._id,
      transport: selectedTransport?._id,
    };

    try {
      const res = await createBooking(bookingData).unwrap();
      if (res.success) {
        toast.success(
          "Expedition initialized! Connecting to secure gateway...",
        );
        if (res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        } else {
          navigate("/user/bookings");
        }
      }
    } catch (err: any) {
      toast.error(
        err.data?.message ||
          "Booking matrix failed. Please verify your profile configurations.",
      );
      if (err.data?.message?.includes("update your profile")) {
        navigate("/user/profile");
      }
    }
  };

  const stepsList = [
    { title: "Trip Setup", desc: "Guests & Size" },
    { title: "Voyager Manifest", desc: "Crew Credentials" },
    { title: "Ecosystem Add-ons", desc: "Stays & Transit" },
    { title: "Quantum Settlement", desc: "Secure Checkout" },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950 cursor-default">
      {/* Custom Ultra-Modern Neon Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-400 pointer-events-none z-50 hidden md:flex items-center justify-center backdrop-invert-[0.1]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
      </motion.div>

      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Secure Node Gateway // v2.6
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Expedition Reservation Matrix
          </h1>
        </div>

        {/* Futuristic Stepper */}
        <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {stepsList.map((item, idx) => {
            const isActive = step === idx + 1;
            const isCompleted = step > idx + 1;
            return (
              <div
                key={item.title}
                className={`relative p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 backdrop-blur-md ${
                  isActive
                    ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.15)]"
                    : isCompleted
                      ? "bg-slate-900/60 border-slate-800 text-slate-400"
                      : "bg-slate-900/30 border-slate-900 text-slate-600"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0 transition-all ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                      : isCompleted
                        ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                        : "bg-slate-900 text-slate-600 border border-slate-800"
                  }`}
                >
                  {isCompleted ? "✓" : `0${idx + 1}`}
                </div>
                <div className="overflow-hidden">
                  <p
                    className={`text-xs font-mono uppercase tracking-wider ${isActive ? "text-cyan-400 font-bold" : "text-slate-500"}`}
                  >
                    Phase {idx + 1}
                  </p>
                  <h4
                    className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-slate-400"}`}
                  >
                    {item.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* STEP 1: Trip Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                  <h2 className="text-2xl font-black mb-2 tracking-tight text-white flex items-center gap-3">
                    <span className="text-cyan-400 font-mono text-lg">01.</span>{" "}
                    Voyager Capacity Configuration
                  </h2>
                  <p className="text-slate-400 text-sm mb-8">
                    Define your cohort scale for telemetry and spatial
                    allocation.
                  </p>

                  <div className="space-y-6 max-w-md">
                    <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                      <Label className="text-slate-300 font-mono text-xs uppercase tracking-wider mb-3 block">
                        Number of Active Travelers
                      </Label>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() =>
                            setGuestCount((p) => Math.max(1, p - 1))
                          }
                          className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-xl text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 transition-all shadow-md active:scale-95"
                        >
                          -
                        </button>
                        <span className="text-3xl font-black font-mono w-20 text-center text-white tracking-widest">
                          {guestCount}
                        </span>
                        <button
                          onClick={() =>
                            setGuestCount((p) =>
                              Math.min(tourData.maxGuest, p + 1),
                            )
                          }
                          className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-xl text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 transition-all shadow-md active:scale-95"
                        >
                          +
                        </button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
                        <span>Capacity Limit:</span>
                        <span className="text-cyan-400 font-bold">
                          {tourData.maxGuest} Voyagers Max
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-800/80 flex justify-end">
                    <Button
                      onClick={handleNextStep}
                      size="lg"
                      className="rounded-full px-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
                    >
                      Proceed to Manifest →
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Traveler Info */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {travelers.map((traveler, index) => (
                    <div
                      key={index}
                      className="bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                          <span className="text-cyan-400">#0{index + 1}</span>{" "}
                          Voyager Credential Unit
                        </h3>
                        {index === 0 && (
                          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-widest">
                            Primary Contact
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-slate-300 font-mono text-xs uppercase tracking-wider">
                            Full Designation *
                          </Label>
                          <Input
                            placeholder="e.g. Alex Vance"
                            value={traveler.name}
                            onChange={(e) =>
                              handleTravelerChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                            className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300 font-mono text-xs uppercase tracking-wider">
                            Biological Matrix / Gender
                          </Label>
                          <Select
                            value={traveler.gender}
                            onValueChange={(val) =>
                              handleTravelerChange(index, "gender", val)
                            }
                          >
                            <SelectTrigger className="bg-slate-950/60 border-slate-800 text-white focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                              <SelectItem
                                value="Male"
                                className="focus:bg-slate-800 focus:text-cyan-400"
                              >
                                Male
                              </SelectItem>
                              <SelectItem
                                value="Female"
                                className="focus:bg-slate-800 focus:text-cyan-400"
                              >
                                Female
                              </SelectItem>
                              <SelectItem
                                value="Other"
                                className="focus:bg-slate-800 focus:text-cyan-400"
                              >
                                Other
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300 font-mono text-xs uppercase tracking-wider">
                            Passport Signature (Optional)
                          </Label>
                          <Input
                            placeholder="A12345678"
                            value={traveler.passport || ""}
                            onChange={(e) =>
                              handleTravelerChange(
                                index,
                                "passport",
                                e.target.value,
                              )
                            }
                            className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-12 font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300 font-mono text-xs uppercase tracking-wider">
                            Origin Sector / Nationality (Opt.)
                          </Label>
                          <Input
                            placeholder="e.g. Terran / Global"
                            value={traveler.nationality || ""}
                            onChange={(e) =>
                              handleTravelerChange(
                                index,
                                "nationality",
                                e.target.value,
                              )
                            }
                            className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-12"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      size="lg"
                      className="rounded-full px-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                      Proceed to Add-ons →
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Add-ons */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Hotels */}
                  <div className="bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/80 shadow-2xl">
                    <h3 className="text-xl font-black mb-2 text-white flex items-center gap-3">
                      <span className="text-cyan-400 font-mono text-sm">
                        03.1
                      </span>{" "}
                      Select Habitation Unit (Hotel)
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                      Enhance your terrestrial downtime with synced sanctuary
                      nodes.
                    </p>

                    {hotels.length === 0 ? (
                      <p className="text-slate-500 text-sm font-mono italic">
                        No habitation nodes available in this sector.
                      </p>
                    ) : (
                      <div className="grid gap-4 mt-4">
                        {hotels.map((hotel: any) => {
                          const isSelected = selectedHotel?._id === hotel._id;
                          return (
                            <div
                              key={hotel._id}
                              onClick={() =>
                                setSelectedHotel(isSelected ? null : hotel)
                              }
                              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between backdrop-blur-md ${
                                isSelected
                                  ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                  : "border-slate-800/80 bg-slate-950/40 hover:border-slate-700"
                              }`}
                            >
                              <div>
                                <h4 className="font-bold text-white flex items-center gap-2">
                                  {hotel.name}
                                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                                    ★ {hotel.rating}
                                  </span>
                                </h4>
                                <p className="text-sm text-slate-400 mt-1 font-mono">
                                  {hotel.roomType} • {hotel.location}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-black text-cyan-400 text-lg">
                                  + ৳{hotel.price}
                                </span>
                                <p className="text-xs text-slate-500 font-mono uppercase">
                                  per voyager
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Transports */}
                  <div className="bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/80 shadow-2xl">
                    <h3 className="text-xl font-black mb-2 text-white flex items-center gap-3">
                      <span className="text-cyan-400 font-mono text-sm">
                        03.2
                      </span>{" "}
                      Select Transit Vector
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                      Choose mechanical conveyance parameters for your
                      expedition route.
                    </p>

                    {transports.length === 0 ? (
                      <p className="text-slate-500 text-sm font-mono italic">
                        No transport modules available.
                      </p>
                    ) : (
                      <div className="grid gap-4 mt-4">
                        {transports.map((transport: any) => {
                          const isSelected =
                            selectedTransport?._id === transport._id;
                          return (
                            <div
                              key={transport._id}
                              onClick={() =>
                                setSelectedTransport(
                                  isSelected ? null : transport,
                                )
                              }
                              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between backdrop-blur-md ${
                                isSelected
                                  ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                  : "border-slate-800/80 bg-slate-950/40 hover:border-slate-700"
                              }`}
                            >
                              <div>
                                <h4 className="font-bold text-white flex items-center gap-2">
                                  {transport.vehicleType}
                                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                                    Capacity: {transport.capacity}
                                  </span>
                                </h4>
                                <p className="text-sm text-slate-400 mt-1 font-mono">
                                  {transport.route}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-black text-cyan-400 text-lg">
                                  + ৳{transport.price}
                                </span>
                                <p className="text-xs text-slate-500 font-mono uppercase">
                                  per voyager
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(2)}
                      className="rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      size="lg"
                      className="rounded-full px-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                      Proceed to Checkout →
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Payment (Coupon & Submit) */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden"
                >
                  <h2 className="text-2xl font-black mb-2 text-white flex items-center gap-3">
                    <span className="text-cyan-400 font-mono text-sm">04.</span>{" "}
                    Quantum Settlement Protocol
                  </h2>
                  <p className="text-slate-400 text-sm mb-8">
                    Review transaction parameters and execute secure payment
                    linkage.
                  </p>

                  <div className="bg-cyan-500/10 border border-cyan-500/30 p-6 rounded-2xl mb-8 flex items-start gap-4 backdrop-blur-md">
                    <div className="bg-cyan-500/20 p-3 rounded-full text-cyan-400 shrink-0 border border-cyan-500/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 font-mono tracking-wide">
                        Encrypted Gateway via SSLCommerz
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        You will be routed to a secure multi-channel financial
                        conduit supporting major Credit Cards, Debit
                        instruments, and Regional Mobile Nodes (bKash, Nagad).
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <Label className="text-slate-300 font-mono text-xs uppercase tracking-wider mb-2 block">
                      Promotional Coupon Signature
                    </Label>
                    <div className="flex gap-3 max-w-sm">
                      <Input
                        placeholder="ENTER CODE (e.g. SUMMER20)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-12 uppercase font-mono tracking-wider"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        className="h-12 px-6 rounded-xl border-slate-700 bg-slate-900 text-white hover:bg-slate-800 hover:text-cyan-400 transition-all font-mono"
                      >
                        Verify
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-800/80">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(3)}
                      className="rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={handleBooking}
                      disabled={isBooking}
                      size="lg"
                      className="rounded-full px-10 text-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02]"
                    >
                      {isBooking
                        ? "Syncing Transaction..."
                        : `Authorize Payment ৳${totalAmount.toLocaleString()}`}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar - 3D Tilt Order Summary Card */}
          <div className="w-full lg:w-96 shrink-0">
            <motion.div
              style={{
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="bg-slate-900/80 backdrop-blur-2xl p-6 rounded-3xl border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] sticky top-6 overflow-hidden group"
            >
              <div className="absolute -right-20 -top-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

              <div className="flex gap-4 mb-6 pb-6 border-b border-slate-800/80 items-center">
                <img
                  src={tourData.images?.[0]}
                  alt="tour"
                  className="w-20 h-20 object-cover rounded-2xl border border-slate-700/80 shadow-md shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-white leading-tight mb-1 truncate">
                    {tourData.title}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    📍 {tourData.location || tourData.arrivalLocation}
                  </p>
                </div>
              </div>

              <h3 className="font-black text-white text-sm uppercase tracking-widest font-mono mb-4 text-cyan-400">
                // Telemetry Summary
              </h3>

              <div className="space-y-3 text-slate-300 mb-6 border-b border-slate-800/80 pb-6 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rate / Voyager</span>
                  <span className="font-bold text-white">
                    ৳{tourData.price || tourData.costFrom || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cohort Scale</span>
                  <span className="font-bold text-white">x {guestCount}</span>
                </div>
                {hotelPrice > 0 && (
                  <div className="flex justify-between text-cyan-300">
                    <span>Habitation Node</span>
                    <span className="font-bold">+ ৳{hotelPrice}</span>
                  </div>
                )}
                {transportPrice > 0 && (
                  <div className="flex justify-between text-cyan-300">
                    <span>Transit Vector</span>
                    <span className="font-bold">+ ৳{transportPrice}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Discount</span>
                    <span>- ৳{discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Total Obligation
                </span>
                <div className="text-right">
                  {discount > 0 && (
                    <span className="line-through text-xs text-slate-500 block font-mono">
                      ৳{basePrice}
                    </span>
                  )}
                  <span className="text-3xl font-black font-mono tracking-tight text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    ৳{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
