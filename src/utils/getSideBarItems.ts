import { adminSideBarItems } from "@/routes/adminSideBarItems";
import { userSideBarItems } from "@/routes/userSideBarItems";

export const getSidebarItems = (userRole: string) => {
  const normalizedUserRole = userRole?.toUpperCase().replace(/_/g, "");
  switch (normalizedUserRole) {
    case "SUPERADMIN":
      return [...adminSideBarItems, ...userSideBarItems]; //access dashboard
    case "ADMIN":
      return [...adminSideBarItems, ...userSideBarItems]; // for access dashboard
    case "USER":
      return [...userSideBarItems];
    default:
      return [];
  }
};
