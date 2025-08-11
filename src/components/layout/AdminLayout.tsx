import { Outlet } from "react-router";

export function AdminLayout() {
  return (
    <div>
      <h1>this is AdminLayout</h1>
      <Outlet />
    </div>
  );
}
