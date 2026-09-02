import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (


    <main className="
        min-h-screen
        bg-[#f9f7f5]
        bg-[radial-gradient(circle_at_82%_24%,rgba(248,215,225,0.42),transparent_32%),radial-gradient(circle_at_15%_80%,rgba(255,224,204,0.32),transparent_36%),radial-gradient(circle_at_55%_95%,rgba(255,235,220,0.24),transparent_38%)]">
        <Outlet />

    </main>
  );
};

export default AuthLayout;