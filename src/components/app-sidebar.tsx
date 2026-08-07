import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/assets/icons/Logo";
import { Link, useLocation } from "react-router";
import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";
import { getSidebarItems } from "@/utils/getSideBarItems";
import {
  LayoutDashboard,
  BarChart3,
  Ticket,
  Plane,
  Map,
  MapPin,
  Building2,
  Bus,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  Tag,
  Mail,
  Users,
  Heart,
  UserCircle,
  KeyRound,
  LifeBuoy,
  Briefcase,
  History,
  Settings,
} from "lucide-react";

// Mapping icons for items based on their title
const itemIconMap: Record<string, React.ElementType> = {
  "Analytics": BarChart3,
  "All Bookings": Ticket,
  "Tour List": Plane,
  "Division List": Map,
  "All Tours": Plane,
  "Destinations": MapPin,
  "Hotels": Building2,
  "Transports": Bus,
  "Blogs": FileText,
  "Banners": ImageIcon,
  "FAQs": HelpCircle,
  "Coupons": Tag,
  "Newsletter": Mail,
  "Manage Guides": Users,
  "Bookings": Ticket,
  "My Wishlist": Heart,
  "My Profile": UserCircle,
  "Change Password": KeyRound,
  "Support Tickets": LifeBuoy,
  "Overview": LayoutDashboard,
  "Assigned Tours": Plane,
  "Availability & Leaves": Ticket,
  "Monthly Earnings": BarChart3,
};

// Mapping icons for groups based on their title
const groupIconMap: Record<string, React.ElementType> = {
  "DashBoard": LayoutDashboard,
  "Bookings & Payments": Briefcase,
  "Tour Management": Map,
  "Services": Building2,
  "Content": FileText,
  "Marketing": Tag,
  "User & Team": Users,
  "History": History,
  "Account": Settings,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useUserInfoQuery(undefined);
  const location = useLocation();

  const data = {
    navMain: getSidebarItems(userData?.data?.role),
  };

  return (
    <Sidebar {...props} className="border-r border-sidebar-border bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl">
      <SidebarHeader className="items-center py-6">
        <Link to="/" className="hover:scale-105 transition-transform duration-300 drop-shadow-md">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4 gap-6 pb-6">
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain?.map((group) => {
          const GroupIcon = groupIconMap[group.title] || LayoutDashboard;
          return (
            <SidebarGroup key={group.title} className="p-0">
              <SidebarGroupLabel className="flex items-center gap-2 px-3 py-4 mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase rounded-xl bg-slate-100/80 dark:bg-slate-800/80 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <GroupIcon className="w-4 h-4 text-violet-500 drop-shadow-sm" />
                <span className="bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">{group.title}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {group.items?.map((item) => {
                    const ItemIcon = itemIconMap[item.title] || LayoutDashboard;
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive}
                          className={`group flex items-center gap-3 px-4 py-5 rounded-xl transition-all duration-300 ${
                            isActive 
                              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-md shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 hover:text-white border border-violet-500/20" 
                              : "text-slate-600 hover:bg-violet-50/80 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-300 hover:shadow-sm"
                          }`}
                        >
                          <Link to={item.url}>
                            <ItemIcon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-md text-white" : "text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:scale-110"}`} />
                            <span className="text-[14.5px] tracking-tight">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
