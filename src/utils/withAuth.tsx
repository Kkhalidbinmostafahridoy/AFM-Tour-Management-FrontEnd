import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";
import type { TRole } from "@/types/index.type";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

// important fore route
export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (!isLoading && !data?.data?.email) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
      return <Navigate to="/unAuthorize" />;
    }
    console.log("inside with Auth", data);

    return <Component />;
  };
};
