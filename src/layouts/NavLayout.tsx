import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const NavLayout = () => {
  return (


    <div className="flex flex-col-reverse h-dvh md:items-center md:flex-col
     min-h-screen
        bg-[#f9f7f5]
        bg-[radial-gradient(circle_at_82%_24%,rgba(248,215,225,0.42),transparent_32%),radial-gradient(circle_at_15%_80%,rgba(255,224,204,0.32),transparent_36%),radial-gradient(circle_at_55%_95%,rgba(255,235,220,0.24),transparent_38%)]">
      <Navbar />

      <main className="flex flex-1 w-full min-h-0 p-6 pb-20 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
};

export default NavLayout;