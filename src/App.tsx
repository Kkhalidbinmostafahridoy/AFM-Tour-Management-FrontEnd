import { Outlet } from "react-router";
import { CommonLayout } from "./components/layout/CommonLayout";
import { generateRoutes } from "./utils/generateRourtes";
import { adminSideBarItems } from "./routes/adminSideBarItems";

function App() {
  return (
    <>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </>
  );
}

export default App;
