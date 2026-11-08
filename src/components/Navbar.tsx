import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

import { IoPerson } from "react-icons/io5";
import { FaTshirt, FaUpload } from "react-icons/fa";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsFillCollectionFill } from "react-icons/bs";


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
      `flex h-11 w-11 items-center justify-center rounded-full
       lg:h-auto lg:w-auto lg:px-4 lg:py-2
      ${isActive
        ? "bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
        : "text-gray-800 hover:bg-gray-200/70"
      }`
    )
  };

  return (
    <div className="">
      {/* desktop nav */}
      <nav className="hidden lg:flex sticky top-0 left-6 right-6 h-12 z-50
      items-center justify-center w-fit px-6 py-3 mt-3 space-x-12  border-t-0 rounded-full 
      ring-1 ring-gray-200/5
      bg-white/70
      backdrop-blur-sm
      shadow-[0_4px_8px_rgba(0,0,0,0.08)]
      ">
        <Link to="/wardrobe">
          <h1 className="hidden lg:block font-medium text-xl text-gray-800">Wardrobe App</h1>
        </Link>

        <div className="flex w-full justify-between items-center px-3 lg:text-sm lg:w-auto lg:gap-2 lg:px-0">
          <Link to="/wardrobe" className={linkClass("/wardrobe")}>
            <p>Wardrobe</p>
          </Link>
          <Link to="/dnd" className={linkClass("/dnd")}>
            <p>Upload</p>
          </Link>
          <Link to="/outfits" className={linkClass("/outfits")}>
            <p>Outfits</p>
          </Link>
          <Link to="/collection" className={linkClass("/collection")}>
            <p>Collection</p>
          </Link>

          <div ref={profileMenuRef} className="group relative">
            <button
              type="button"
              className={` p-2 border-0 rounded-full
            lg:group-hover:bg-blue-500/80
             lg:group-hover:ring-1 
             lg:group-hover:ring-black/5 
             lg:group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.08)]
            lg:group-hover:text-white
            ${isProfileMenuOpen
                  ? "bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  : "bg-transparent"
                }`}
              onClick={handleProfileClick}
            >
              <IoPerson size={20} />
            </button>

            {/* MOBILE: click */}
            {isProfileMenuOpen && (
              <div
                className=" absolute bottom-full right-0 m-2 flex w-44 flex-col space-y-2 rounded-lg p-2 text-gray-800
              ring-1 ring-black/5
            bg-white
              backdrop-blur-3xl
              shadow-[0_5px_10px_rgba(0,0,0,0.08)]
              lg:hidden
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
            lg:group-hover:flex
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

      {/* mobile nav */}
      <nav className="lg:hidden flex h-12 items-center fixed bottom-3 left-6 right-6 z-50 rounded-full justify-center
    ring-1 ring-gray-200/5
    bg-white/70
    backdrop-blur-sm
    shadow-[0_4px_8px_rgba(0,0,0,0.08)]
    lg:sticky lg:top-0 lg:border-t-0 lg:w-fit lg:px-6 lg:py-3 lg:mt-3 lg:space-x-12">
        <Link to="/wardrobe">
          <h1 className="hidden lg:block font-medium text-xl text-gray-800">Wardrobe App</h1>
        </Link>

        <div className="flex w-full justify-between items-center px-3 lg:text-sm lg:w-auto lg:gap-2 lg:px-0">
          <Link to="/wardrobe" className={linkClass("/wardrobe")}>
            <FaTshirt size={24} className="lg:hidden" />
            <p className="hidden lg:flex">Wardrobe</p>
          </Link>
          <Link to="/dnd" className={linkClass("/dnd")}>
            <FaUpload size={24} className="lg:hidden" />
            <p className="hidden lg:flex">Upload</p>
          </Link>
          <Link to="/outfits" className={linkClass("/outfits")}>
            <AiOutlineAppstoreAdd size={24} className="lg:hidden" />
            <p className="hidden lg:flex">Outfits</p>
          </Link>
          <Link to="/collection" className={linkClass("/collection")}>
            <BsFillCollectionFill size={24} className="lg:hidden" />
            <p className="hidden lg:flex">Collection</p>
          </Link>

          <div ref={profileMenuRef} className="group relative">
            <button
              type="button"
              className={` p-2 border-0 rounded-full
            lg:group-hover:bg-blue-500/80
             lg:group-hover:ring-1 
             lg:group-hover:ring-black/5 
             lg:group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.08)]
            lg:group-hover:text-white
            ${isProfileMenuOpen
                  ? "bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  : "bg-transparent"
                }`}
              onClick={handleProfileClick}
            >
              <IoPerson size={20} />
            </button>

            {/* MOBILE: click */}
            {isProfileMenuOpen && (
              <div
                className=" absolute bottom-full right-0 m-2 flex w-44 flex-col space-y-2 rounded-lg p-2 text-gray-800
              ring-1 ring-black/5
            bg-white
              backdrop-blur-3xl
              shadow-[0_5px_10px_rgba(0,0,0,0.08)]
              lg:hidden
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
            lg:group-hover:flex
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
    </div>
  );
}

export default Navbar;
