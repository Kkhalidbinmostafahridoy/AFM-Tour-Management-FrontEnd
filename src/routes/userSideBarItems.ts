import Bookings from "@/pages/user/Bookings";
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
    ],
  },
];
