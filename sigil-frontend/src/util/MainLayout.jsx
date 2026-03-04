import { Outlet } from "react-router-dom";
import Navbar, { NavbarItem } from "../components/Navbar";
import HomeSVG from "./icons/HomeSVG";
import DashboardSVG from "./icons/DashboardSVG";
import QuillSVG from "./icons/QuillSVG";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import ClockSVG from "./icons/ClockSVG";
const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-secondary-bg">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={true} closeOnClick={true} closeButton={false} />
      <Navbar>
        <NavbarItem icon={<HomeSVG />} text="Home" to="/"/>
        <NavbarItem icon={<ClockSVG />} text="Past Events" to="/past-events" />
        {(user && user.role !== 'user') && (
          <>
            <NavbarItem icon={<QuillSVG />} text="Create Event" to="/create-event"/>
            <NavbarItem icon={<DashboardSVG />} text="Dashboard" to="/dashboard"/>
          </>
        )}
        {user && user.role === 'admin' && (
          <NavbarItem icon={<HomeSVG />} text="Venues" to="/venues"/>
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
