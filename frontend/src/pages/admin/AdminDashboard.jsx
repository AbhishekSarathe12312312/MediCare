import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  LogOut,
  Menu,
  X,
  Clock3,
  CheckCircle2,
  CircleX,
  Activity,
  ShieldCheck,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // Fetch Admin Dashboard
  // =========================

  const fetchDashboard = async (token) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("FETCH ADMIN DASHBOARD ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        toast.error("Session expired. Please login again.");

        navigate("/admin/login");
        return;
      }

      if (error.response?.status === 403) {
        toast.error("Access denied");
        navigate("/admin/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedAdmin = sessionStorage.getItem("user");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }

    fetchDashboard(token);
  }, []);

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/admin/login");
  };

  // =========================
  // Navigation
  // =========================

  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  // =========================
  // Stats
  // =========================

  const statCards = [
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      icon: Stethoscope,
      description: "Registered doctors",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      description: "Registered patients",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: CalendarDays,
      description: "All appointments",
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Clock3,
      description: "Waiting for action",
    },
  ];

  const appointmentStats = [
    {
      title: "Pending",
      value: stats.pendingAppointments,
      icon: Clock3,
    },
    {
      title: "Confirmed",
      value: stats.confirmedAppointments,
      icon: CheckCircle2,
    },
    {
      title: "Completed",
      value: stats.completedAppointments,
      icon: Activity,
    },
    {
      title: "Cancelled",
      value: stats.cancelledAppointments,
      icon: CircleX,
    },
  ];

  return (
    <div className="min-h-screen bg-[#07111f] text-white selection:bg-cyan-500 selection:text-gray-950 mt-15">
      {/* Main Container (No Navbar, No Sidebar) */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Top Header Bar with Admin Profile & Navigation */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-5 backdrop-blur-md shadow-lg shadow-cyan-500/5">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Welcome back,{" "}
              <span className="text-cyan-400">
                {admin?.name?.split(" ")[0] || "Admin"}
              </span>
            </h3>
            <p className="mt-0.5 text-xs text-gray-400">
              Here&apos;s what&apos;s happening in your hospital today.
            </p>
          </div>
        </div>

        {/* =========================
            Main Stats
        ========================= */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-5 transition hover:border-cyan-500/30 shadow-lg shadow-cyan-500/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      {card.title}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                      {loading ? "—" : card.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <Icon size={21} className="text-cyan-400" />
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">{card.description}</p>
              </div>
            );
          })}
        </div>

        {/* =========================
            Appointment Overview
        ========================= */}
        <div className="mt-8">
          <div className="mb-5">
            <h3 className="text-base font-bold text-white">
              Appointment Overview
            </h3>
            <p className="mt-0.5 text-xs text-gray-400">
              Current appointment status
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {appointmentStats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-5 transition hover:border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <Icon size={21} className="text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      {item.title}
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                      {loading ? "—" : item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================
            Quick Actions
        ========================= */}
        <div className="mt-8">
          <h3 className="mb-5 text-base font-bold text-white">Quick Actions</h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate("/admin/doctors")}
              className="group rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-5 text-left transition hover:border-cyan-500/40 hover:bg-[#0e1c30] shadow-lg shadow-cyan-500/5 cursor-pointer"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                <Stethoscope size={21} className="text-cyan-400" />
              </div>

              <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">
                Manage Doctors
              </h4>

              <p className="mt-1 text-xs text-gray-400">
                Create, edit and manage doctors
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/patients")}
              className="group rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-5 text-left transition hover:border-cyan-500/40 hover:bg-[#0e1c30] shadow-lg shadow-cyan-500/5 cursor-pointer"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                <Users size={21} className="text-cyan-400" />
              </div>

              <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">
                Manage Patients
              </h4>

              <p className="mt-1 text-xs text-gray-400">
                View and manage patient accounts
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/appointments")}
              className="group rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-5 text-left transition hover:border-cyan-500/40 hover:bg-[#0e1c30] shadow-lg shadow-cyan-500/5 cursor-pointer"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                <CalendarDays size={21} className="text-cyan-400" />
              </div>

              <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">
                Manage Appointments
              </h4>

              <p className="mt-1 text-xs text-gray-400">
                Monitor all appointments
              </p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="py-8 text-center">
          <p className="text-xs text-gray-500 font-medium">
            MediCare Admin Portal &copy; 2026
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
