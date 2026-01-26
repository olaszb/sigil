import { Outlet } from "react-router-dom";
import Navbar, { NavbarItem } from "../components/Navbar";
import { LayoutDashboard } from "lucide-react";
import HomeSVG from "./icons/HomeSVG";
import DashboardSVG from "./icons/DashboardSVG";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-secondary-bg">
      <Navbar>
        <NavbarItem icon={<HomeSVG />} text="Home" to="/"/>
        <NavbarItem icon={<DashboardSVG />} text="Dashboard" to="/dashboard"/>
      </Navbar>


      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
