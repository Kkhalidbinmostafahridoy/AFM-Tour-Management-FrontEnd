import { adminSideBarItems } from "@/routes/adminSideBarItems";
import { userSideBarItems } from "@/routes/userSideBarItems";
import { guideSideBarItems } from "@/routes/guideSideBarItems";
import { tourManagerSideBarItems } from "@/routes/tourManagerSideBarItems";

export const getSidebarItems = (userRole: string) => {
  const normalizedUserRole = userRole?.toUpperCase().replace(/_/g, "");
  switch (normalizedUserRole) {
    case "SUPERADMIN":
    case "ADMIN":
    case "ACCOUNTANT":
      return [...adminSideBarItems, ...userSideBarItems];
    case "TOURMANAGER":
      return [...tourManagerSideBarItems];
    case "GUIDE":
      return [...guideSideBarItems];
    case "CUSTOMER":
    case "USER":
      return [...userSideBarItems];
    default:
      return [];
  }
};
