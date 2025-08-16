import AddTour from "@/pages/admin/AddTour";
import AddTourType from "@/pages/admin/AddTourType";
import { Analytics } from "@/pages/admin/Analytics";
import type { ISidebarItem } from "@/types/index.type";

export const adminSideBarItems: ISidebarItem[] = [
  {
    title: "DashBoard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Add Tour",
        url: "/admin/add-tour",
        component: AddTour,
      },
      {
        title: "Add Tour Type",
        url: "/admin/add-tour-type",
        component: AddTourType,
      },
    ],
  },
];
