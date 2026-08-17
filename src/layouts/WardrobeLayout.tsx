import { NavLink, useParams, Outlet } from "react-router-dom";
import Hamburger from "../components/Hamburger";
import { useState } from "react";
import { clothingCategories } from "../constants/Categories";

const categories = clothingCategories;

const WardrobeLayout = () => {
  const { category = "tops" } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const navToggle = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-1 h-full min-h-0 w-full bg-green-500">

      {/* clothing category menu on md */}
      <aside className="hidden h-full shrink-0 md:block w-56 rounded-xl border-0 bg-gray-100 p-4">
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <div className="flex flex-col space-y-2">
          {categories.map((item) => (
            <NavLink
              key={item}
              to={`/wardrobe/${item}`}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-left capitalize transition ${isActive
                  ? "bg-blue-500 text-white"
                  : "text-slate-700 hover:bg-white"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* burger */}
      <Hamburger navToggle={navToggle} isOpen={isOpen} setIsOpen={setIsOpen} categories={categories} />

      {/* sticker display */}
      <main className="flex min-h-0 min-w-0 flex-1 p-3 flex-col mt-12 md:mt-0 md:p-6 ">
        <h1 className="text-2xl px-3 font-bold capitalize">
          {category}
        </h1>

        <div className="min-h-0 flex-1 mt-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default WardrobeLayout
