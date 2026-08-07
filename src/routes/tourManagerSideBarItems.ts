import { lazy } from "react";
import type { ISidebarItem } from "@/types/index.type";
import AddDivision from "@/pages/admin/AddDivision";
import { AddTour } from "@/pages/admin/AddTour";
import ManageTours from "@/pages/admin/ManageTours";
import { AddTourType } from "@/pages/admin/AddTourType";

const Analytics = lazy(() => import("@/pages/admin/Analytics"));
const ManageGuides = lazy(() => import("@/pages/admin/ManageGuides"));
const ManageHotels = lazy(() => import("@/pages/admin/ManageHotels"));
const ManageTransports = lazy(() => import("@/pages/admin/ManageTransports"));
const ManageDestinations = lazy(() => import("@/pages/admin/ManageDestinations"));
const ManageBookings = lazy(() => import("@/pages/admin/ManageBookings"));
const ManageUsers = lazy(() => import("@/pages/admin/ManageUsers"));
const Profile = lazy(() => import("@/pages/user/Profile"));
const AssignedTours = lazy(() => import("@/pages/guide/AssignedTours"));
const TourSchedules = lazy(() => import("@/pages/tourManager/TourSchedules"));
const TourReports = lazy(() => import("@/pages/tourManager/TourReports"));

// NOTE: URLs that overlap with adminSideBarItems are intentional —
// they render the same components for Tour Managers via the shared /admin route tree.
// Only truly unique routes (/admin/assigned-tours, /admin/schedules, /admin/reports, /admin/tm-profile)
// are NEW registrations.

export const tourManagerSideBarItems: ISidebarItem[] = [
  {
    title: "DashBoard",
    items: [
      {
        title: "Analytics & Reports",
        url: "/admin/analytics",
        component: Analytics,
      },
      {
        title: "Export Reports",
        url: "/admin/reports",
        component: TourReports,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Assigned Tours",
        url: "/admin/assigned-tours",
        component: AssignedTours,
      },
      {
        title: "Schedules",
        url: "/admin/schedules",
        component: TourSchedules,
      },
      {
        title: "All Tours",
        url: "/admin/tours",
        component: ManageTours,
      },
      {
        title: "Add Tour",
        url: "/admin/add-tour",
        component: AddTour,
      },
      {
        title: "Tour Types",
        url: "/admin/add-tour-type",
        component: AddTourType,
      },
      {
        title: "Destinations",
        url: "/admin/destinations",
        component: ManageDestinations,
      },
      {
        title: "Division List",
        url: "/admin/add-division",
        component: AddDivision,
      },
    ],
  },
  {
    title: "Bookings & Payments",
    items: [
      {
        title: "Booking Approval",
        url: "/admin/bookings",
        component: ManageBookings,
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
    title: "User & Team",
    items: [
      {
        title: "Guide Assignment",
        url: "/admin/guides",
        component: ManageGuides,
      },
      {
        title: "Customer Management",
        url: "/admin/users",
        component: ManageUsers,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "My Profile",
        url: "/admin/tm-profile",
        component: Profile,
      },
    ],
  },
];
