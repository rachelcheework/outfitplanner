import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const NavLayout = () => {
  return (
    <div className="flex flex-col-reverse md:h-screen md:flex-col">
      <Navbar />

      <main className="flex-1 min-h-0 p-6 over bg-green-500">
        <Outlet />
      </main>
    </div>
  );
};

export default NavLayout;