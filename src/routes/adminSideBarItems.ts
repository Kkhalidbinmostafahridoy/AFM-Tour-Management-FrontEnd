import AddTour from "@/pages/admin/AddTour";
import { AddTourType } from "@/pages/admin/AddTourType";
import type { ISidebarItem } from "@/types/index.type";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/admin/Analytics")); //for routing lazy load better for import

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
