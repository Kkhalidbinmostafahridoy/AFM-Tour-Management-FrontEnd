import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";
import type { TRole } from "@/types/index.type";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

// important fore route
export const withAuth = (Component: ComponentType, requiredRole?: TRole | TRole[]) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (isLoading) {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      );
    }

    if (!data?.data?.email) {
      return <Navigate to="/login" />;
    }

    if (requiredRole) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const userRole = data?.data?.role?.toUpperCase();
      const normalizedAllowedRoles = allowedRoles.map((r: string) => r.toUpperCase());
      
      if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
        return <Navigate to="/unAuthorize" />;
      }
    }

    return <Component />;
  };
};
