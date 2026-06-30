import { Outlet, Navigate } from "react-router-dom";

const Wrapper = () => {
  const isLoggedIn = true; // replace with your auth logic

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default Wrapper;