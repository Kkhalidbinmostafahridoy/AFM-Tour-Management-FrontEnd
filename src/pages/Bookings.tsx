import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateBookingMutation } from "@/redux/features/bookings/bookings.api";
import { useGetAllTourQuery } from "@/redux/features/Tour/tour.api";
import { useGetAllHotelsQuery } from "@/redux/features/hotel/hotel.api";
import { useGetAllTransportsQuery } from "@/redux/features/transport/transport.api";
import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
  
  const { data: tourDataArray, isLoading: isTourLoading, isError: isTourError } = useGetAllTourQuery({ _id: id });
  const { isLoading: isUserLoading } = useUserInfoQuery(undefined);
  
  const { data: hotelsData } = useGetAllHotelsQuery(undefined);
  const { data: transportsData } = useGetAllTransportsQuery(undefined);
  
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const tourData = tourDataArray?.[0];
  const hotels = hotelsData || [];
  const transports = transportsData || [];

  const [step, setStep] = useState(1);
  const [guestCount, setGuestCount] = useState(1);
  const [travelers, setTravelers] = useState<ITraveler[]>([{ name: "", gender: "Male" }]);
  
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedTransport, setSelectedTransport] = useState<any>(null);
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isTourError || !tourData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour not found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the tour you are trying to book.</p>
        <Button onClick={() => navigate("/tours")}>Browse Tours</Button>
      </div>
    );
  }

  const tourPrice = tourData.price || tourData.costFrom || 0;
  const basePrice = guestCount * tourPrice;
  const hotelPrice = selectedHotel ? (selectedHotel.price * guestCount) : 0;
  const transportPrice = selectedTransport ? (selectedTransport.price * guestCount) : 0;
  const totalAmount = basePrice + hotelPrice + transportPrice - discount;

  const handleTravelerChange = (index: number, field: keyof ITraveler, value: string) => {
    const updated = [...travelers];
    updated[index] = { ...updated[index], [field]: value };
    setTravelers(updated);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SUMMER20") {
      setDiscount(basePrice * 0.2);
      toast.success("Coupon applied! 20% discount.");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon code.");
    }
  };

  const handleNextStep = () => {
    if (step === 2) {
      // Validate travelers
      const isValid = travelers.every((t) => t.name.trim() !== "");
      if (!isValid) {
        toast.error("Please fill in the names for all travelers.");
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
        toast.success("Booking initiated! Redirecting to payment...");
        if (res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        } else {
          // If no payment URL (e.g., backend logic changed), just go to user bookings
          navigate("/user/bookings");
        }
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Booking failed. Please ensure your profile is complete.");
      if (err.data?.message?.includes("update your profile")) {
        navigate("/user/profile");
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Stepper */}
        <div className="mb-10 flex items-center justify-center max-w-4xl mx-auto">
          {["Trip Details", "Traveler Info", "Add-ons", "Payment"].map((label, idx) => (
            <div key={label} className="flex items-center w-full relative">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold z-10 transition-colors ${
                step >= idx + 1 ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-200 text-gray-500"
              }`}>
                {idx + 1}
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap text-gray-500">
                {label}
              </div>
              {idx < 3 && (
                <div className={`h-1 w-full -ml-2 -mr-2 ${step > idx + 1 ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pt-8">
          
          {/* Main Form Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Trip Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold mb-6">Who's going?</h2>
                  <div className="space-y-6 max-w-md">
                    <div>
                      <Label className="text-gray-700 mb-2 block">Number of Guests</Label>
                      <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-2xl">
                        <button
                          onClick={() => setGuestCount((p) => Math.max(1, p - 1))}
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold w-12 text-center text-gray-900">{guestCount}</span>
                        <button
                          onClick={() => setGuestCount((p) => Math.min(tourData.maxGuest, p + 1))}
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Maximum {tourData.maxGuest} guests allowed for this tour.</p>
                    </div>
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                    <Button onClick={handleNextStep} size="lg" className="rounded-full px-8 bg-blue-600">
                      Next: Traveler Info
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Traveler Info */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {travelers.map((traveler, index) => (
                    <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">
                        Traveler {index + 1} {index === 0 && <span className="text-sm font-normal text-blue-600 bg-blue-50 px-3 py-1 rounded-full ml-2">Primary Contact</span>}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Full Name *</Label>
                          <Input
                            placeholder="John Doe"
                            value={traveler.name}
                            onChange={(e) => handleTravelerChange(index, "name", e.target.value)}
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select 
                            value={traveler.gender} 
                            onValueChange={(val) => handleTravelerChange(index, "gender", val)}
                          >
                            <SelectTrigger className="bg-gray-50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Passport Number (Optional)</Label>
                          <Input
                            placeholder="A12345678"
                            value={traveler.passport || ""}
                            onChange={(e) => handleTravelerChange(index, "passport", e.target.value)}
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Nationality (Optional)</Label>
                          <Input
                            placeholder="e.g. American"
                            value={traveler.nationality || ""}
                            onChange={(e) => handleTravelerChange(index, "nationality", e.target.value)}
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <Button variant="ghost" onClick={() => setStep(1)} className="rounded-full">Back</Button>
                    <Button onClick={handleNextStep} size="lg" className="rounded-full px-8 bg-blue-600">
                      Next: Add-ons
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Add-ons */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Hotels */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 border-b pb-4">Select Hotel</h3>
                    {hotels.length === 0 ? (
                      <p className="text-gray-500 text-sm">No hotels available for this destination.</p>
                    ) : (
                      <div className="grid gap-4 mt-4">
                        {hotels.map((hotel: any) => (
                          <div 
                            key={hotel._id}
                            onClick={() => setSelectedHotel(selectedHotel?._id === hotel._id ? null : hotel)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between
                              ${selectedHotel?._id === hotel._id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div>
                              <h4 className="font-bold text-gray-900">{hotel.name} <span className="text-sm font-normal text-gray-500 ml-2">⭐ {hotel.rating}</span></h4>
                              <p className="text-sm text-gray-500">{hotel.roomType} • {hotel.location}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-blue-600">+ ৳{hotel.price}</span>
                              <p className="text-xs text-gray-400">per person</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Transports */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 border-b pb-4">Select Transport</h3>
                    {transports.length === 0 ? (
                      <p className="text-gray-500 text-sm">No transport options available.</p>
                    ) : (
                      <div className="grid gap-4 mt-4">
                        {transports.map((transport: any) => (
                          <div 
                            key={transport._id}
                            onClick={() => setSelectedTransport(selectedTransport?._id === transport._id ? null : transport)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between
                              ${selectedTransport?._id === transport._id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div>
                              <h4 className="font-bold text-gray-900">{transport.vehicleType} <span className="text-sm font-normal text-gray-500 ml-2">capacity: {transport.capacity}</span></h4>
                              <p className="text-sm text-gray-500">{transport.route}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-blue-600">+ ৳{transport.price}</span>
                              <p className="text-xs text-gray-400">per person</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <Button variant="ghost" onClick={() => setStep(2)} className="rounded-full">Back</Button>
                    <Button onClick={handleNextStep} size="lg" className="rounded-full px-8 bg-blue-600">
                      Next: Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Payment (Coupon & Submit) */}
              {step === 4 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold mb-6">Review & Pay</h2>
                  
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8 flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Secure Payment via SSLCommerz</h4>
                      <p className="text-blue-700/80 text-sm">You will be securely redirected to our payment gateway to complete your transaction. You can pay using your preferred Credit Card, Debit Card, or Mobile Banking app (bKash, Nagad).</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <Label className="mb-2 block">Have a Coupon Code?</Label>
                    <div className="flex gap-3 max-w-sm">
                      <Input
                        placeholder="Enter code (e.g. SUMMER20)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="bg-gray-50 uppercase"
                      />
                      <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <Button variant="ghost" onClick={() => setStep(3)} className="rounded-full">Back</Button>
                    <Button onClick={handleBooking} disabled={isBooking} size="lg" className="rounded-full px-10 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200">
                      {isBooking ? "Processing..." : `Pay ৳${totalAmount.toLocaleString()}`}
                    </Button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-6">
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <img src={tourData.images?.[0]} alt="tour" className="w-24 h-24 object-cover rounded-2xl" />
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight mb-2">{tourData.title}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">📍 {tourData.location || tourData.arrivalLocation}</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-gray-600 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span>Price per person</span>
                  <span className="font-medium text-gray-900">৳{tourData.price || tourData.costFrom || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests</span>
                  <span className="font-medium text-gray-900">x {guestCount}</span>
                </div>
                {hotelPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-600">Hotel Add-on</span>
                    <span className="font-medium text-gray-900">+ ৳{hotelPrice}</span>
                  </div>
                )}
                {transportPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-600">Transport Add-on</span>
                    <span className="font-medium text-gray-900">+ ৳{transportPrice}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount applied</span>
                    <span>- ৳{discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900">Total</span>
                <div className="text-right">
                  {discount > 0 && <span className="line-through text-sm text-gray-400 block">৳{basePrice}</span>}
                  <span className="text-3xl font-black text-blue-600">৳{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
