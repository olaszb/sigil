import { Outlet } from "react-router-dom";
import Navbar, { NavbarItem } from "../components/Navbar";
import { LayoutDashboard } from "lucide-react";
import HomeSVG from "./icons/HomeSVG";
import DashboardSVG from "./icons/DashboardSVG";

const MainLayout = () => {
  return (
    <div className="flex">
      <Navbar>
        <NavbarItem icon={<HomeSVG />} text="Home" to="/"/>
        <NavbarItem icon={<DashboardSVG />} text="Dashboard" to="/dashboard"/>
      </Navbar>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
