import AddDivision from "@/pages/admin/AddDivision";
import { AddTour } from "@/pages/admin/AddTour";
import { AddTourType } from "@/pages/admin/AddTourType";
import type { ISidebarItem } from "@/types/index.type";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/admin/Analytics"));
const ManageGuides = lazy(() => import("@/pages/admin/ManageGuides"));
const ManageHotels = lazy(() => import("@/pages/admin/ManageHotels"));
const ManageTransports = lazy(() => import("@/pages/admin/ManageTransports"));
const ManageBlogs = lazy(() => import("@/pages/admin/ManageBlogs"));
const ManageBanners = lazy(() => import("@/pages/admin/ManageBanners"));
const ManageCoupons = lazy(() => import("@/pages/admin/ManageCoupons"));
const ManageFAQs = lazy(() => import("@/pages/admin/ManageFAQs"));
const ManageNewsletter = lazy(() => import("@/pages/admin/ManageNewsletter"));
const ManageDestinations = lazy(() => import("@/pages/admin/ManageDestinations"));
const ManageBookings = lazy(() => import("@/pages/admin/ManageBookings"));

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
    title: "Bookings & Payments",
    items: [
      {
        title: "All Bookings",
        url: "/admin/bookings",
        component: ManageBookings,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Tour List",
        url: "/admin/add-tour-type",
        component: AddTourType,
      },
      {
        title: "Division List",
        url: "/admin/add-division",
        component: AddDivision,
      },
      {
        title: "All Tours",
        url: "/admin/add-tour",
        component: AddTour,
      },
      {
        title: "Destinations",
        url: "/admin/destinations",
        component: ManageDestinations,
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        title: "Hotels",
        url: "/admin/hotels",
        component: ManageHotels,
      },
      {
        title: "Transports",
        url: "/admin/transports",
        component: ManageTransports,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "Blogs",
        url: "/admin/blogs",
        component: ManageBlogs,
      },
      {
        title: "Banners",
        url: "/admin/banners",
        component: ManageBanners,
      },
      {
        title: "FAQs",
        url: "/admin/faqs",
        component: ManageFAQs,
      },
    ],
  },
  {
    title: "Marketing",
    items: [
      {
        title: "Coupons",
        url: "/admin/coupons",
        component: ManageCoupons,
      },
      {
        title: "Newsletter",
        url: "/admin/newsletter",
        component: ManageNewsletter,
      },
    ],
  },
  {
    title: "User & Team",
    items: [
      {
        title: "Manage Guides",
        url: "/admin/guides",
        component: ManageGuides,
      },
    ],
  },
];
