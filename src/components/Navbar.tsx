import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

import { IoPerson } from "react-icons/io5";

const Navbar = () => {
  const { signOut } = useAuth();
  const location = useLocation();


  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
  
    document.addEventListener("pointerdown", handleOutsideClick);
  
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  function handleLogout() {
    signOut();
  }

  function handleProfileClick() {
    if (window.innerWidth >= 768) {
      return;
    }
  
    setIsProfileMenuOpen((current) => !current);
  }

  

  const linkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);

    return (
      `px-2 py-2 px-4 rounded-full ${isActive
        ? "bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
        : "text-gray-800 hover:bg-gray-200/70"
      }`
    )
  }
    ;

  return (
    <nav className="flex h-14 justify-between items-center fixed bottom-0 w-full z-50 px-3 bg-white
    ring-1 ring-gray-200/5
    md:bg-white/70
    backdrop-blur-sm
    shadow-[0_4px_8px_rgba(0,0,0,0.08)]
    md:sticky md:top-0 md:border-t-0 md:w-fit md:px-6 md:py-3 md:mt-3 md:space-x-12 md:rounded-full md:justify-center ">
      <Link to="/wardrobe">
      <h1 className="hidden md:block font-medium text-xl text-gray-800">Wardrobe App</h1>
      </Link>

      <div className="flex justify-between md:text-sm w-full md:w-auto md:gap-2">
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

        <div ref={profileMenuRef} className="group relative">
          <button
            type="button"
            className={` p-2 border-0 rounded-full
            md:group-hover:bg-blue-500
            md:group-hover:text-white
            ${isProfileMenuOpen
                ? "bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                : "bg-transparent"
              }`}
            onClick={handleProfileClick}
          >
            <IoPerson size={20}/>
          </button>

          {/* MOBILE: click */}
          {isProfileMenuOpen && (
            <div
              className=" absolute bottom-full right-0 m-2 flex w-44 flex-col space-y-2 rounded-lg p-2 text-gray-800
              ring-1 ring-black/5
            bg-white
              backdrop-blur-3xl
              shadow-[0_5px_10px_rgba(0,0,0,0.08)]
              md:hidden
            "
            >
            <Link
              to="/forgot-password"
              onClick={() => setIsProfileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-left"
            >
              Change password
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-left"
            >
              Logout
            </button>
            </div>
          )}

          {/* DESKTOP: hover */}
          <div
            className="absolute right-0 top-full hidden w-44 flex-col space-y-2 rounded-lg p-2 text-gray-800
            ring-1 ring-black/5
          bg-white
            shadow-[0_5px_10px_rgba(0,0,0,0.08)]
            md:group-hover:flex
          "
          >
            <Link
              to="/forgot-password"
              onClick={() => setIsProfileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-left hover:bg-gray-100"
            >
              Change password
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-left hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
