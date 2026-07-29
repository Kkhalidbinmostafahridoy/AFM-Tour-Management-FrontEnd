import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";
import type { TRole } from "@/types/index.type";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

// important fore route
export const withAuth = (Component: ComponentType, requiredRole?: TRole | TRole[]) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (!isLoading && !data?.data?.email) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && !isLoading) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const userRole = data?.data?.role?.toUpperCase().replace(/_/g, "");
      const normalizedAllowedRoles = allowedRoles.map((r: string) => r.toUpperCase().replace(/_/g, ""));
      
      if (!normalizedAllowedRoles.includes(userRole)) {
        return <Navigate to="/unAuthorize" />;
      }
    }
    console.log("inside with Auth", data);

    return <Component />;
  };
};
