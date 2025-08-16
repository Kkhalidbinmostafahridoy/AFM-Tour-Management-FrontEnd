import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Registar";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/GenerateRourtes";
import { createBrowserRouter } from "react-router"; // ✅ keep this
import { adminSideBarItems } from "./adminSideBarItems";
import { userSideBarItems } from "./userSideBarItems";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/about",
        Component: About,
      },
    ],
  },
  {
    path: "/admin",
    Component: DashboardLayout,
    children: [...generateRoutes(adminSideBarItems)],
  },
  {
    path: "/user",
    Component: DashboardLayout,
    children: [...generateRoutes(userSideBarItems)],
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
]);
