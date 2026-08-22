import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { LoadingState } from "./components/Shared.jsx";

import Home from "./pages/public/Home.jsx";
import About from "./pages/public/About.jsx";
import Projects from "./pages/public/Projects.jsx";
import ProjectDetail from "./pages/public/ProjectDetail.jsx";
import Blog from "./pages/public/Blog.jsx";
import Media from "./pages/public/Media.jsx";
import Feed from "./pages/public/Feed.jsx";
import PostDetail from "./pages/public/PostDetail.jsx";
import Donate from "./pages/public/Donate.jsx";
import Contact from "./pages/public/Contact.jsx";
import Ranking from "./pages/public/Ranking.jsx";
import Socios from "./pages/public/Socios.jsx";
import Transparency from "./pages/public/Transparency.jsx";
import NotFound from "./pages/public/NotFound.jsx";

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

const Account = lazy(() => import("./pages/member/Account.jsx"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const AdminRanking = lazy(() => import("./pages/admin/AdminRanking.jsx"));
const AdminCampaigns = lazy(() => import("./pages/admin/AdminCampaigns.jsx"));
const AdminNews = lazy(() => import("./pages/admin/AdminNews.jsx"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia.jsx"));
const AdminDonations = lazy(() => import("./pages/admin/AdminDonations.jsx"));
const AdminBadges = lazy(() => import("./pages/admin/AdminBadges.jsx"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages.jsx"));

import { useAuth } from "./hooks/useAuth.jsx";

function RequireAuth({ children }) {
  const { isAuthed } = useAuth();
  const location = useLocation();
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function RequireAdmin({ children }) {
  const { isAuthed, isAdmin } = useAuth();
  const location = useLocation();
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) return <Navigate to="/minha-conta" replace />;
  return children;
}

const Carregando = () => (
  <div className="wrap" style={{ padding: "96px 0" }}>
    <LoadingState />
  </div>
);

const admin = (element) => (
  <RequireAdmin>
    <Suspense fallback={<Carregando />}>{element}</Suspense>
  </RequireAdmin>
);

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="sobre" element={<About />} />
        <Route path="projetos" element={<Projects />} />
        <Route path="projetos/:id" element={<ProjectDetail />} />
        <Route path="noticias" element={<Blog />} />
        <Route path="noticias/:slug" element={<PostDetail />} />
        <Route path="tpm-na-midia" element={<Media />} />
        <Route path="fique-por-dentro" element={<Feed />} />
        <Route path="socios" element={<Socios />} />
        <Route path="doar" element={<Donate />} />
        <Route path="contato" element={<Contact />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="transparencia" element={<Transparency />} />

        <Route path="login" element={<Login />} />
        <Route path="cadastro" element={<Signup />} />
        <Route path="recuperar-senha" element={<ForgotPassword />} />
        <Route path="redefinir-senha" element={<ResetPassword />} />

        <Route
          path="minha-conta"
          element={
            <RequireAuth>
              <Suspense fallback={<Carregando />}>
                <Account />
              </Suspense>
            </RequireAuth>
          }
        />

        <Route path="admin" element={admin(<Dashboard />)} />
        <Route path="admin/campanhas" element={admin(<AdminCampaigns />)} />
        <Route path="admin/noticias" element={admin(<AdminNews />)} />
        <Route path="admin/midia" element={admin(<AdminMedia />)} />
        <Route path="admin/doacoes" element={admin(<AdminDonations />)} />
        <Route path="admin/selos" element={admin(<AdminBadges />)} />
        <Route path="admin/mensagens" element={admin(<AdminMessages />)} />
        <Route path="admin/ranking" element={admin(<AdminRanking />)} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
