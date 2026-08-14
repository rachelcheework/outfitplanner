import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const NavLayout = () => {
  return (
    <div className="flex flex-col-reverse md:items-center md:h-screen md:flex-col">
      <Navbar />

      <main className="flex-1 w-full min-h-0 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default NavLayout;