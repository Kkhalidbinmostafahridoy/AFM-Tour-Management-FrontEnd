import { Outlet } from "react-router";
import { CommonLayout } from "./components/layout/CommonLayout";
import { generateRoutes } from "./utils/GenerateRourtes";
import { adminSideBarItems } from "./routes/adminSideBarItems";

function App() {
  console.log(generateRoutes(adminSideBarItems));
  return (
    <>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </>
  );
}

export default App;
