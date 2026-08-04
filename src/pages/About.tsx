import { motion } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllTourQuery } from "@/redux/features/Tour/tour.api";
import { useGetDivisionTypesQuery } from "@/redux/features/division/division.api";
import {
  Compass,
  MapPin,
  Users,
  Globe2,
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Plane,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  // 🛡️ Fetching live data from existing APIs to show real company scale
  const { data: tourData, isLoading: tourLoading } =
    useGetAllTourQuery(undefined);
  const { data: divisionData, isLoading: divLoading } =
    useGetDivisionTypesQuery(undefined);

  // Safe data extraction (Prevents crashes)
  const totalTours = tourData?.length || 0;
  const totalDivisions = divisionData?.length || 0;

  const stats = [
    {
      label: "Unique Tours",
      value: totalTours,
      icon: Compass,
      color: "text-blue-600 bg-blue-500/10",
      loading: tourLoading,
    },
    {
      label: "Destinations",
      value: totalDivisions,
      icon: MapPin,
      color: "text-emerald-600 bg-emerald-500/10",
      loading: divLoading,
    },
    {
      label: "Happy Travelers",
      value: "12k+",
      icon: Users,
      color: "text-purple-600 bg-purple-500/10",
      loading: false,
    },
    {
      label: "Global Regions",
      value: "15+",
      icon: Globe2,
      color: "text-orange-600 bg-orange-500/10",
      loading: false,
    },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Safe & Secure Travel",
      description:
        "Your safety is our priority. We partner with trusted local guides and vetted accommodations.",
    },
    {
      icon: Sparkles,
      title: "Unforgettable Experiences",
      description:
        "We craft unique itineraries that go beyond the typical tourist traps.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Dedicated 24/7 support to ensure your journey is smooth from start to finish.",
    },
    {
      icon: Plane,
      title: "Seamless Booking",
      description:
        "Innovative technology makes finding and booking your next adventure effortless.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                <Sparkles className="h-4 w-4" />
                Our Story
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                We're on a mission to{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  simplify travel
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 2023, we started with a simple idea: make
                extraordinary travel experiences accessible to everyone. Today,
                we help thousands of travelers discover the world with
                confidence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Live Stats Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl -mt-12 md:-mt-16 relative z-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-card/60 backdrop-blur-xl border border-border/40 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={`p-3 rounded-xl mb-4 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-3xl font-black text-foreground mb-1">
                      {stat.loading ? (
                        <div className="h-8 w-16 bg-muted rounded-md animate-pulse mx-auto"></div>
                      ) : (
                        stat.value
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Mission & Vision Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full bg-card/60 backdrop-blur-xl border-border/40 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-6">
                    <Target className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Our Mission
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    To empower global exploration by providing a seamless,
                    transparent, and secure booking platform. We strive to
                    connect curious travelers with authentic local experiences,
                    removing the friction from travel planning so you can focus
                    on what matters: the journey.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full bg-card/60 backdrop-blur-xl border-border/40 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 text-emerald-600 mb-6">
                    <Eye className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Our Vision
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    To become the world's most traveler-centric platform, where
                    discovering, planning, and booking any trip is a joyful
                    experience. We envision a world where technology bridges the
                    gap between cultures and makes the beauty of our planet
                    accessible to all.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Why Travel With Us?
            </h2>
            <p className="text-muted-foreground text-lg">
              We handle the details so you can focus on the adventure.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-card/40 backdrop-blur-md border-border/40 rounded-2xl h-full hover:border-primary/30 hover:bg-card/60 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="inline-flex p-2.5 rounded-lg bg-muted text-primary mb-4 group-hover:scale-110 transition-transform">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-12 md:p-16 text-center shadow-2xl"
          >
            <div className="absolute inset-0 bg-grid-white opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-primary-foreground mb-4">
                Ready for your next adventure?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Explore our curated selection of tours and find the perfect
                journey tailored just for you.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 font-bold rounded-xl px-8 h-12 text-base"
              >
                <Link to="/tours" className="flex items-center gap-2">
                  Explore Tours <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </PageWrapper>
  );
}

// import React, { useState, useEffect } from "react";

// const About = () => {
//   // State for dynamic stats fetched from backend APIs
//   const [stats, setStats] = useState({
//     totalTours: 0,
//     happyTravelers: 0,
//     destinations: 0,
//     satisfactionRate: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch API data for live stats
//   useEffect(() => {
//     const fetchAboutData = async () => {
//       try {
//         setLoading(true);

//         // Replace with your actual Tour Management API endpoints
//         // e.g., const res = await fetch('/api/v1/tours/stats');
//         const response = await fetch("/api/v1/tours/stats");

//         if (!response.ok) {
//           throw new Error("Failed to load dynamic tour statistics");
//         }

//         const data = await response.json();

//         // Update state with API response (adjust keys according to your API schema)
//         setStats({
//           totalTours: data?.totalTours || 250,
//           happyTravelers: data?.happyTravelers || 15000,
//           destinations: data?.destinations || 45,
//           satisfactionRate: data?.satisfactionRate || 99,
//         });
//       } catch (err) {
//         // Fallback realistic metrics if API fetch fails or during offline test
//         console.warn("API fetch notice:", err.message);
//         setStats({
//           totalTours: 250,
//           happyTravelers: 15200,
//           destinations: 48,
//           satisfactionRate: 98.5,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAboutData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white py-24 px-4 overflow-hidden">
//         <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
//         <div className="container mx-auto max-w-6xl relative z-10 text-center">
//           <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-white/30">
//             Discover Our Story
//           </span>
//           <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
//             Crafting Unforgettable Journeys Worldwide
//           </h1>
//           <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
//             We connect passionate travelers with breathtaking destinations,
//             curated tours, and seamless booking experiences—all backed by 24/7
//             expert support.
//           </p>
//         </div>
//       </section>

//       {/* Live Stats Counter Section */}
//       <section className="container mx-auto max-w-6xl px-4 -mt-12 relative z-20">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100">
//           <div className="text-center p-4 border-r border-slate-100 last:border-r-0">
//             <h3 className="text-3xl md:text-4xl font-black text-blue-600">
//               {loading ? "..." : `${stats.totalTours}+`}
//             </h3>
//             <p className="text-sm font-medium text-slate-500 mt-1">
//               Curated Tours
//             </p>
//           </div>
//           <div className="text-center p-4 border-r border-slate-100 last:border-r-0">
//             <h3 className="text-3xl md:text-4xl font-black text-blue-600">
//               {loading ? "..." : `${stats.happyTravelers.toLocaleString()}+`}
//             </h3>
//             <p className="text-sm font-medium text-slate-500 mt-1">
//               Happy Travelers
//             </p>
//           </div>
//           <div className="text-center p-4 border-r border-slate-100 last:border-r-0">
//             <h3 className="text-3xl md:text-4xl font-black text-blue-600">
//               {loading ? "..." : `${stats.destinations}+`}
//             </h3>
//             <p className="text-sm font-medium text-slate-500 mt-1">
//               Destinations
//             </p>
//           </div>
//           <div className="text-center p-4">
//             <h3 className="text-3xl md:text-4xl font-black text-blue-600">
//               {loading ? "..." : `${stats.satisfactionRate}%`}
//             </h3>
//             <p className="text-sm font-medium text-slate-500 mt-1">
//               Satisfaction Rate
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* About Overview Section */}
//       <section className="container mx-auto max-w-6xl px-4 py-20">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           <div className="space-y-6">
//             <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm">
//               <span className="w-8 h-[2px] bg-blue-600"></span>
//               WHO WE ARE
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
//               Your Trusted Partner for Effortless Travel & Adventures
//             </h2>
//             <p className="text-slate-600 leading-relaxed">
//               Founded with a passion for exploration, our Tour Management System
//               bridges the gap between travelers and authentic local experiences.
//               Whether you are seeking high-altitude trekking, tropical beach
//               retreats, or cultural city tours, we handle every detail from
//               booking to departure.
//             </p>
//             <p className="text-slate-600 leading-relaxed">
//               Our automated tour engine ensures transparent pricing, real-time
//               availability, secure payments, and instant booking confirmation
//               for thousands of travelers daily.
//             </p>

//             <div className="grid grid-cols-2 gap-4 pt-4">
//               <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
//                 <h4 className="font-semibold text-slate-900 text-base mb-1">
//                   Safety First
//                 </h4>
//                 <p className="text-xs text-slate-600">
//                   Verified guides & secure payment gateways.
//                 </p>
//               </div>
//               <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
//                 <h4 className="font-semibold text-slate-900 text-base mb-1">
//                   24/7 Support
//                 </h4>
//                 <p className="text-xs text-slate-600">
//                   Dedicated assistance throughout your tour.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="relative">
//             <div className="relative rounded-2xl overflow-hidden shadow-2xl">
//               <img
//                 src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
//                 alt="Travel experience"
//                 className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-500"
//               />
//             </div>
//             <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden sm:block max-w-xs">
//               <p className="text-2xl font-bold text-slate-900">10+ Years</p>
//               <p className="text-xs text-slate-500 font-medium">
//                 Delivering unforgettable tour experiences worldwide
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Core Values / Features */}
//       <section className="bg-slate-100/70 py-20 px-4 border-y border-slate-200">
//         <div className="container mx-auto max-w-6xl">
//           <div className="text-center max-w-2xl mx-auto mb-16">
//             <h2 className="text-3xl font-bold text-slate-900 mb-3">
//               Why Choose Our Tour Platform
//             </h2>
//             <p className="text-slate-600 text-sm md:text-base">
//               Designed from the ground up to give you stress-free itineraries
//               and high-value travel packages.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
//               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
//                 📍
//               </div>
//               <h3 className="text-xl font-bold text-slate-900 mb-2">
//                 Handpicked Destinations
//               </h3>
//               <p className="text-slate-600 text-sm leading-relaxed">
//                 Every tour itinerary is tested and verified by our local travel
//                 experts to guarantee top quality.
//               </p>
//             </div>

//             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
//               <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
//                 💳
//               </div>
//               <h3 className="text-xl font-bold text-slate-900 mb-2">
//                 Best Price Guarantee
//               </h3>
//               <p className="text-slate-600 text-sm leading-relaxed">
//                 Direct partnerships with travel providers allow us to offer
//                 competitive rates without hidden charges.
//               </p>
//             </div>

//             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
//               <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
//                 ⚡
//               </div>
//               <h3 className="text-xl font-bold text-slate-900 mb-2">
//                 Instant Booking
//               </h3>
//               <p className="text-slate-600 text-sm leading-relaxed">
//                 Real-time API integrations deliver live seat availability and
//                 immediate digital ticket generation.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="container mx-auto max-w-6xl px-4 py-20 text-center">
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-white shadow-xl relative overflow-hidden">
//           <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
//             Ready to Start Your Next Adventure?
//           </h2>
//           <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-base md:text-lg">
//             Explore our curated catalog of destinations and book your tour in
//             just a few clicks.
//           </p>
//           <a
//             href="/tours"
//             className="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-xl shadow-md hover:bg-blue-50 transition-colors"
//           >
//             Explore All Tours
//           </a>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default About;
