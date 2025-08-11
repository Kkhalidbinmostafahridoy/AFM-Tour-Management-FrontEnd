import type { ReactNode } from "react";
import { Footer } from "./Footer";
import Navbar from "./Navbar";

interface IProps {
  children: ReactNode;
}
export function CommonLayout({ children }: IProps) {
  return (
    // min-h-screen use kora hy jate full height hoy
    <div className="min-h-screen  flex flex-col">
      <Navbar />
      {/* //grow-1 use kora hy navbar and footer constant rakhar jonno */}
      <div className="grow-1">{children}</div>
      <Footer />
    </div>
  );
}
