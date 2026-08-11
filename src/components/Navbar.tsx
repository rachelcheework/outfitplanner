import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { signOut } = useAuth();
  const location = useLocation();


  function handleLogout() {
    signOut();
  }

  const linkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);

    return (
    `px-4 py-2 rounded ${
      isActive
        ? "bg-blue-500 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`
  )
  }
   ;

  return (
    <nav className="w-full flex justify-between items-center fixed bottom-0 border-t md:static md:border-t-0 md:border-b bg-white md:px-6 md:py-3 ">
      <h1 className="hidden md:block font-bold text-lg">Wardrobe App</h1>

      <div className="flex justify-between w-full md:w-auto md:gap-2">
        <Link to="/wardrobe" className={linkClass("/wardrobe")}>
          Wardrobe
        </Link>
        <Link to="/dnd" className={linkClass("/dnd")}>
          DnD
        </Link>
        <Link to="/outfits" className={linkClass("/outfits")}>
          Outfits
        </Link>
        <Link to="/collection" className={linkClass("/collection")}>
          Collection
        </Link>

        <button onClick={handleLogout} className="px-4 py-2  border-0 rounded-lg hover:bg-red-400 hover:text-white">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
