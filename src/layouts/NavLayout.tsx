import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const NavLayout = () => {
  return (
    <div className="flex flex-col-reverse md:min-h-screen md:flex-col">
      <Navbar />

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default NavLayout;