import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Registar";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/GenerateRourtes";
import { createBrowserRouter, Navigate } from "react-router"; // ✅ keep this
import { adminSideBarItems } from "./adminSideBarItems";
import { userSideBarItems } from "./userSideBarItems";
import { withAuth } from "@/utils/withAuth";
import unAuthorize from "@/pages/unAuthorize";
import { role } from "@/constants/role";
import type { TRole } from "@/types/index.type";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "about",
        Component: withAuth(About),
      },
    ],
  },
  {
    path: "/admin",
    Component: withAuth(DashboardLayout, role.superAdmin as TRole),
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> }, //admin e click krle pathiye dibe  /admin/analytics
      ...generateRoutes(adminSideBarItems),
    ],
  },
  {
    path: "/user",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/user/bookings" />,
      },
      ...generateRoutes(userSideBarItems),
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
