import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background/95">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md px-4 shadow-sm">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-sm font-medium">Tour Management Dashboard</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Suspense fallback={
              <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              </div>
            }>
              <Outlet key={location.pathname} />
            </Suspense>
          </AnimatePresence>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
