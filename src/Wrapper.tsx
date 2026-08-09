import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";


const Wrapper = () => {
  const { session, isUserLoading } = useAuth();

  if (isUserLoading) {
    return <p>Loading...</p>;
  }

  return session ? <Outlet /> : <Navigate to="/" replace />;
};

export default Wrapper;