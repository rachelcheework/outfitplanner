import { NavLink } from "react-router";
import type { ClothingCategory } from "../constants/Categories";

interface HamburgerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navToggle: () => void;
  categories: readonly ClothingCategory[]
}

const Hamburger = ({ isOpen, setIsOpen, navToggle, categories }: HamburgerProps) => {

  const handleNavLinkClick = () => {
    

    setTimeout(() => {
      setIsOpen(false);;
    }, 300);
  }

  return (
    <div>
      {/* hamburger */}
      <div className="absolute top-10 left-10">
        <button
          onClick={navToggle}
          className="relative z-70 block h-6 w-6 cursor-pointer transition-all duration-200 focus:outline-none md:hidden"
        >
          <span
            className={`absolute left-0 top-0 h-0.5 w-6 bg-black transition-all duration-500 transform ${isOpen ? "bg-white rotate-45 translate-y-1.75" : ""
              }`}
          />
          <span
            className={`absolute left-0 top-0 h-0.5 w-6 bg-black transition-all duration-500 ${isOpen ? "opacity-0" : "translate-y-1.75 opacity-100"
              }`}
          />
          <span
            className={`absolute left-0 top-0 h-0.5 w-6 bg-black transition-all duration-500 ${isOpen
              ? "bg-white -rotate-45 translate-y-1.75"
              : "translate-y-3.5"
              }`}
          />
        </button>
      </div>

      {/* mobile menu */}
      <div className={`flex absolute z-50 top-0 bottom-0 left-0 flex-col self-end w-full min-h-screen py-1 pt-36 px-12 space-y-6 text-md text-white bg-black transition-all duration-750 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {categories.map((item) => {
          return (
              <NavLink
                key={item}
                to={`/wardrobe/${item}`}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-left capitalize transition ${isActive
                    ? "bg-blue-500 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                  }`
                }
                onClick={handleNavLinkClick}
              >
                {item}
              </NavLink>
          )

        })}
      </div>

    </div>

  )
}

export default Hamburger
