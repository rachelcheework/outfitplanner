import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavLayout from "./layouts/NavLayout";
import WardrobeLayout from "./layouts/WardrobeLayout";
import SignUp from "./SignUp";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Wrapper from "./Wrapper";
import Wardrobe from "./features/WardrobeDisplay/pages/Wardrobe";
import Dnd from "./features/DragnDrop/pages/Dnd";
import OutfitPage from "./features/OutfitBuilder/pages/OutfitPage";
import CollectionPage from "./features/OutfitCollection/pages/CollectionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

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
            <Route path="/outfits" element={<OutfitPage />} />
            <Route path="/collection" element={<CollectionPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}