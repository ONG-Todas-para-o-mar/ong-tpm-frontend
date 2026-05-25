import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";

import Home from "./pages/public/Home.jsx";
import About from "./pages/public/About.jsx";
import Projects from "./pages/public/Projects.jsx";
import Blog from "./pages/public/Blog.jsx";
import Donate from "./pages/public/Donate.jsx";
import Contact from "./pages/public/Contact.jsx";
import Ranking from "./pages/public/Ranking.jsx";

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminRanking from "./pages/admin/AdminRanking.jsx";
import AdminCampaigns from "./pages/admin/AdminCampaigns.jsx";

import { useAuth } from "./hooks/useAuth.jsx";

function RequireAdmin({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="sobre" element={<About />} />
        <Route path="projetos" element={<Projects />} />
        <Route path="noticias" element={<Blog />} />
        <Route path="doar" element={<Donate />} />
        <Route path="contato" element={<Contact />} />
        <Route path="ranking" element={<Ranking />} />

        <Route path="login" element={<Login />} />
        <Route path="cadastro" element={<Signup />} />

        <Route
          path="admin"
          element={
            <RequireAdmin>
              <Dashboard />
            </RequireAdmin>
          }
        />
        <Route
          path="admin/ranking"
          element={
            <RequireAdmin>
              <AdminRanking />
            </RequireAdmin>
          }
        />
        <Route
          path="admin/campanhas"
          element={
            <RequireAdmin>
              <AdminCampaigns />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
