import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Compass, Plane, MapPin, Camera, Mountain, Ticket, Globe } from "lucide-react";

export type CursorVariant = "default" | "button" | "link" | "card" | "image" | "tour" | "booking" | "loading";

export const CustomCursor = React.memo(() => {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Determine cursor variant based on elements or data-attributes
      if (target.closest("[data-cursor='loading']")) {
        setVariant("loading");
      } else if (target.closest("[data-cursor='booking']")) {
        setVariant("booking");
      } else if (target.closest("[data-cursor='tour']")) {
        setVariant("tour");
      } else if (target.closest("img") || target.closest("[data-cursor='image']")) {
        setVariant("image");
      } else if (target.closest("[data-cursor='card']")) {
        setVariant("card");
      } else if (target.closest("a") || target.closest("[data-cursor='link']")) {
        setVariant("link");
      } else if (target.closest("button") || target.closest("[data-cursor='button']") || target.closest('[role="button"]') || target.closest("input[type='submit']")) {
        setVariant("button");
      } else {
        setVariant("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isMobile, isVisible]);

  if (isMobile) return null;

  const variants = {
    default: { scale: 1, backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.5)", backdropFilter: "blur(4px)" },
    button: { scale: 1.5, backgroundColor: "rgba(232, 130, 42, 0.2)", border: "2px solid rgba(232, 130, 42, 1)", filter: "drop-shadow(0 0 10px rgba(232, 130, 42, 0.6))" },
    link: { scale: 1.2, backgroundColor: "rgba(16, 185, 129, 0.2)", border: "2px solid rgba(16, 185, 129, 0.8)", filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))" },
    card: { scale: 1.2, backgroundColor: "rgba(139, 92, 246, 0.2)", border: "2px solid rgba(139, 92, 246, 0.8)", filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))" },
    image: { scale: 1.2, backgroundColor: "rgba(245, 158, 11, 0.2)", border: "2px solid rgba(245, 158, 11, 0.8)", filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))" },
    tour: { scale: 1.5, backgroundColor: "rgba(14, 165, 233, 0.2)", border: "2px solid rgba(14, 165, 233, 0.8)", filter: "drop-shadow(0 0 8px rgba(14, 165, 233, 0.6))" },
    booking: { scale: 1.5, backgroundColor: "rgba(236, 72, 153, 0.2)", border: "2px solid rgba(236, 72, 153, 0.8)", filter: "drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))" },
    loading: { scale: 1, backgroundColor: "transparent", border: "2px solid transparent" },
  };

  return (
    <>
      <style>{`
        body, a, button, input, select, textarea { cursor: none !important; }
      `}</style>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-visible mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
        variants={variants}
        animate={variant}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Inner Dot for default state to make it more visible */}
          {variant === "default" && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
          
          {variant === "button" && <Compass className="w-5 h-5 text-[#e8822a] animate-pulse" />}
          {variant === "link" && <Plane className="w-4 h-4 text-emerald-500" />}
          {variant === "card" && <MapPin className="w-4 h-4 text-violet-500" />}
          {variant === "image" && <Camera className="w-4 h-4 text-amber-500" />}
          {variant === "tour" && <Mountain className="w-5 h-5 text-sky-500" />}
          {variant === "booking" && <Ticket className="w-5 h-5 text-pink-500" />}
          {variant === "loading" && <Globe className="w-6 h-6 text-blue-500 animate-spin" />}
        </div>
      </motion.div>
    </>
  );
});
