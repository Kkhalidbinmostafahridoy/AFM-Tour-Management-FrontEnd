import GuideDashboard from "@/pages/guide/GuideDashboard";
import AssignedTours from "@/pages/guide/AssignedTours";
import GuideEarnings from "@/pages/guide/GuideEarnings";
import GuideLeaves from "@/pages/guide/GuideLeaves";
import Profile from "@/pages/user/Profile";
import ChangePassword from "@/pages/user/ChangePassword";
import GuideDocuments from "@/pages/guide/GuideDocuments";
import type { ISidebarItem } from "@/types/index.type";

export const guideSideBarItems: ISidebarItem[] = [
  {
    title: "DashBoard",
    items: [
      {
        title: "Overview",
        url: "/user/guide-dashboard",
        component: GuideDashboard,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Assigned Tours",
        url: "/user/assigned-tours",
        component: AssignedTours,
      },
      {
        title: "Verification & Docs",
        url: "/user/guide-documents",
        component: GuideDocuments,
      },
      {
        title: "Availability & Leaves",
        url: "/user/guide-leaves",
        component: GuideLeaves,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Monthly Earnings",
        url: "/user/guide-earnings",
        component: GuideEarnings,
      },
      {
        title: "My Profile",
        url: "/user/profile",
        component: Profile,
      },
      {
        title: "Change Password",
        url: "/user/change-password",
        component: ChangePassword,
      },
    ],
  },
];
