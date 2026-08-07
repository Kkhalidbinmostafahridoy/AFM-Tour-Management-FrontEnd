import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Registar";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/generateRourtes";
import { createBrowserRouter, Navigate } from "react-router"; // ✅ keep this
import { adminSideBarItems } from "./adminSideBarItems";
import { userSideBarItems } from "./userSideBarItems";
import { guideSideBarItems } from "./guideSideBarItems";
import { withAuth } from "@/utils/withAuth";
import { lazy } from "react";

import { role } from "@/constants/role";
import type { TRole } from "@/types/index.type";
import Home from "@/pages/Home";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentFail from "@/pages/PaymentFail";

import unAuthorize from "@/pages/UnAuthorize";
import TourDetails from "@/pages/TourDetails";
import Tours from "@/pages/Tours";
import Bookings from "@/pages/Bookings";
import Destinations from "@/pages/Destinations";
import Blog from "@/pages/Blog";

// Tour Manager unique routes — only pages not already in adminSideBarItems
const TMAssignedTours = lazy(() => import("@/pages/guide/AssignedTours"));
const TMSchedules = lazy(() => import("@/pages/tourManager/TourSchedules"));
const TMReports = lazy(() => import("@/pages/tourManager/TourReports"));
const TMProfile = lazy(() => import("@/pages/user/Profile"));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: withAuth(Home),
      },
      {
        Component: About,
        path: "about",
      },
      {
        Component: Tours,
        path: "tours",
      },
      {
        Component: Destinations,
        path: "destinations",
      },
      {
        Component: Blog,
        path: "blog",
      },
      {
        path: "tours/:id",
        Component: TourDetails,
      },
      {
        path: "bookings/:id",
        Component: Bookings,
      },
      {
        path: "payment/success",
        Component: PaymentSuccess,
      },
      {
        path: "payment/fail",
        Component: PaymentFail,
      },
      {
        path: "payment/cancel",
        Component: PaymentFail,
      },
    ],
  },
  {
    path: "/admin",
    Component: withAuth(DashboardLayout, [role.superAdmin, role.admin, role.tourManager, role.accountant] as TRole[]),
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> }, //admin e click krle pathiye dibe  /admin/analytics
      ...generateRoutes(adminSideBarItems),
      // Tour Manager unique routes (not in adminSideBarItems)
      { path: "/admin/assigned-tours", Component: TMAssignedTours },
      { path: "/admin/schedules", Component: TMSchedules },
      { path: "/admin/reports", Component: TMReports },
      { path: "/admin/tm-profile", Component: TMProfile },
    ],
  },
  {
    path: "/user",
    Component: withAuth(DashboardLayout, Object.values(role) as TRole[]),
    children: [
      {
        index: true,
        element: <Navigate to="/user/bookings" />,
      },
      ...generateRoutes(userSideBarItems),
      ...generateRoutes(guideSideBarItems),
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/verify",
    Component: Verify,
  },
  {
    path: "/unAuthorize",
    Component: unAuthorize,
  },
]);
