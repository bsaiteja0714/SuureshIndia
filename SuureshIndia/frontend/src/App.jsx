import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import { Team, Journal, Updates, ComplianceCalendar } from "./pages/Pages";
import { Terms, Privacy, Disclaimer, Sitemap } from "./pages/LegalPages";
import Downloads from "./pages/Downloads";

import { AuthProvider } from "./admin/AuthContext";
import ProtectedRoute from "./admin/ProtectedRoute";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import ArticlesAdmin from "./admin/pages/Articles";
import UpdatesAdmin from "./admin/pages/Updates";
import CalendarAdmin from "./admin/pages/CalendarAdmin";
import TeamAdmin from "./admin/pages/TeamAdmin";
import Leads from "./admin/pages/Leads";
import Settings from "./admin/pages/Settings";
import FeedbackAdmin from "./admin/pages/FeedbackAdmin";
import FilesAdmin from "./admin/pages/FilesAdmin";
import ServicesAdmin from "./admin/pages/ServicesAdmin";

import HomePageAdmin from "./admin/pages/HomePageAdmin";
import OrgSettings from "./admin/pages/OrgSettings";
import SocialLinksAdmin from "./admin/pages/SocialLinksAdmin";
import PolicyAdmin from "./admin/pages/PolicyAdmin";
import ArticleDetails from "./pages/ArticleDetails";
import UpdateDetails from "./pages/UpdateDetails";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public website */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/calendar" element={<ComplianceCalendar />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/journal/:id" element={<ArticleDetails />} />
          <Route path="/updates/:id" element={<UpdateDetails />} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/home"
            element={
              <ProtectedRoute>
                <HomePageAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <ServicesAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles"
            element={
              <ProtectedRoute>
                <ArticlesAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/updates"
            element={
              <ProtectedRoute>
                <UpdatesAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/calendar"
            element={
              <ProtectedRoute>
                <CalendarAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/team"
            element={
              <ProtectedRoute>
                <TeamAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute>
                <Leads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute>
                <FeedbackAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/files"
            element={
              <ProtectedRoute>
                <FilesAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/org"
            element={
              <ProtectedRoute>
                <OrgSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/social"
            element={
              <ProtectedRoute>
                <SocialLinksAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/policies/privacy"
            element={
              <ProtectedRoute>
                <PolicyAdmin type="privacy" title="Privacy Policy" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/policies/terms"
            element={
              <ProtectedRoute>
                <PolicyAdmin type="terms" title="Terms & Conditions" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/policies/disclaimer"
            element={
              <ProtectedRoute>
                <PolicyAdmin type="disclaimer" title="Disclaimer" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
