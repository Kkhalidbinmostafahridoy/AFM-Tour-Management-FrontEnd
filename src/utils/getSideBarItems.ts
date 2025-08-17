import { role } from "@/constants/role";
import { adminSideBarItems } from "@/routes/adminSideBarItems";
import { userSideBarItems } from "@/routes/userSideBarItems";
import type { TRole } from "@/types/index.type";

export const getSidebarItems = (userRole: TRole) => {
  switch (userRole) {
    case role.superAdmin:
      return [...adminSideBarItems, ...userSideBarItems]; //access dashboard
    case role.admin:
      return [...adminSideBarItems, ...userSideBarItems]; // for access dashboard
    case role.user:
      return [...userSideBarItems];
    default:
      return [];
  }
};
