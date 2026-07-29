import Bookings from "@/pages/user/Bookings";
import Profile from "@/pages/user/Profile";
import ChangePassword from "@/pages/user/ChangePassword";
import Wishlist from "@/pages/user/Wishlist";
import UserTickets from "@/pages/user/UserTickets";
import type { ISidebarItem } from "@/types/index.type";

export const userSideBarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "Bookings",
        url: "/user/bookings",
        component: Bookings,
      },
      {
        title: "My Wishlist",
        url: "/user/wishlist",
        component: Wishlist,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "My Profile",
        url: "/user/profile",
        component: Profile,
      },
      {
        title: "Change Password",
        url: "/user/change-password",
        component: ChangePassword,
      },
      {
        title: "Support Tickets",
        url: "/user/tickets",
        component: UserTickets,
      },
    ],
  },
];
