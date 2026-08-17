import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const NavLayout = () => {
  return (
    <div className="flex flex-col-reverse h-dvh md:items-center md:flex-col bg-red-500">
      <Navbar />

      <main className="flex flex-1 w-full min-h-0 p-6 pb-20 md:pb-6 bg-blue-600">
        <Outlet />
      </main>
    </div>
  );
};

export default NavLayout;