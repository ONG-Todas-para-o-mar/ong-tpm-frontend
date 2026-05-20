import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Layout() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  const path = location.pathname;
  const isAuthPage = path === "/login" || path === "/cadastro";
  const isAdminPage = path.startsWith("/admin");
  const hideFooter = isAuthPage || (isAdmin && isAdminPage);

  return (
    <div data-screen-label={"Route — " + path}>
      <Header />
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
