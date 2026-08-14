import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { signOut } = useAuth();
  const location = useLocation();


  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    signOut();
  }

  const linkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);

    return (
      `px-2 py-2 md: px-4 rounded ${isActive
        ? "bg-blue-500 text-white"
        : "text-gray-600 hover:bg-gray-100"
      }`
    )
  }
    ;

  return (
    <nav className="flex h-10 justify-between items-center fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:sticky md:top-0 md:border-t-0 md:border-b md:px-6 md:py-3 ">
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

        <div className="relative"
        ref={profileMenuRef}>
          <button
            type="button"
            onClick={() =>
              setIsProfileMenuOpen((current) => !current)
            }
            className="px-2 md:px-4 py-2 border-0 rounded-lg hover:bg-blue-500 hover:text-white"
          >
            Profile
          </button>

          {isProfileMenuOpen && (
            <div
              className="
        absolute
        bottom-full
        right-0
        mb-2
        flex
        w-44
        flex-col
        rounded-lg
        border
        bg-white
        p-2
        shadow-lg
        mx-3

        md:top-full
        md:bottom-auto
        md:mt-2
        md:mb-0
      "
            >
              <Link
                to="/forgot-password"
                onClick={() => setIsProfileMenuOpen(false)}
                className="rounded px-3 py-2 text-left hover:bg-gray-100"
              >
                Forgot password
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded px-3 py-2 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* <button onClick={handleLogout} className="px-2 md:px-4 py-2 border-0 rounded-lg hover:bg-red-400 hover:text-white">Logout</button> */}
      </div>
    </nav>
  );
}

export default Navbar;
