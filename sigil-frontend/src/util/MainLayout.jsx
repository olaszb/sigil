import { Outlet } from "react-router-dom";
import Navbar, { NavbarItem } from "../components/Navbar";
import HomeSVG from "./icons/HomeSVG";
import DashboardSVG from "./icons/DashboardSVG";
import QuillSVG from "./icons/QuillSVG";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import ClockSVG from "./icons/ClockSVG";
import { MapPinned } from "lucide-react";
import LibrarySVG from "./icons/LibrarySVG";
const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-secondary-bg">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={true} closeOnClick={true} closeButton={false} />
      <Navbar>
        <NavbarItem icon={<HomeSVG size="120%"/>} text="Home" to="/"/>
        <NavbarItem icon={<LibrarySVG size="90%"/>} text="All Events" to="/events" />
        <NavbarItem icon={<ClockSVG size="130%"/>} text="Past Events" to="/past-events" />
        {(user && user.role !== 'user') && (
          <>
            <NavbarItem icon={<QuillSVG size="100%" />} text="Create Event" to="/create-event"/>
            <NavbarItem icon={<DashboardSVG size="90%"/>} text="Dashboard" to="/dashboard"/>
          </>
        )}
        {user && user.role === 'admin' && (
          <NavbarItem icon={<MapPinned className="text-parchment" strokeWidth={1} size={35} />} text="Venues" to="/venues"/>
        )

        }

      </Navbar>


      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
