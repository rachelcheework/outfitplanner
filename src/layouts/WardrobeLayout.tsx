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
    <div className="flex min-h-[calc(100vh-64px)]">

      {/* clothing category menu on md */}
      <aside className="hidden md:block w-56 border-r bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <div className="flex flex-col space-y-2">
          {categories.map((item) => (
            <NavLink
              key={item}
              to={`/wardrobe/${item}`}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-left capitalize transition ${isActive
                  ? "bg-blue-500 text-white"
                  : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* burger */}
      <Hamburger navToggle={navToggle} isOpen={isOpen} setIsOpen={setIsOpen} categories={categories}/>

      {/* sticker display */}
      <main className="mt-12 p-6">
        <h1 className="text-2xl font-bold capitalize">
          {category}
        </h1>

        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default WardrobeLayout
