import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBullhorn,
  FaCalendarAlt,
  FaFileAlt,
  FaUsers,
  FaCogs,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

import AdminLayout from "../AdminLayout";
import { PageHeader } from "../components/AdminUI";

import {
  articlesAPI,
  updatesAPI,
  teamAPI,
  contactAPI,
  calendarAPI,
  servicesAPI,
} from "../../services/api";

function StatCard({ label, value, to, icon: Icon }) {
  return (
    <Link
      to={to}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        textDecoration: "none",
      }}
    >
      <div style={{ color: "var(--accent)" }}>
        <Icon size={22} />
      </div>

      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          color: "var(--fg)",
          fontFamily: "var(--font-display)",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "var(--muted)",
          fontSize: "0.85rem",
        }}
      >
        {label}
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const results = await Promise.allSettled([
          articlesAPI.getAll(),
          updatesAPI.getAll(),
          teamAPI.getAll(),
          contactAPI.getAll(),
          calendarAPI.getAll(),
          servicesAPI.getAll(),
        ]);

        const [
          articlesRes,
          updatesRes,
          teamRes,
          leadsRes,
          calendarRes,
          servicesRes,
        ] = results;

        const articles =
          articlesRes.status === "fulfilled" ? articlesRes.value : [];

        const updates =
          updatesRes.status === "fulfilled" ? updatesRes.value : [];

        const team = teamRes.status === "fulfilled" ? teamRes.value : [];

        const leads = leadsRes.status === "fulfilled" ? leadsRes.value : [];

        const calendar =
          calendarRes.status === "fulfilled" ? calendarRes.value : [];

        const services =
          servicesRes.status === "fulfilled" ? servicesRes.value : [];



        setStats({
          articles: articles.length,
          updates: updates.length,
          team: team.length,
          leads: leads.length,
          unreadLeads: leads.filter((lead) => !lead.read).length,
          calendar: calendar.length,
          services: services.length,

          recentLeads: leads.slice(0, 5),
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      }
    }

    loadDashboard();
  }, []);

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your website content & leads"
      />

      {error && (
        <p style={{ color: "#e57373", marginBottom: "1rem" }}>{error}</p>
      )}

      {!stats ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <StatCard
              label={`Contact Leads (${stats.unreadLeads} new)`}
              value={stats.leads}
              to="/admin/leads"
              icon={HiOutlineMail}
            />

            <StatCard
              label="Services"
              value={stats.services}
              to="/admin/services"
              icon={FaCogs}
            />

            <StatCard
              label="Articles"
              value={stats.articles}
              to="/admin/articles"
              icon={FaFileAlt}
            />

            <StatCard
              label="Updates"
              value={stats.updates}
              to="/admin/updates"
              icon={FaBullhorn}
            />

            <StatCard
              label="Team Members"
              value={stats.team}
              to="/admin/team"
              icon={FaUsers}
            />

            <StatCard
              label="Calendar Entries"
              value={stats.calendar}
              to="/admin/calendar"
              icon={FaCalendarAlt}
            />


          </div>

          <h2
            style={{
              fontSize: "1.05rem",
              color: "var(--fg)",
              marginBottom: "1rem",
              fontFamily: "var(--font-display)",
            }}
          >
            Recent Leads
          </h2>

          {stats.recentLeads.length === 0 ? (
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.875rem",
              }}
            >
              No leads yet.
            </p>
          ) : (
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
              }}
            >
              {stats.recentLeads.map((lead, index) => (
                <div
                  key={lead._id || index}
                  style={{
                    padding: "1rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom:
                      index < stats.recentLeads.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    background: "var(--card-bg)",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        color: "var(--fg)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {lead.name}
                    </strong>

                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {lead.email}
                    </div>
                  </div>

                  {!lead.read && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        padding: "2px 10px",
                        borderRadius: "100px",
                        background: "var(--accent-dim)",
                        color: "var(--accent)",
                      }}
                    >
                      NEW
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
