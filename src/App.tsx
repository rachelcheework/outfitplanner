import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavLayout from "./layouts/NavLayout";
import WardrobeLayout from "./layouts/WardrobeLayout";
import SignUp from "./features/SignUp";
import Login from "./features/Login";
import Wrapper from "./features/Wrapper";
import Wardrobe from "./features/WardrobeDisplay/pages/Wardrobe";
import Outfits from "./features/Outfits";
import Dnd from "./features/DragnDrop/pages/Dnd";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route element={<Wrapper />}>
          {/* Shared layout */}
          <Route element={<NavLayout />}>

            {/* dropzone page */}
            <Route path="/dnd" element={<Dnd />} />

            {/* wardrobe page */}
            <Route path="/wardrobe" element={<WardrobeLayout />}>
              <Route index element={<Navigate to="tops" replace />} />
              <Route path=":category" element={<Wardrobe />} />
            </Route>

            {/* other pages */}
            <Route path="/outfits" element={<Outfits />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}